import React, { useState, useRef } from 'react';
import './App.css';
import Avatar from './components/Avatar';
import ARAvatar from './components/ARAvatar';
import VoiceControls from './components/VoiceControls';
import Loader from './components/Loader';

function App() {
  const [emotion, setEmotion] = useState('neutral');
  const [isListening, setIsListening] = useState(false);
  const [avatarState, setAvatarState] = useState('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        processAudio(chunks);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      setAvatarState('listening');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setAvatarState('thinking');
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const detectEmotion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setTimeout(async () => {
        const imageData = capturePhoto().split(',')[1];
        stream.getTracks().forEach(track => track.stop());
        const response = await fetch('http://localhost:8000/emotion/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageData }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEmotion(data.emotion);
        alert(`Detected emotion: ${data.emotion}`);
      }, 2000);
    } catch (error) {
      console.error('Error detecting emotion:', error);
      alert('Error accessing camera. Please check permissions.');
    }
  };

  const playAudio = (base64Audio) => {
    const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
    audio.play();
    audio.onended = () => setAvatarState('idle');
    setAvatarState('speaking');
  };

  const processAudio = async (chunks) => {
    setIsProcessing(true);
    const blob = new Blob(chunks, { type: 'audio/webm' });
    try {
      const base64Audio = await blobToBase64(blob);
      const response = await fetch('http://localhost:8000/speech/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio: base64Audio, emotion: emotion }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newEmotion = data.emotion;

      setEmotion(newEmotion);
      setIsProcessing(false);

      if (data.audio_base64) {
        playAudio(data.audio_base64);
      } else {
        setAvatarState('idle');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Error transcribing audio. Please try again.');
      setAvatarState('idle');
      setIsProcessing(false);
    }
  };

  const toggleARMode = async () => {
    if (!isARMode) {
      try {
        // Request camera for AR mode
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' } // Use front camera for desktop compatibility
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsARMode(true);
      } catch (error) {
        console.error('Error accessing camera for AR:', error);
        alert('Camera access required for AR mode.');
      }
    } else {
      // Stop camera stream when exiting AR mode
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsARMode(false);
    }
  };

  return (
    <div className="App">
      <div className="main-interface">
        <header className="header-section">
          <div className="title-brand">Voice Agent</div>
          <div className="mode-selector">
            <button
              className={`mode-btn ${!isARMode ? 'active' : ''}`}
              onClick={() => isARMode && toggleARMode()}
            >
              
              <span>Normal</span>
            </button>
            <button
              className={`mode-btn ${isARMode ? 'active' : ''}`}
              onClick={() => !isARMode && toggleARMode()}
            >
              
              <span>AR Mode</span>
            </button>
          </div>
        </header>

        <section className="avatar-display">
          {!isARMode && (
            <>
              <Avatar state={avatarState} isARMode={isARMode} />
              {isProcessing && <Loader />}
            </>
          )}
        </section>

        <footer className="controls-panel">
          <div className="control-group">
            <VoiceControls onStart={handleStart} onStop={handleStop} isListening={isListening} />
            <button className="control-btn primary" onClick={detectEmotion}>
              
              <span className="btn-text">Detect Emotion</span>
            </button>
          </div>
        </footer>

        {isARMode && (
          <>
            <div className="ar-portal">
              {isProcessing && <Loader />}
              <ARAvatar state={avatarState} />
            </div>
            <div className="ar-controls-panel">
              <VoiceControls onStart={handleStart} onStop={handleStop} isListening={isListening} />
              <button className="control-btn primary" onClick={detectEmotion}>
                <span className="btn-icon">😊</span>
                <span className="btn-text">Detect Emotion</span>
              </button>
            </div>
          </>
        )}

        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

export default App;