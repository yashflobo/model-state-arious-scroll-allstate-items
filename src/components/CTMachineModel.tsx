import { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CTMachineModelProps {
  visible: boolean;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
}

export const CTMachineModel = ({ 
  visible, 
  position = { x: 0, y: 0, z: 0 }, 
  rotation = { x: 0, y: 0, z: 0 }, 
  scale = 1 
}: CTMachineModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
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

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={scale}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

// Preload the model
useGLTF.preload("/models/ct_machine.glb");
