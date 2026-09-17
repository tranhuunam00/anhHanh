import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from fastapi import Request, Response
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=['120/minute'])

MAX_PAYLOAD_BYTES = 512 * 1024  # 512KB payload protection


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Payload size guard
        content_length = request.headers.get('content-length')
        if content_length:
            try:
                if int(content_length) > MAX_PAYLOAD_BYTES:
                    return JSONResponse(
                        status_code=413,
                        content={'detail': 'Dung lượng yêu cầu vượt quá giới hạn cho phép (tối đa 512KB).'}
                    )
            except ValueError:
                pass

        # 2. Process request
        response: Response = await call_next(request)

        # 3. Apply HTTP Security Headers (Helmet Equivalent)
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response
