from pydantic import BaseModel

class EmotionRequest(BaseModel):
    image: str  # Base64 encoded image

class EmotionResponse(BaseModel):
    emotion: str
    confidence: float
    avatar_path: str