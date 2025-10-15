import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// Compatible GLTF avatar model: https://sketchfab.com/3d-models/robot-kyle-animated-rigged-3d-model-1234567890abcdef

const AvatarModel = ({ state, isARMode }) => {
  const gltf = useGLTF('/models/scene.gltf');
  const meshRef = useRef();

  useFrame((frameState, delta) => {
    if (!meshRef.current) return;

    switch (state) {
      case 'listening':
        // Come closer (zoom in) and tilt head/ears towards screen with pulsing effect
        const pulse = Math.sin(frameState.clock.elapsedTime * 6) * 0.05;
        meshRef.current.position.z = 2 + pulse; // Closer with pulse
        meshRef.current.rotation.x = Math.sin(frameState.clock.elapsedTime * 2) * 0.05; // Tilt head
        meshRef.current.rotation.y += Math.sin(frameState.clock.elapsedTime * 4) * 0.01; // Subtle ear wiggle
        break;
      case 'thinking':
        // Thinking pose: slight lean and slow rotation
        meshRef.current.rotation.z = Math.sin(frameState.clock.elapsedTime * 0.5) * 0.1; // Lean
        meshRef.current.rotation.y += delta * 0.3;
        break;
      case 'speaking':
        // Shake head and minor gesture (scale for emphasis)
        meshRef.current.rotation.y += Math.sin(frameState.clock.elapsedTime * 5) * 0.02; // Shake head
        meshRef.current.scale.setScalar(1 + Math.sin(frameState.clock.elapsedTime * 8) * 0.05); // Minor gesture
        break;
      default:
        // Idle: reset to original
        meshRef.current.position.z = 0;
        meshRef.current.rotation.x = 0;
        meshRef.current.rotation.z = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.scale.setScalar(1);
    }

    // AR mode adjustments - remove floating
    if (isARMode) {
      // Make avatar slightly smaller for AR
      meshRef.current.scale.setScalar(0.8);
    }
  });

  return <primitive ref={meshRef} object={gltf.scene} />;
};

const Avatar = ({ state, isARMode, className }) => {
  return (
    <div className={`avatar ${className || ''}`} style={{
      width: isARMode ? 'auto' : '300px',
      height: isARMode ? 'auto' : '400px'
    }}>
      <Canvas
        camera={{ position: [0, 0, isARMode ? 3 : 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={isARMode ? 1.0 : 0.5} />
        <directionalLight position={[10, 10, 5]} />
        <AvatarModel state={state} isARMode={isARMode} />
      </Canvas>
    </div>
  );
};

export default Avatar;