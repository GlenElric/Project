from fastapi import APIRouter, HTTPException
from models.emotion_model import EmotionRequest, EmotionResponse
from utils.emotion_detector import detect_emotion

router = APIRouter(prefix="/emotion", tags=["emotion"])

@router.post("/analyze", response_model=EmotionResponse)
async def analyze_emotion(request: EmotionRequest):
    """
    Analyze emotion from base64 encoded image.
    """
    try:
        result = detect_emotion(request.image)
        return EmotionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emotion detection failed: {str(e)}")