import React from 'react';
import './ChatInterface.css';

const ChatInterface = ({ messages }) => {
  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;