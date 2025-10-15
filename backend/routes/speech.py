import logging
from fastapi import APIRouter, HTTPException
from models.speech_model import SpeechRequest, SpeechResponse, TTSRequest, TTSResponse
from utils.speech_to_text import transcribe_audio
from utils.text_to_speech import synthesize_speech
from utils.ai_chat import generate_response

logging.basicConfig(level=logging.DEBUG)

router = APIRouter(prefix="/speech", tags=["speech"])

@router.post("/transcribe", response_model=SpeechResponse)
async def transcribe_speech(request: SpeechRequest):
    """
    Transcribe speech from base64 encoded audio data and generate chat response.
    """
    try:
        transcription = transcribe_audio(request.audio)
        emotion = request.emotion
        chat_response = generate_response(transcription, emotion)
        logging.info(f"Generated chat response: '{chat_response[:50]}...'")
        audio_base64 = synthesize_speech(chat_response)
        if not audio_base64:
            logging.warning("synthesize_speech returned empty audio_base64")
        else:
            logging.info(f"Generated audio_base64 of length: {len(audio_base64)}")
        return SpeechResponse(transcription=transcription, chat_response=chat_response, emotion=emotion, audio_base64=audio_base64)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech transcription failed: {str(e)}")

@router.post("/synthesize", response_model=TTSResponse)
async def synthesize_speech_route(request: TTSRequest):
    """
    Synthesize speech from text.
    """
    try:
        audio = synthesize_speech(request.text)
        return TTSResponse(audio=audio)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech synthesis failed: {str(e)}")