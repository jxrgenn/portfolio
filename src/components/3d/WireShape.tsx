"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

type Geometry = "knot" | "icosa" | "torus" | "octa" | "dodeca";

function Mesh({
  geometry,
  color,
  speed = 1,
}: {
  geometry: Geometry;
  color: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.18 * speed;
    ref.current.rotation.y += delta * 0.32 * speed;
  });

  return (
    <mesh ref={ref}>
      {geometry === "knot" && <torusKnotGeometry args={[1, 0.32, 128, 16]} />}
      {geometry === "icosa" && <icosahedronGeometry args={[1.25, 1]} />}
      {geometry === "torus" && <torusGeometry args={[1.05, 0.34, 16, 80]} />}
      {geometry === "octa" && <octahedronGeometry args={[1.4, 0]} />}
      {geometry === "dodeca" && <dodecahedronGeometry args={[1.3, 0]} />}
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.55}
        toneMapped={false}
      />
    </mesh>
  );
}

export function WireShape({
  geometry = "knot",
  color = "#22d3ee",
  speed = 1,
  className,
}: {
  geometry?: Geometry;
  color?: string;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Mesh geometry={geometry} color={color} speed={speed} />
        </Suspense>
      </Canvas>
    </div>
  );
}
