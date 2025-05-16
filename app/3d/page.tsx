'use client' 

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function HospitalModel() {
  const { scene } = useGLTF('./cthulhu_gun__la_llamada_de_cthulhu.glb');
  return <primitive object={scene} />;
}

export default function Hospital3DMap() {
  return (
    <div className='my-4'>
    <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
      <HospitalModel />
      <OrbitControls />
    </Canvas>
    </div>
  );
}
