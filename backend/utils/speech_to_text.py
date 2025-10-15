import base64
import io
import os
import tempfile
import subprocess
import shutil
import logging
import speech_recognition as sr

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def transcribe_audio(audio_base64: str) -> str:
    """
    Transcribe audio from base64 encoded data using Google Speech Recognition.
    Handles WebM audio format.
    Returns transcribed text.
    """
    try:
        # Find ffmpeg executable
        ffmpeg_path = shutil.which('ffmpeg')
        if not ffmpeg_path:
            raise FileNotFoundError("ffmpeg not found in PATH")

        logging.info(f"Starting transcription for base64 data of length: {len(audio_base64)}")

        # Decode base64 audio
        audio_data = base64.b64decode(audio_base64)
        logging.info(f"Decoded audio data length: {len(audio_data)} bytes")

        # Validate if data looks like a valid audio file (basic check)
        if len(audio_data) < 4:
            raise ValueError("Audio data too short")
        # WebM/Matroska starts with EBML header: 0x1A 0x45 0xDF 0xA3
        if not audio_data.startswith(b'\x1aE\xdf\xa3'):
            logging.warning("Audio data does not start with EBML header - may not be WebM format")

        # Save to temporary file without extension for FFmpeg auto-detection
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(audio_data)
            temp_path = temp_file.name
        temp_wav_path = temp_path + '.wav'
        logging.info(f"Saved temp file: {temp_path}, size: {os.path.getsize(temp_path)} bytes")

        # Convert audio to wav using ffmpeg with auto-detection
        try:
            logging.info(f"Running FFmpeg command: {ffmpeg_path} -i {temp_path} -acodec pcm_s16le -ar 16000 -ac 1 {temp_wav_path}")
            result = subprocess.run([
                ffmpeg_path, '-i', temp_path,
                '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1',
                temp_wav_path
            ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
            if result.stderr:
                logging.warning(f"FFmpeg stderr: {result.stderr}")
            else:
                logging.info("FFmpeg conversion completed successfully")

            logging.info(f"WAV file created: {temp_wav_path}, size: {os.path.getsize(temp_wav_path)} bytes")

            # Perform speech recognition using Google Speech Recognition
            r = sr.Recognizer()
            with sr.AudioFile(temp_wav_path) as source:
                audio_data = r.record(source)
                logging.info("Recording audio data from WAV file")
                transcript = r.recognize_google(audio_data)
            logging.info(f"Transcription result: '{transcript}'")
            return transcript
        finally:
            # Clean up temporary files
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                logging.info(f"Cleaned up temp file: {temp_path}")
            if os.path.exists(temp_wav_path):
                os.unlink(temp_wav_path)
                logging.info(f"Cleaned up temp wav file: {temp_wav_path}")
    except Exception as e:
        logging.error(f"Error transcribing audio: {e}", exc_info=True)
        return ""