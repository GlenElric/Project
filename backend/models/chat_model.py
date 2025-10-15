from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    emotion: str  # User's detected emotion

class ChatResponse(BaseModel):
    response: str
    emotion: str  # AI's response emotion