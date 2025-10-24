import { useRef, useMemo } from "react";
import { useGLTF, TransformControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CTMachineModelProps {
  visible: boolean;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  transformMode?: "translate" | "rotate" | "scale";
  onPositionChange?: (position: { x: number; y: number; z: number }) => void;
  onRotationChange?: (rotation: { x: number; y: number; z: number }) => void;
  onScaleChange?: (scale: number) => void;
}

export const CTMachineModel = ({ 
  visible, 
  position = { x: 0, y: 0, z: 0 }, 
  rotation = { x: 0, y: 0, z: 0 }, 
  scale = 1,
  transformMode,
  onPositionChange,
  onRotationChange,
  onScaleChange,
}: CTMachineModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const transformControlsRef = useRef<any>(null);
  const { scene } = useGLTF("/models/ct_machine.glb");
  const opacityRef = useRef(0);
  const targetOpacity = visible ? 1 : 0;

  // Clone the scene to avoid modifying the cached version
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    // Smooth opacity transition
    opacityRef.current = THREE.MathUtils.lerp(
      opacityRef.current,
      targetOpacity,
      delta * 5 // 5 = speed factor
    );

    if (groupRef.current) {
      groupRef.current.visible = opacityRef.current > 0.01;

      // Apply opacity to all materials
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.Material;
          material.transparent = true;
          (material as any).opacity = opacityRef.current;
        }
      });
    }
  });

  // Handle transform changes
  const handleTransformChange = () => {
    if (!groupRef.current) return;

    if (onPositionChange) {
      onPositionChange({
        x: groupRef.current.position.x,
        y: groupRef.current.position.y,
        z: groupRef.current.position.z,
      });
    }

    if (onRotationChange) {
      onRotationChange({
        x: groupRef.current.rotation.x,
        y: groupRef.current.rotation.y,
        z: groupRef.current.rotation.z,
      });
    }

    if (onScaleChange) {
      onScaleChange(groupRef.current.scale.x);
    }
  };

  return (
    <>
      <group
        ref={groupRef}
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={scale}
      >
        <primitive object={clonedScene} />
      </group>
      
      {/* Transform Controls for intuitive manipulation */}
      {transformMode && groupRef.current && (
        <TransformControls
          ref={transformControlsRef}
          object={groupRef.current}
          mode={transformMode}
          onObjectChange={handleTransformChange}
          showX={true}
          showY={true}
          showZ={true}
          size={0.5}
        />
      )}
    </>
  );
};

// Preload the model
useGLTF.preload("/models/ct_machine.glb");
