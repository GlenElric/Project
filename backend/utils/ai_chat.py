import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
# Configure Google Gemini API
api_key = os.environ.get("GOOGLE_API_KEY")
print(f"Debug: GOOGLE_API_KEY set: {bool(api_key)}")
genai.configure(api_key=api_key)

# Initialize the model
model_name = 'gemini-2.5-flash'  # Corrected model name
print(f"Debug: Using model: {model_name}")
model = genai.GenerativeModel(model_name)

def generate_response(message: str, emotion: str) -> str:
    """
    Generate AI response based on user message and detected emotion using Google Gemini.
    """
    print(f"Debug: Generating response for message: '{message}', emotion: '{emotion}'")
    system_prompt = f"You are a friendly and empathetic AI assistant. The user appears to be feeling {emotion}. Respond in a way that acknowledges their emotion and engages naturally."

    full_prompt = system_prompt + "\n\nUser: " + message

    try:
        # Generate response using Gemini
        print("Debug: Calling Gemini generate_content")
        response = model.generate_content(full_prompt)
        print(f"Debug: Received response: {response.text.strip()}")
        return response.text.strip()
    except genai.types.generation_types.BlockedPromptException as e:
        print(f"Debug: Blocked prompt error: {e}")
        return "I'm sorry, that request was blocked. Can you rephrase?"
    except genai.types.generation_types.StopCandidateException as e:
        print(f"Debug: Stop candidate error: {e}")
        return "I'm sorry, I couldn't generate a response. Try again."
    except Exception as e:
        print(f"Debug: General error generating AI response: {e}")
        return "I'm sorry, I couldn't process that. Can you try again?"