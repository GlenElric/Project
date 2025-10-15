import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const ARAvatarModel = ({ state }) => {
  const gltf = useGLTF('/models/scene.gltf');
  const meshRef = useRef();

  // Initialize position once on mount - AR avatar stays FIXED on surface
  useEffect(() => {
    if (meshRef.current) {
      // Set fixed position on "surface" - no dynamic changes
      meshRef.current.position.set(0, 0, 0);
      meshRef.current.scale.setScalar(0.8); // Smaller scale for AR realism
    }
  }, []);

  useFrame((frameState, delta) => {
    if (!meshRef.current) return;

    // ONLY animate rotation/scale for expressions - POSITION IS FIXED
    switch (state) {
      case 'listening':
        meshRef.current.rotation.x = Math.sin(frameState.clock.elapsedTime * 2) * 0.05;
        break;
      case 'thinking':
        meshRef.current.rotation.z = Math.sin(frameState.clock.elapsedTime * 0.5) * 0.1;
        meshRef.current.rotation.y += delta * 0.3;
        break;
      case 'speaking':
        meshRef.current.rotation.y += Math.sin(frameState.clock.elapsedTime * 5) * 0.02;
        meshRef.current.scale.setScalar(0.85); // Slightly larger when speaking
        break;
      default:
        meshRef.current.rotation.x = 0;
        meshRef.current.rotation.z = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.scale.setScalar(0.8); // Back to base AR scale
    }
  });

  return <primitive ref={meshRef} object={gltf.scene} />;
};

const ARAvatar = ({ state }) => {
  const videoRef = useRef();
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [isDetecting, setIsDetecting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        // Use front camera for desktop compatibility
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user', // Front camera works on all devices
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => {
              console.error('Video play failed:', err);
              setError('Failed to start camera. Please refresh and try again.');
            });
          };
        }

        // Simulate surface detection process
        setTimeout(() => {
          setIsDetecting(false);
          setSurfaceDetected(true);
          console.log('Surface detected - avatar should appear');
        }, 1500); // Faster detection for testing
      } catch (err) {
        console.error('Camera access failed:', err);
        setError('Camera access denied. Please enable camera permissions.');
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h3>Camera Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Camera Feed Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)', // Mirror for natural feel
        }}
      />

      {/* Surface Detection Messages */}
      {isDetecting && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,165,0,0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.3)',
          zIndex: 1001
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }}></div>
          <h3 style={{ margin: '0 0 10px 0' }}>🔍 Detecting Surface</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Scanning for surfaces...<br />
            Point camera at a table, floor, or flat surface
          </p>
        </div>
      )}

      {!isDetecting && !surfaceDetected && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,0,0,0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.3)',
          zIndex: 1001
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>❌ No Surface Detected</h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
            Unable to detect a suitable surface.<br />
            Try moving closer to a flat surface or improve lighting.
          </p>
          <button
            onClick={() => {
              setIsDetecting(true);
              setTimeout(() => {
                setIsDetecting(false);
                setSurfaceDetected(true);
              }, 2000);
            }}
            style={{
              background: 'white',
              color: '#333',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Retry Detection
          </button>
        </div>
      )}

      {/* AR Avatar Overlay - Only show when surface is detected */}
      {surfaceDetected && (
        <>
          <div style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180px',
            height: '240px',
            pointerEvents: 'none',
            zIndex: 1000,
            animation: 'avatarFadeIn 0.5s ease-in',
            border: '2px solid rgba(0,255,0,0.5)',
            borderRadius: '10px'
          }}>
            <Canvas
              style={{
                background: 'transparent',
                width: '100%',
                height: '100%'
              }}
              camera={{
                position: [0, 0.15, 1.0],
                fov: 45
              }}
            >
              <ambientLight intensity={2.5} />
              <directionalLight position={[1, 2, 1]} intensity={1.8} />
              <pointLight position={[0, 0.5, 0]} intensity={0.8} />
              <ARAvatarModel state={state} />
            </Canvas>
          </div>

          {/* Avatar placement confirmation */}
          <div style={{
            position: 'absolute',
            bottom: '320px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,255,0,0.9)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: '600',
            zIndex: 1001,
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            🎭 Avatar placed on surface
          </div>

          {/* Surface Detected Indicator with Highlight */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,255,0,0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 1001,
            animation: 'pulse 2s infinite'
          }}>
            ✅ Surface Detected
          </div>
    
          {/* Surface Highlight Overlay */}
          {surfaceDetected && (
            <div style={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200px',
              height: '260px',
              border: '3px solid rgba(0,255,0,0.8)',
              borderRadius: '10px',
              pointerEvents: 'none',
              zIndex: 999,
              animation: 'highlightPulse 2s infinite'
            }}></div>
          )}
    
          <style>{`
            @keyframes highlightPulse {
              0%, 100% { border-color: rgba(0,255,0,0.8); box-shadow: 0 0 20px rgba(0,255,0,0.3); }
              50% { border-color: rgba(0,255,0,1); box-shadow: 0 0 30px rgba(0,255,0,0.6); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
          `}</style>
        </>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes highlightPulse {
          0%, 100% { border-color: rgba(0,255,0,0.8); box-shadow: 0 0 20px rgba(0,255,0,0.3); }
          50% { border-color: rgba(0,255,0,1); box-shadow: 0 0 30px rgba(0,255,0,0.6); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes avatarFadeIn {
          0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ARAvatar;