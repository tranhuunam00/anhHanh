"""MinIO S3 Object Storage Service for DailyDictation Studio.
Handles automated bucket provisioning, public download permissions, file upload, and image retrieval.
"""
import os
import io
import json
import uuid
import logging
from typing import Optional, Tuple
from minio import Minio
from minio.error import S3Error

logger = logging.getLogger(__name__)

# Environment Configuration
DEFAULT_MINIO_HOST = "minio:9100" if os.getenv("RUNNING_IN_DOCKER") else "localhost:9100"
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", DEFAULT_MINIO_HOST)
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin123")
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() in ("true", "1", "t", "yes")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "feedback-images")
MINIO_PUBLIC_URL = os.getenv("MINIO_PUBLIC_URL", "").rstrip("/")

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB limit


def get_minio_client() -> Minio:
    """Instantiate and return MinIO client instance."""
    # Clean endpoint string if http/https prefix was supplied in env
    endpoint = MINIO_ENDPOINT.replace("http://", "").replace("https://", "")
    return Minio(
        endpoint=endpoint,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=MINIO_SECURE,
    )


def ensure_bucket_and_policy() -> bool:
    """Ensure MinIO bucket exists and set public download policy (s3:GetObject).
    Allows user to run 1 script without manual MinIO console permission setup.
    """
    try:
        client = get_minio_client()
        bucket = MINIO_BUCKET_NAME

        # 1. Create bucket if missing
        if not client.bucket_exists(bucket):
            client.make_bucket(bucket)
            logger.info(f"Created MinIO bucket: '{bucket}'")
        else:
            logger.info(f"MinIO bucket '{bucket}' already exists.")

        # 2. Configure public download policy for bucket
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": ["*"]},
                    "Action": ["s3:GetObject"],
                    "Resource": [f"arn:aws:s3:::{bucket}/*"],
                }
            ],
        }

        client.set_bucket_policy(bucket, json.dumps(policy))
        logger.info(f"Configured public read permission policy for MinIO bucket '{bucket}'.")
        return True

    except Exception as e:
        logger.warning(f"Could not initialize MinIO bucket or policy (MinIO may still be starting): {e}")
        return False


def upload_feedback_image(file_data: bytes, original_filename: str, content_type: str) -> str:
    """Upload feedback image to MinIO and return access URL."""
    if len(file_data) > MAX_FILE_SIZE_BYTES:
        raise ValueError("Kích thước ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.")

    norm_type = content_type.lower()
    if norm_type not in ALLOWED_IMAGE_TYPES:
        # Check by extension if content-type is octet-stream
        ext = os.path.splitext(original_filename)[1].lower()
        if ext in (".jpg", ".jpeg"):
            norm_type = "image/jpeg"
        elif ext == ".png":
            norm_type = "image/png"
        elif ext == ".gif":
            norm_type = "image/gif"
        elif ext == ".webp":
            norm_type = "image/webp"
        else:
            raise ValueError("Định dạng file không hỗ trợ. Vui lòng tải ảnh PNG, JPG, WEBP hoặc GIF.")

    ext = ALLOWED_IMAGE_TYPES.get(norm_type, ".jpg")
    object_name = f"feedback_{uuid.uuid4().hex}{ext}"

    # Ensure bucket & policy before uploading
    ensure_bucket_and_policy()

    client = get_minio_client()
    data_stream = io.BytesIO(file_data)
    
    client.put_object(
        bucket_name=MINIO_BUCKET_NAME,
        object_name=object_name,
        data=data_stream,
        length=len(file_data),
        content_type=norm_type,
    )

    logger.info(f"Uploaded feedback image to MinIO bucket '{MINIO_BUCKET_NAME}': {object_name}")

    # Return proxy image endpoint path for seamless browser rendering across all environments
    return f"/api/feedback/images/{object_name}"


def get_feedback_image(object_name: str) -> Tuple[bytes, str]:
    """Retrieve image file bytes and content type from MinIO bucket."""
    client = get_minio_client()
    try:
        response = client.get_object(MINIO_BUCKET_NAME, object_name)
        data = response.read()
        content_type = response.headers.get("content-type", "image/jpeg")
        response.close()
        response.release_conn()
        return data, content_type
    except S3Error as e:
        logger.error(f"S3 Error retrieving image '{object_name}': {e}")
        raise FileNotFoundError(f"Không tìm thấy ảnh {object_name}")
