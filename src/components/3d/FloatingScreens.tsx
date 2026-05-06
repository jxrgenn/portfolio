"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

// Three big floating product tiles in 3D, each textured with a real
// project screenshot. Calm, slow drift. Camera mouse-tied parallax.

const SCREENS = [
  // Center hero — large, slight tilt right
  {
    src: "/captures/keepitup/home_desktop.png",
    pos: [0.1, 0.45, 0.1] as const,
    rot: [0.04, -0.32, 0.02] as const,
    scale: 1.35,
  },
  // Right — slightly forward, tilts left
  {
    src: "/captures/gymapp/dashboard-v2-home.png",
    pos: [2.1, -0.55, -0.1] as const,
    rot: [-0.05, -0.5, 0.03] as const,
    scale: 1.0,
  },
  // Left bottom — back, tilts right
  {
    src: "/captures/cleanslate/home_desktop.png",
    pos: [-2.0, -0.95, -0.4] as const,
    rot: [0.04, 0.45, -0.03] as const,
    scale: 0.95,
  },
];

const ASPECT = 16 / 10;

function Screen({
  src,
  position,
  rotation,
  scale,
  index,
}: {
  src: string;
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: number;
  index: number;
}) {
  const tex = useLoader(THREE.TextureLoader, src);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;

  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Slow, subtle drift only
    group.current.rotation.y =
      rotation[1] + Math.sin(t * 0.18 + index) * 0.025;
    group.current.position.y =
      position[1] + Math.sin(t * 0.22 + index * 1.4) * 0.04;
  });

  return (
    <Float speed={0.4} rotationIntensity={0.06} floatIntensity={0.08}>
      <group
        ref={group}
        position={[position[0], position[1], position[2]]}
        rotation={[rotation[0], rotation[1], rotation[2]]}
        scale={scale}
      >
        {/* Frame */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[ASPECT + 0.08, 1.08, 0.02]} />
          <meshStandardMaterial color="#0e1620" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Title bar */}
        <mesh position={[0, 0.51, 0.005]}>
          <planeGeometry args={[ASPECT, 0.06]} />
          <meshBasicMaterial color="#0a131c" />
        </mesh>
        {/* Traffic lights */}
        <mesh position={[-ASPECT / 2 + 0.05, 0.51, 0.01]}>
          <circleGeometry args={[0.013, 16]} />
          <meshBasicMaterial color="#fb7185" toneMapped={false} />
        </mesh>
        <mesh position={[-ASPECT / 2 + 0.085, 0.51, 0.01]}>
          <circleGeometry args={[0.013, 16]} />
          <meshBasicMaterial color="#fbbf24" toneMapped={false} />
        </mesh>
        <mesh position={[-ASPECT / 2 + 0.12, 0.51, 0.01]}>
          <circleGeometry args={[0.013, 16]} />
          <meshBasicMaterial color="#34d399" toneMapped={false} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, -0.04, 0.01]}>
          <planeGeometry args={[ASPECT, 0.92]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
        {/* Soft inner edge glow */}
        <mesh position={[0, 0, -0.025]}>
          <planeGeometry args={[ASPECT + 0.18, 1.18]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.06} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const tx = state.pointer.x * 0.18;
    const ty = state.pointer.y * 0.1;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      tx,
      0.025,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -ty,
      0.025,
    );
  });
  return <group ref={group}>{children}</group>;
}

export function FloatingScreens({ className }: { className?: string }) {
  const screens = useMemo(() => SCREENS, []);
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 3, 4]} intensity={0.85} />
        <pointLight position={[-4, -2, -2]} intensity={0.45} color="#22d3ee" />
        <Suspense fallback={null}>
          <ParallaxRig>
            {screens.map((s, i) => (
              <Screen
                key={s.src}
                src={s.src}
                position={s.pos}
                rotation={s.rot}
                scale={s.scale}
                index={i}
              />
            ))}
          </ParallaxRig>
        </Suspense>
      </Canvas>
    </div>
  );
}
