import base64
import logging
import os
import tempfile
import pyttsx3

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def synthesize_speech(text: str) -> str:
    """
    Synthesize speech from text using pyttsx3.
    Returns base64 encoded WAV audio data.
    """
    logging.info(f"Starting speech synthesis for text: '{text[:50]}...' (length: {len(text)})")
    try:
        # Create temporary file for audio
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            tmp_filename = tmp_file.name
        logging.info(f"Created temporary file: {tmp_filename}")

        # Initialize pyttsx3 engine and synthesize speech
        logging.info("Initializing pyttsx3 engine")
        engine = pyttsx3.init()
        # engine.say(text)
        engine.save_to_file(text, tmp_filename)
        engine.runAndWait()
        logging.info("Speech synthesis completed")

        # Read audio bytes from file
        with open(tmp_filename, 'rb') as f:
            audio_bytes = f.read()
        logging.info(f"Retrieved {len(audio_bytes)} bytes from file")

        # Clean up temporary file
        os.remove(tmp_filename)
        logging.info("Temporary file cleaned up")

        # Encode to base64
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        logging.info(f"Encoded to base64, length: {len(audio_base64)}")
        return audio_base64
    except Exception as e:
        logging.error(f"Error synthesizing speech: {e}", exc_info=True)
        return ""