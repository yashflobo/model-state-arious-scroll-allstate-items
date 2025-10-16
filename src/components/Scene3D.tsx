import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import sampleTexture from '@/assets/sample-texture.png';

interface Scene3DProps {
  position?: { x: number; y: number; z: number };
  scale?: number;
  rotation?: { x: number; y: number; z: number };
}

export const Scene3D = ({ 
  position = { x: 0, y: 0, z: 0 },
  scale = 100,
  rotation = { x: 0, y: 0, z: 0 }
}: Scene3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/Arious_3DLogo.glb');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { size } = useThree();

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

  useFrame(() => {
    if (groupRef.current) {
      // Apply manual controls
      groupRef.current.position.set(position.x, position.y, position.z);
      groupRef.current.scale.setScalar(scale / 100);
      
      // Apply base rotation from controls
      const maxRotationX = (25 * Math.PI) / 180;
      const maxRotationY = (15 * Math.PI) / 180;
      
      const targetRotationX = rotation.x + (isHovering ? mousePosition.y * maxRotationX : 0);
      const targetRotationY = rotation.y + (isHovering ? mousePosition.x * maxRotationY : 0);
      const targetRotationZ = rotation.z;
      
      // Lerp for smooth transitions
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.03
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.03
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotationZ,
        0.03
      );
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
