"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// 9 nodes positioned on a tilted disk; each represents a project.
// Edges connect nodes that share a technology dimension.
const NODE_COUNT = 9;

const ACCENT_COLORS = [
  "#22d3ee", // keepitup — cyan
  "#fbbf24", // enderrat — amber
  "#84cc16", // gymapp — lime
  "#fb7185", // pilates — rose
  "#34d399", // cleanslate — emerald
  "#818cf8", // social — indigo
  "#f472b6", // jiang — magenta
  "#a78bfa", // bohesh — violet
  "#fb923c", // kercishta — orange
];

function generateNodes(seed = 1) {
  const nodes: { pos: THREE.Vector3; color: string; size: number }[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (i / NODE_COUNT) * Math.PI * 2;
    const r = 2.4 + ((i * 7) % 3) * 0.25;
    const y = (Math.sin(i * seed * 1.3) * 0.7);
    nodes.push({
      pos: new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r),
      color: ACCENT_COLORS[i],
      size: 0.18 + (i % 3) * 0.05,
    });
  }
  return nodes;
}

function NodeMesh({
  position,
  color,
  size,
  index,
}: {
  position: THREE.Vector3;
  color: string;
  size: number;
  index: number;
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (mat.current) {
      const pulse =
        0.6 + Math.sin(state.clock.elapsedTime * 1.5 + index * 0.6) * 0.4;
      mat.current.emissiveIntensity = 0.5 + pulse * 0.8;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
    </Float>
  );
}

function Edges({
  nodes,
}: {
  nodes: { pos: THREE.Vector3; color: string; size: number }[];
}) {
  const positions = useMemo(() => {
    const arr: number[] = [];
    const colors: number[] = [];
    // Connect each node to the 2 closest neighbors
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes
        .map((n, j) => ({ j, d: nodes[i].pos.distanceTo(n.pos) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j } of dists) {
        if (j > i) {
          const a = nodes[i].pos;
          const b = nodes[j].pos;
          arr.push(a.x, a.y, a.z, b.x, b.y, b.z);
          const cA = new THREE.Color(nodes[i].color);
          const cB = new THREE.Color(nodes[j].color);
          colors.push(cA.r, cA.g, cA.b, cB.r, cB.g, cB.b);
        }
      }
    }
    return {
      positions: new Float32Array(arr),
      colors: new Float32Array(colors),
    };
  }, [nodes]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[positions.colors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.45}
        toneMapped={false}
      />
    </lineSegments>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => generateNodes(1), []);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.12 + 0.2;
    }
  });
  return (
    <group ref={group}>
      <Edges nodes={nodes} />
      {nodes.map((n, i) => (
        <NodeMesh key={i} position={n.pos} color={n.color} size={n.size} index={i} />
      ))}
    </group>
  );
}

export function AgentNetwork({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 1.6, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[6, 6, 6]} intensity={0.8} />
        <pointLight position={[-6, -2, -4]} intensity={0.4} color="#22d3ee" />
        <Scene />
        <EffectComposer>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
