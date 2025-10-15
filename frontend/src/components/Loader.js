import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="processing-indicator">
      <div className="indicator-ring"></div>
      <p className="processing-text">Processing...</p>
    </div>
  );
};

export default Loader;