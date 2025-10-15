import React from 'react';
import './VoiceControls.css';
import WaveAnimation from './WaveAnimation';

const VoiceControls = ({ onStart, onStop, isListening }) => {
  return (
    <div className="voice-controls">
      <button
        className={`control-btn ${isListening ? 'active listening' : 'primary'}`}
        onClick={onStart}
        disabled={isListening}
      >
        
        <span className="btn-text">
          {isListening ? 'Listening...' : 'Start Voice'}
        </span>
      </button>
      <button
        className={`control-btn ${!isListening ? 'secondary stop' : 'disabled'}`}
        onClick={onStop}
        disabled={!isListening}
      >
        
        <span className="btn-text">Stop</span>
      </button>
      {isListening && <WaveAnimation />}
    </div>
  );
};

export default VoiceControls;