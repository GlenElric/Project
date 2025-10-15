from pydantic import BaseModel

class SpeechRequest(BaseModel):
    audio: str  # Base64 encoded audio data
    emotion: str  # Detected emotion

class SpeechResponse(BaseModel):
    transcription: str
    chat_response: str
    emotion: str
    audio_base64: str

class TTSRequest(BaseModel):
    text: str

class TTSResponse(BaseModel):
    audio: str  # Base64 encoded audio data