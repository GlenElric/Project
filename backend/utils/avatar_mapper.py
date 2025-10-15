import os

AVATAR_MAP = {
    "happy": "happy.mp4",
    "sad": "sad.mp4",
    "angry": "angry.mp4",
    "neutral": "neutral.mp4",
    "surprise": "surprise.mp4",
    "fear": "fear.mp4",
    "disgust": "disgust.mp4"
}

def get_avatar_path(emotion: str) -> str:
    """
    Get the avatar video path for a given emotion.
    """
    video_filename = AVATAR_MAP.get(emotion.lower(), AVATAR_MAP["neutral"])
    return f"/avatar/{video_filename}"
