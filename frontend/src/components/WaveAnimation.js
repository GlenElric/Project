import React from 'react';
import { motion } from 'framer-motion';

const WaveAnimation = () => {
  const bars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          style={{
            width: '4px',
            backgroundColor: '#007bff',
            margin: '0 2px',
            borderRadius: '2px',
          }}
          animate={{
            height: [20, 60, 20],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;