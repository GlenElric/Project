from fastapi import APIRouter, HTTPException
from models.chat_model import ChatRequest, ChatResponse
from utils.ai_chat import generate_response

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/respond", response_model=ChatResponse)
async def chat_response(request: ChatRequest):
    """
    Generate AI response based on user message and emotion.
    """
    try:
        response_text = generate_response(request.message, request.emotion)
        return ChatResponse(response=response_text, emotion="neutral")  # Simplified
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI response generation failed: {str(e)}")