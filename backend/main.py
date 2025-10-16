from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.emotion import router as emotion_router
from routes.speech import router as speech_router
from routes.chat import router as chat_router

app = FastAPI(
    title="Voice Chat Agent Backend",
    description="Real-time voice chatting agent with emotion detection and AI integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Voice Chat Agent Backend is running"}

app.include_router(emotion_router)
app.include_router(speech_router)
app.include_router(chat_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)