from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from ..utils.avatar_mapper import AVATAR_MAP

router = APIRouter(prefix="/avatar", tags=["avatar"])

@router.get("/{video_name}")
async def get_avatar_video(video_name: str):
    """
    Serve the avatar video file.
    """
    if video_name not in AVATAR_MAP.values():
        raise HTTPException(status_code=404, detail="Video not found")

    video_path = os.path.join("frontend/public/videos", video_name)
    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video not found")
    return FileResponse(video_path)
