"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Points } from "three";

function ParticleField() {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const count = 900;
    const array = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 2.8 + seeded(index) * 3.8;
      const angle = seeded(index + 1000) * Math.PI * 2;
      const y = (seeded(index + 2000) - 0.5) * 4.4;
      array[index * 3] = Math.cos(angle) * radius;
      array[index * 3 + 1] = y;
      array[index * 3 + 2] = Math.sin(angle) * radius;
    }
    return array;
  }, []);

  useFrame(({ pointer, clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.035 + pointer.x * 0.12;
    points.current.rotation.x = pointer.y * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#7dd3fc" transparent opacity={0.72} depthWrite={false} />
    </points>
  );
}

function seeded(value: number) {
  const signal = Math.sin(value * 12.9898) * 43758.5453;
  return signal - Math.floor(signal);
}

function FlowRings() {
  const group = useRef<Group>(null);

  useFrame(({ pointer, clock }) => {
    if (!group.current) return;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.12 + pointer.y * 0.08;
    group.current.rotation.y = clock.elapsedTime * 0.06 + pointer.x * 0.16;
  });

  return (
    <group ref={group}>
      {[1.4, 2.05, 2.7].map((size, index) => (
        <mesh key={size} rotation={[Math.PI / 2.4, index * 0.38, index * 0.64]}>
          <torusGeometry args={[size, 0.006 + index * 0.002, 16, 180]} />
          <meshStandardMaterial
            color={index === 0 ? "#7dffc8" : index === 1 ? "#ffa16f" : "#c9a8ff"}
            emissive={index === 0 ? "#134e4a" : index === 1 ? "#7c2d12" : "#4c1d95"}
            emissiveIntensity={0.8}
            transparent
            opacity={0.76}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlassCore() {
  return (
    <Float speed={1.4} rotationIntensity={0.22} floatIntensity={0.45}>
      <mesh position={[0, 0.05, 0]}>
        <icosahedronGeometry args={[0.92, 2]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          roughness={0.18}
          metalness={0.08}
          transmission={0.44}
          thickness={0.6}
          transparent
          opacity={0.72}
          emissive="#0ea5e9"
          emissiveIntensity={0.12}
        />
      </mesh>
    </Float>
  );
}

export function LiveWallpaper({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <Canvas dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={48} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 5, 4]} intensity={1.5} color="#7dd3fc" />
        <pointLight position={[-3, -2, 2]} intensity={14} color="#ffa16f" distance={7} />
        <ParticleField />
        <FlowRings />
        <GlassCore />
      </Canvas>
    </div>
  );
}
