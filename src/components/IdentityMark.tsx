"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.15;
      mesh.current.rotation.y += delta * 0.22;
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
      mesh.current.scale.set(s, s, s);
    }
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.6, 8]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#a78bfa"
        emissiveIntensity={0.45}
        roughness={0.3}
        metalness={0.6}
        wireframe
      />
    </mesh>
  );
}

function InnerScene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 3, 4]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[-3, -3, -2]} intensity={0.6} color="#f472b6" />
      <Blob />
    </>
  );
}

export function IdentityMark({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className={`relative ${className ?? ""}`}>
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.75]}
        >
          <InnerScene />
        </Canvas>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="bg-clip-text font-serif text-7xl tracking-tight text-transparent md:text-8xl"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #f1f5f9, #a78bfa 60%, #22d3ee)",
          }}
        >
          JH
        </span>
      </div>
    </div>
  );
}
