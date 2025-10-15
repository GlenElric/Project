# Voice Chat Agent System Architecture

## Overview
A real-time, voice-based chatting agent with emotional intelligence and dynamic responses based on facial expression analysis. The system supports continuous conversation until stopped, with emotion-influenced responses and human-like interactions.

## Components

### Backend (Python with FastAPI)
- **Framework**: FastAPI for high-performance async APIs
- **Emotion Detection**: DeepFace (with OpenCV backend) for facial expression recognition
- **AI Integration**: Google Gemini 2.5 Flash for conversational AI
- **Voice Processing**: Google Speech Recognition for speech-to-text, pyttsx3 for text-to-speech

#### Backend Modules
- `app/`: Main application code (initialization and configuration)
- `models/`: Pydantic models for data validation
  - `chat_model.py`: Models for chat requests/responses
  - `emotion_model.py`: Models for emotion detection requests/responses
  - `speech_model.py`: Models for speech processing requests/responses
- `routes/`: API routes and WebSocket endpoints
  - `emotion.py`: Emotion detection endpoints
  - `chat.py`: AI chat response generation
  - `speech.py`: Speech-to-text and text-to-speech endpoints
- `utils/`: Utility functions (emotion analysis, voice processing)
  - `emotion_detector.py`: DeepFace-based emotion detection
  - `ai_chat.py`: Google Gemini AI integration for responses
  - `speech_to_text.py`: Audio transcription using Google Speech Recognition
  - `text_to_speech.py`: Text-to-speech synthesis using pyttsx3
- `tests/`: Unit and integration tests (currently empty)
- `main.py`: FastAPI application entry point
- `requirements.txt`: Python dependencies
- `.env`: Environment variables (Google API key)

#### Key Features
- Real-time emotion detection from webcam feed
- Speech-to-text conversion
- AI-powered response generation influenced by detected emotions
- Text-to-speech synthesis using pyttsx3 engine

### Frontend (React with Dark Theme)
- **Framework**: React 18 with hooks
- **Styling**: CSS modules and custom CSS for dark theme
- **Animation**: React Three Fiber (Three.js) for 3D avatar animations, custom CSS animations
- **AR**: AR.js for augmented reality capabilities
- **Real-time**: RESTful API calls (WebSocket not currently implemented)
- **Camera**: WebRTC MediaStream API for camera access

#### Frontend Structure
- `src/`: Main source code
  - `App.js`: Main application component with emotion detection and voice controls
  - `index.js`: React application entry point
  - `App.css`, `index.css`: Styling files
- `components/`: Reusable UI components
  - `Avatar.js`: 3D avatar component with emotion-based animations
  - `ARAvatar.js`: Augmented reality avatar with surface detection
  - `VoiceControls.js`: Voice recording controls with wave animation
  - `ChatInterface.js`: Chat message display component
  - `Loader.js`: Loading indicator component
  - `WaveAnimation.js`: Audio visualization component
- `hooks/`: Custom React hooks (currently empty)
- `utils/`: Frontend utilities (currently empty)
- `public/`: Static assets including 3D models and audio files
- `package.json`: Node.js dependencies and scripts

#### Key Features
- Dark-themed UI with mode switching (Normal/AR Mode)
- 3D animated avatar responding to different states (idle, listening, thinking, speaking)
- Augmented Reality mode with surface detection and avatar placement
- Voice input/output controls with visual feedback
- Real-time emotion detection from camera feed
- Audio recording and playback functionality

## Data Flow

1. **User Input**:
   - Webcam captures facial expressions
   - Microphone captures voice input

2. **Frontend Processing**:
    - Captures video frames from camera for emotion detection
    - Records audio using WebRTC MediaRecorder API (WebM format)
    - Sends base64-encoded image data to backend for emotion analysis
    - Sends base64-encoded audio data to backend for transcription

3. **Backend Processing**:
    - Emotion detection uses DeepFace to analyze facial expressions from JPEG images
    - Speech-to-text converts WebM audio to WAV using ffmpeg, then uses Google Speech Recognition
    - AI generates emotion-influenced responses using Google Gemini with context about user's detected emotion
    - Text-to-speech synthesizes responses using pyttsx3 engine

4. **Response**:
    - Backend returns transcribed text, AI response, updated emotion, and synthesized audio
    - Frontend plays base64-encoded audio and updates avatar animation states
    - Avatar transitions through states: listening → thinking → speaking → idle

## API Endpoints

### REST APIs
- `GET /`: Health check endpoint
- `POST /emotion/analyze`: Analyze emotion from base64-encoded image (returns emotion and confidence)
- `POST /speech/transcribe`: Transcribe speech and generate AI response (returns transcription, chat response, emotion, and audio)
- `POST /speech/synthesize`: Convert text to speech (returns base64-encoded audio)
- `POST /chat/respond`: Generate AI response based on message and emotion (returns response text and emotion)

## Technologies
- **Backend**: Python 3.11, FastAPI, Uvicorn, DeepFace, Google Generative AI, SpeechRecognition, pyttsx3, ffmpeg
- **Frontend**: React 18, Three.js (@react-three/fiber, @react-three/drei), AR.js, WebRTC API
- **Communication**: RESTful HTTP APIs, JSON payloads
- **Deployment**: Local development (Docker/Kubernetes planned for future)

## Data Formats and Protocols
- **Communication**: RESTful HTTP APIs with JSON request/response bodies
- **Audio Format**: Base64-encoded WebM audio (converted to WAV internally using ffmpeg)
- **Video Format**: Base64-encoded JPEG images for emotion detection
- **Audio Output**: Base64-encoded WAV audio synthesized with pyttsx3

## Security Considerations
- Input validation using Pydantic models
- Base64 encoding for binary data transfer
- Environment variable management for API keys
- CORS configuration for development
- File upload size limits (implicit through base64 size)
- Rate limiting should be implemented for production

## Performance and Limitations
- **Current Architecture**: Stateless REST APIs, no session management
- **Processing Time**: Emotion detection (~2-3 seconds), speech processing (~5-10 seconds)
- **Memory Usage**: Temporary files for audio processing, base64 overhead
- **Concurrent Users**: Limited by backend processing capacity and API rate limits
- **Browser Compatibility**: Modern browsers with WebRTC support required
- **Network Bandwidth**: High bandwidth usage due to base64-encoded media transfer

## Future Enhancements
- WebSocket implementation for real-time communication
- Streaming audio processing to reduce latency
- Redis caching for emotion analysis results
- Database integration for conversation history
- User authentication and session management
- Docker containerization for deployment
- Kubernetes orchestration for scaling

## Deployment
- Backend: Docker container with Python
- Frontend: Static build served via Nginx
- Orchestration: Docker Compose for development, Kubernetes for production

### Prerequisites
- Python 3.11+
- Node.js 16+
- ffmpeg installed and available in PATH
- Google Gemini API key (set as GOOGLE_API_KEY environment variable)

### Environment Setup
- Create `.env` file in backend directory with `GOOGLE_API_KEY=your_key_here`

### Running Locally
1. Backend:
    - cd backend
    - pip install -r requirements.txt
    - python main.py
    - Server runs on http://localhost:8000

2. Frontend:
    - cd frontend
    - npm install
    - npm start
    - App runs on http://localhost:3000

### Key Dependencies
**Backend:**
- fastapi, uvicorn: Web framework
- deepface: Emotion detection
- google-generativeai: AI responses
- SpeechRecognition: Speech-to-text
- pyttsx3: Text-to-speech
- opencv-python, pillow, numpy: Image processing

**Frontend:**
- react: UI framework
- @react-three/fiber, @react-three/drei: 3D rendering
- ar.js: Augmented reality
- three: 3D graphics

### Production Deployment
- Build frontend: npm run build
- Serve static files with Nginx or similar
- Deploy backend with gunicorn or uvicorn behind reverse proxy