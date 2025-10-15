import base64
import cv2
import numpy as np
from PIL import Image
from deepface import DeepFace

def detect_emotion(image_base64: str) -> dict:
    """
    Detect emotion from base64 encoded image.
    Returns dict with emotion and confidence.
    """
    try:
        # Decode base64 to image
        image_data = base64.b64decode(image_base64)
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert BGR to RGB (OpenCV uses BGR by default)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Ensure dtype is uint8 for FER
        img = img.astype(np.uint8)

        # Log image properties
        print(f"Image shape: {img.shape}, dtype: {img.dtype}")

        # Use numpy array directly for DeepFace
        # Log before detection
        print(f"Image type before detection: {type(img)}, shape: {img.shape}")

        # Detect emotions using DeepFace
        try:
            analysis = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
            # Log after detection
            print(f"DeepFace analysis: {analysis}")

            if analysis and isinstance(analysis, list) and len(analysis) > 0:
                emotions = analysis[0]['emotion']
                dominant_emotion = max(emotions, key=emotions.get)
                confidence = emotions[dominant_emotion]
                return {"emotion": dominant_emotion, "confidence": confidence}
            else:
                return {"emotion": "neutral", "confidence": 0.0}
        except Exception as deepface_error:
            print(f"DeepFace error: {deepface_error}")
            return {"emotion": "neutral", "confidence": 0.0}
    except Exception as e:
        print(f"Error detecting emotion: {e}")
        return {"emotion": "neutral", "confidence": 0.0}