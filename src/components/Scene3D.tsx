import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import sampleTexture from '@/assets/sample-texture.png';

interface Scene3DProps {
  position?: { x: number; y: number; z: number };
  scale?: number;
  rotation?: { x: number; y: number; z: number };
  sensitivity?: number;
}

export const Scene3D = ({ 
  position = { x: 0, y: 0, z: 0 },
  scale = 100,
  rotation = { x: 0, y: 0, z: 0 },
  sensitivity = 1.0
}: Scene3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/Arious_3DLogo.glb');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { size } = useThree();
  
  // Animation state
  const animationProgress = useRef(0);
  const startPosition = useRef({ x: 0, y: 0, z: 0 });
  const startScale = useRef(20000);
  const startRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetPosition = useRef(position);
  const targetScale = useRef(scale);
  const targetRotation = useRef(rotation);
  const isAnimating = useRef(true);

  // Update targets when props change
  useEffect(() => {
    // Store current values as start
    if (groupRef.current) {
      startPosition.current = { 
        x: groupRef.current.position.x, 
        y: groupRef.current.position.y, 
        z: groupRef.current.position.z 
      };
      startScale.current = groupRef.current.scale.x * 100;
      startRotation.current = { 
        x: groupRef.current.rotation.x, 
        y: groupRef.current.rotation.y, 
        z: groupRef.current.rotation.z 
      };
    }
    
    targetPosition.current = position;
    targetScale.current = scale;
    targetRotation.current = rotation;
    isAnimating.current = true;
    animationProgress.current = 0;
  }, [position, scale, rotation]);

  // Add image texture to one face of the model
  useEffect(() => {
    if (scene && groupRef.current) {
      // Find the main mesh (first mesh in the scene)
      const mesh = scene.children.find(child => child instanceof THREE.Mesh) || scene.children[0];
      
      if (mesh) {
        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(mesh);
        const boxSize = new THREE.Vector3();
        box.getSize(boxSize);

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        const tex = textureLoader.load(sampleTexture);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        // Create plane geometry for the +Z face (front)
        const planeGeo = new THREE.PlaneGeometry(boxSize.x * 1, boxSize.y * 1);
        const planeMat = new THREE.MeshBasicMaterial({ 
          map: tex, 
          transparent: true,
          side: THREE.DoubleSide
        });
        const face = new THREE.Mesh(planeGeo, planeMat);

        // Position on the +Z face
        const EPS = 0.001;
        face.position.set(0, 0, boxSize.z / 2 + EPS);

        // Add to the mesh
        mesh.add(face);
      }
    }
  }, [scene]);
  
  const handlePointerMove = (event: any) => {
    if (isHovering) {
      // Normalize mouse position to -1 to 1 range relative to canvas
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      setMousePosition({ x, y });
    }
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Animate to target values over 1.5 seconds
      if (isAnimating.current && animationProgress.current < 1) {
        animationProgress.current = Math.min(animationProgress.current + delta / 1.5, 1);
        
        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - animationProgress.current, 3);
        
        // Interpolate position
        const currentPos = {
          x: THREE.MathUtils.lerp(startPosition.current.x, targetPosition.current.x, eased),
          y: THREE.MathUtils.lerp(startPosition.current.y, targetPosition.current.y, eased),
          z: THREE.MathUtils.lerp(startPosition.current.z, targetPosition.current.z, eased),
        };
        
        // Interpolate scale
        const currentScale = THREE.MathUtils.lerp(startScale.current, targetScale.current, eased);
        
        // Interpolate rotation
        const currentRot = {
          x: THREE.MathUtils.lerp(startRotation.current.x, targetRotation.current.x, eased),
          y: THREE.MathUtils.lerp(startRotation.current.y, targetRotation.current.y, eased),
          z: THREE.MathUtils.lerp(startRotation.current.z, targetRotation.current.z, eased),
        };
        
        groupRef.current.position.set(currentPos.x, currentPos.y, currentPos.z);
        groupRef.current.scale.setScalar(currentScale / 100);
        
        // Apply rotation with hover effect
        const maxRotationX = (25 * Math.PI) / 180 * sensitivity;
        const maxRotationY = (15 * Math.PI) / 180 * sensitivity;
        
        groupRef.current.rotation.x = currentRot.x + (isHovering ? mousePosition.y * maxRotationX : 0);
        groupRef.current.rotation.y = currentRot.y + (isHovering ? mousePosition.x * maxRotationY : 0);
        groupRef.current.rotation.z = currentRot.z;
        
        if (animationProgress.current >= 1) {
          isAnimating.current = false;
        }
      } else {
        // After animation, apply controls directly with hover effect
        groupRef.current.position.set(targetPosition.current.x, targetPosition.current.y, targetPosition.current.z);
        groupRef.current.scale.setScalar(targetScale.current / 100);
        
        const maxRotationX = (25 * Math.PI) / 180 * sensitivity;
        const maxRotationY = (15 * Math.PI) / 180 * sensitivity;
        
        const targetRotX = targetRotation.current.x + (isHovering ? mousePosition.y * maxRotationX : 0);
        const targetRotY = targetRotation.current.y + (isHovering ? mousePosition.x * maxRotationY : 0);
        const targetRotZ = targetRotation.current.z;
        
        // Smooth lerp for hover transitions
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetRotX,
          0.05
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotY,
          0.05
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          targetRotZ,
          0.05
        );
      }
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onPointerMove={handlePointerMove}
    >
      <primitive object={scene} />
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/Arious_3DLogo.glb');
