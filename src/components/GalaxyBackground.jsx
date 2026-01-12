import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const Nebula = () => {
  return (
    <group>
      {Array.from({ length: 4 }).map((_, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh position={[Math.random() * 15 - 7, Math.random() * 10 - 5, -15]}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? "#4338ca" : "#581c87"} 
              transparent 
              opacity={0.08} 
              blending={THREE.AdditiveBlending} 
              depthWrite={false}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const Constellations = () => {
  const lines = useMemo(() => {
    const points = [];
    const starCount = 60;
    const radius = 20;
    const stars = new Array(starCount).fill(0).map(() => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    });

    for (let i = 0; i < starCount; i++) {
      for (let j = i + 1; j < starCount; j++) {
        if (stars[i].distanceTo(stars[j]) < 7) { 
          points.push(stars[i]);
          points.push(stars[j]);
        }
      }
    }
    return points;
  }, []);

  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <group ref={ref}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lines.length} array={new Float32Array(lines.flatMap(v => [v.x, v.y, v.z]))} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" opacity={0.12} transparent />
      </lineSegments>
      <points>
         <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={lines.length} array={new Float32Array(lines.flatMap(v => [v.x, v.y, v.z]))} itemSize={3} />
         </bufferGeometry>
         <pointsMaterial size={0.2} color="white" transparent opacity={0.8} />
      </points>
    </group>
  );
};

const GalaxyBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111827_0%,_#000000_100%)] opacity-90" />
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <fog attach="fog" args={['#000000', 10, 40]} />
        <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Nebula />
        <Constellations />
      </Canvas>
    </div>
  );
};

export default GalaxyBackground;