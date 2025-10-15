AVATAR_MAP = {
    "happy": "frontend/public/videos/happy.mp4",
    "sad": "frontend/public/videos/sad.mp4",
    "angry": "frontend/public/videos/angry.mp4",
    "neutral": "frontend/public/videos/neutral.mp4",
    "surprise": "frontend/public/videos/surprise.mp4",
    "fear": "frontend/public/videos/fear.mp4",
    "disgust": "frontend/public/videos/disgust.mp4"
}

def get_avatar_path(emotion: str) -> str:
    """
    Get the avatar video path for a given emotion.
    """
    return AVATAR_MAP.get(emotion.lower(), AVATAR_MAP["neutral"])
