"use client";

import { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const ASPECT = 16 / 10;

export function CarouselPanel({
  src,
  codename,
  year,
  index,
  total,
  spacing,
  progressRef,
}: {
  src: string;
  codename: string;
  year: string;
  index: number;
  total: number;
  spacing: number;
  progressRef: React.MutableRefObject<number>;
}) {
  const tex = useLoader(THREE.TextureLoader, src) as THREE.Texture;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 8;

  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const frameMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const reflMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const labelRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const g = groupRef.current;
    const mat = matRef.current;
    const inner = innerRef.current;
    const frameMat = frameMatRef.current;
    const refl = reflMatRef.current;
    const label = labelRef.current;
    if (!g || !mat || !inner || !frameMat) return;

    const maxIdx = Math.max(1, total - 1);
    const floatIdx = Math.max(0, Math.min(maxIdx, progressRef.current * maxIdx));
    const d = Math.abs(index - floatIdx);
    const dC = Math.min(1, d);

    const targetScale = THREE.MathUtils.lerp(0.55, 1.18, 1 - dC);
    const targetOpacity = THREE.MathUtils.lerp(0.34, 1.0, 1 - dC);
    const sign = index < floatIdx ? -1 : 1;
    const targetRotY = THREE.MathUtils.lerp(0, sign * 0.55, Math.min(1.5, d) / 1.5);

    g.scale.x += (targetScale - g.scale.x) * 0.22;
    g.scale.y += (targetScale - g.scale.y) * 0.22;
    g.scale.z += (targetScale - g.scale.z) * 0.22;
    g.rotation.y += (targetRotY - g.rotation.y) * 0.20;
    mat.opacity += (targetOpacity - mat.opacity) * 0.22;
    frameMat.opacity += (targetOpacity - frameMat.opacity) * 0.22;

    // Reflection + label fade — only present on the focal panel.
    const focalAmount = Math.max(0, 1 - dC * 1.6);
    if (refl) refl.opacity += (focalAmount * 0.22 - refl.opacity) * 0.22;
    if (label) {
      const labelMat = label.material as THREE.Material & { opacity?: number };
      if (labelMat.opacity !== undefined) {
        labelMat.opacity += (focalAmount - labelMat.opacity) * 0.22;
      }
    }

    if (d < 0.5) {
      const tiltY = state.pointer.x * 0.06;
      const tiltX = -state.pointer.y * 0.04;
      inner.rotation.y += (tiltY - inner.rotation.y) * 0.06;
      inner.rotation.x += (tiltX - inner.rotation.x) * 0.06;
    } else {
      inner.rotation.y += (0 - inner.rotation.y) * 0.06;
      inner.rotation.x += (0 - inner.rotation.x) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[index * spacing, 0, 0]}>
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[ASPECT * 1.018, 1.018]} />
        <meshPhysicalMaterial
          ref={frameMatRef}
          color="#0a0814"
          metalness={0.65}
          roughness={0.18}
          iridescence={1}
          iridescenceIOR={1.45}
          iridescenceThicknessRange={[100, 460]}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.4}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh ref={innerRef} position={[0, 0, 0]}>
        <planeGeometry args={[ASPECT, 1]} />
        <meshBasicMaterial
          ref={matRef}
          map={tex as never}
          toneMapped={false}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Floor reflection — flipped panel below, fades out vertically.
          Only opaque on the focal slot. */}
      <mesh position={[0, -1.04, 0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[ASPECT, 0.7]} />
        <meshBasicMaterial
          ref={reflMatRef}
          map={tex as never}
          toneMapped={false}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Codename + year label — drei Text in 3D, beneath panel */}
      <Text
        ref={labelRef}
        position={[0, -0.62, 0.01]}
        fontSize={0.052}
        letterSpacing={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="top"
        outlineWidth={0}
        material-transparent
        material-opacity={0}
      >
        {`${codename}  ·  ${year}`}
      </Text>
    </group>
  );
}
