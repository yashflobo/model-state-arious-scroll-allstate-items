import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

export const Scene3D = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Hover effect - scale up
      const targetScale = hovered ? 1.2 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Center>
        {/* AR text */}
        <mesh position={[-1.5, 0, 0]}>
          <boxGeometry args={[1.5, 2, 0.3]} />
          <meshStandardMaterial
            color="#8b5cf6"
            metalness={0.8}
            roughness={0.2}
            emissive="#8b5cf6"
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>

        {/* ious text */}
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[2, 2, 0.3]} />
          <meshStandardMaterial
            color="#6366f1"
            metalness={0.8}
            roughness={0.2}
            emissive="#6366f1"
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>

        {/* Connecting element */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#a855f7"
            metalness={0.9}
            roughness={0.1}
            emissive="#a855f7"
            emissiveIntensity={hovered ? 0.8 : 0.3}
          />
        </mesh>

        {/* Orbiting particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 3;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.5,
                Math.sin(angle) * radius * 0.3,
              ]}
            >
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color="#c084fc"
                emissive="#c084fc"
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </Center>
    </group>
  );
};
