"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The Workshop — a single 3D set-piece showing project screenshots laid
 * out as paper cards on a cream desk. Camera pans across as the user
 * scrolls vertically through the section (driven by a 0..1 progress prop).
 */

type CardSpec = {
  src: string;
  position: [number, number, number];
  rotateZ: number;
  scale: number;
};

const CARDS: CardSpec[] = [
  {
    src: "/captures/keepitup/home_desktop.png",
    position: [-3.0, 0.06, -0.4],
    rotateZ: -0.18,
    scale: 1.0,
  },
  {
    src: "/captures/gymapp/dashboard-v2-home.png",
    position: [0.0, 0.08, -1.6],
    rotateZ: 0.08,
    scale: 1.05,
  },
  {
    src: "/captures/cleanslate/home_desktop.png",
    position: [3.0, 0.06, -0.2],
    rotateZ: -0.06,
    scale: 1.0,
  },
  {
    src: "/captures/social_command_center/home_desktop.png",
    position: [-1.6, 0.07, 1.2],
    rotateZ: 0.22,
    scale: 0.95,
  },
  {
    src: "/captures/jiang_clips_web/home_desktop.png",
    position: [2.0, 0.07, 1.4],
    rotateZ: -0.14,
    scale: 0.95,
  },
];

function PaperCard({ spec }: { spec: CardSpec }) {
  const tex = useLoader(THREE.TextureLoader, spec.src);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

  // Aspect 16:10 — the captured screenshots are mostly desktop in this aspect.
  const W = 2.4 * spec.scale;
  const H = 1.5 * spec.scale;

  return (
    <group
      position={spec.position}
      rotation={[-Math.PI / 2, 0, spec.rotateZ]}
    >
      {/* Paper substrate — sits underneath the screenshot, slightly larger */}
      <mesh position={[0, 0, -0.005]} receiveShadow>
        <planeGeometry args={[W + 0.12, H + 0.12]} />
        <meshStandardMaterial color="#f5f1ea" roughness={0.95} />
      </mesh>
      {/* Screenshot face */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={tex} roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  );
}

function Desk() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 30]} />
      <meshStandardMaterial color="#efe6d6" roughness={0.98} />
    </mesh>
  );
}

function CoffeeCup({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.26, 0.5, 32]} />
        <meshStandardMaterial color="#1a1815" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} />
        <meshStandardMaterial color="#3a2b1a" roughness={0.2} />
      </mesh>
    </group>
  );
}

function Pen({ position, rotateZ }: { position: [number, number, number]; rotateZ: number }) {
  return (
    <group position={position} rotation={[0, 0, rotateZ]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.4, 16]} />
        <meshStandardMaterial color="#c11626" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.7]} castShadow>
        <coneGeometry args={[0.04, 0.18, 16]} />
        <meshStandardMaterial color="#1a1815" roughness={0.3} />
      </mesh>
    </group>
  );
}

function CameraRig({ progress }: { progress: React.MutableRefObject<number> }) {
  useFrame((state) => {
    // Pan camera left → right as progress goes 0 → 1.
    const p = progress.current;
    const targetX = -2.4 + p * 4.8;
    const targetZ = 5.6 - p * 0.4;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.06);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.06);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function Workshop3D({
  progress,
  className,
}: {
  progress: React.MutableRefObject<number>;
  className?: string;
}) {
  const cards = useMemo(() => CARDS, []);
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [-2.4, 4.2, 5.6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3, 7, 4]}
          intensity={1.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={20}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        <directionalLight position={[-4, 3, -2]} intensity={0.25} color="#c11626" />
        <Suspense fallback={null}>
          <Desk />
          {cards.map((c) => (
            <PaperCard key={c.src} spec={c} />
          ))}
          <CoffeeCup position={[3.4, 0.25, 1.0]} />
          <Pen position={[-2.6, 0.05, 1.6]} rotateZ={0.4} />
          <Pen position={[2.6, 0.05, -1.8]} rotateZ={-0.2} />
        </Suspense>
        <CameraRig progress={progress} />
      </Canvas>
    </div>
  );
}
