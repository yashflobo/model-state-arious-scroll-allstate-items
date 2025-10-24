import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { Scene3D } from './Scene3D';
import * as THREE from 'three';

interface Canvas3DProps {
  position?: { x: number; y: number; z: number };
  scale?: number;
  rotation?: { x: number; y: number; z: number };
  sensitivity?: number;
  onAnimationProgress?: (progress: number) => void;
  onSceneReady?: (scene: THREE.Group) => void;
  ctMachineVisible: boolean;
  ctMachinePosition: { x: number; y: number; z: number };
  ctMachineRotation: { x: number; y: number; z: number };
  ctMachineScale: number;
}

export const Canvas3D = ({ 
  position, 
  scale, 
  rotation, 
  sensitivity, 
  onAnimationProgress, 
  onSceneReady,
  ctMachineVisible,
  ctMachinePosition,
  ctMachineRotation,
  ctMachineScale
}: Canvas3DProps) => {
  return (
    <div className="w-full h-screen">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[10, 10, 5]} intensity={0.5} color="#6366f1" />

        {/* 3D Model with CT Machine as child */}
        <Scene3D 
          position={position} 
          scale={scale} 
          rotation={rotation} 
          sensitivity={sensitivity} 
          onAnimationProgress={onAnimationProgress}
          onSceneReady={onSceneReady}
          ctMachineVisible={ctMachineVisible}
          ctMachinePosition={ctMachinePosition}
          ctMachineRotation={ctMachineRotation}
          ctMachineScale={ctMachineScale}
        />

        {/* Environment for reflections */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
