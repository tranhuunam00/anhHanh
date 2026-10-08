"""Tests verifying all authentic IELTS Task 1 prompts have valid metadata and physical images."""
import os
import pytest
from app.infrastructure.writing_prompts_en import CURATED_PROMPTS_EN
from app.infrastructure.ielts_prompts_bank import IELTS_TASK1_AUTHENTIC_PROMPTS
from app.infrastructure.ai_writing_service import AIWritingService


def test_ielts_task1_prompts_have_images_and_exist():
    """Verify that all Task 1 prompts have image_url and the corresponding image file exists on disk."""
    t1_prompts = CURATED_PROMPTS_EN["ielts_task1"]
    assert len(t1_prompts) >= 17, f"Expected at least 17 Task 1 prompts, got {len(t1_prompts)}"

    public_dir = os.path.join("frontend", "public")

    for idx, prompt in enumerate(t1_prompts):
        pid = prompt.get("id")
        title = prompt.get("title")
        sub_type = prompt.get("sub_type")
        img_url = prompt.get("image_url")

        # 1. Image URL must be defined
        assert img_url is not None and len(img_url) > 0, (
            f"Prompt #{idx+1} [{pid}] '{title}' is missing image_url!"
        )

        # 2. visual_data image_url must match
        vis_data = prompt.get("visual_data", {})
        assert vis_data.get("image_url") == img_url, (
            f"Prompt [{pid}] visual_data.image_url mismatch: {vis_data.get('image_url')} != {img_url}"
        )

        # 3. Physical file must exist in frontend/public
        rel_path = img_url.lstrip("/")
        full_path = os.path.join(public_dir, rel_path)
        assert os.path.isfile(full_path), (
            f"Image file for prompt [{pid}] not found on disk at: {full_path}"
        )

        # 4. Mandatory attributes check
        assert sub_type in ["line_graph", "bar_chart", "pie_chart", "table", "process", "map"]
        assert prompt.get("min_words") == 150
        assert prompt.get("recommended_time") == 20
        assert len(prompt.get("keywords", [])) > 0


def test_ai_writing_service_prompts_library_includes_task1_with_images():
    """Verify that AIWritingService.get_prompts_library delivers Task 1 with complete images."""
    lib = AIWritingService.get_prompts_library(language="en")
    t1 = lib.get("ielts_task1", [])
    assert len(t1) >= 17

    cam19_line = next((p for p in t1 if p.get("id") == "t1_cam19_line"), None)
    assert cam19_line is not None
    assert cam19_line["image_url"] == "/images/writing/uk_fuel_production_cam19.png"
    assert "visual_data" in cam19_line
    assert cam19_line["visual_data"]["type"] == "line_graph"
