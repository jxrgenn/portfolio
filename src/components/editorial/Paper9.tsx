"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * 3D paper "9" — a textured plane rendered with the numeral painted onto it
 * in canvas. Slow Y-rotation, subtle hover float. Cream background, deep ink
 * type, mild paper-grain shading. Lazy-mounted from the hero.
 */

function NumeralPlane() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  // Render the "9" onto a 2D canvas, hand it to Three as a texture.
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 1280;
    const ctx = c.getContext("2d")!;
    // Cream background
    ctx.fillStyle = "#f5f1ea";
    ctx.fillRect(0, 0, c.width, c.height);
    // Subtle paper grain via random dots
    for (let i = 0; i < 1400; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      const r = Math.random() * 1.4;
      ctx.fillStyle = `rgba(0,0,0,${0.04 + Math.random() * 0.05})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Numeral
    ctx.fillStyle = "#1a1815";
    ctx.font = "500 1100px 'Fraunces', 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("9", c.width / 2, c.height / 2 + 60);
    // Faint footnote at the bottom
    ctx.fillStyle = "#6b5d4a";
    ctx.font = "italic 32px 'Fraunces', serif";
    ctx.textAlign = "left";
    ctx.fillText("projects, shipped", 60, c.height - 60);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Mouse-driven slight rotation in addition to slow drift.
    const targetY = state.pointer.x * 0.18 + Math.sin(t * 0.3) * 0.08;
    const targetX = -state.pointer.y * 0.08 + Math.sin(t * 0.4) * 0.04;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.05,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05,
    );
  });

  return (
    <Float
      speed={0.7}
      rotationIntensity={0.15}
      floatIntensity={0.25}
      floatingRange={[-0.04, 0.04]}
    >
      <group ref={groupRef}>
        {/* Front face — numeral */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2, 2.5]} />
          <meshStandardMaterial
            ref={matRef}
            map={texture}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
        {/* Back of paper — slightly darker cream */}
        <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2, 2.5]} />
          <meshStandardMaterial color="#efe6d6" roughness={0.95} />
        </mesh>
        {/* Edge — paper thickness illusion */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.005, 2.505, 0.014]} />
          <meshStandardMaterial color="#d4c8b4" roughness={0.95} />
        </mesh>
      </group>
    </Float>
  );
}

export function Paper9({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
        shadows
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[2, 3, 4]} intensity={0.9} castShadow />
        <directionalLight position={[-3, -1, 2]} intensity={0.3} color="#c11626" />
        <Suspense fallback={null}>
          <NumeralPlane />
        </Suspense>
      </Canvas>
    </div>
  );
}
