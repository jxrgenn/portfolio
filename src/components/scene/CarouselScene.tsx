"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import { CarouselPanel } from "./CarouselPanel";

const SPACING = 2.5;
const FOCAL_OFFSET = 1.25;

const PANELS: readonly { src: string; codename: string; year: string }[] = [
  { src: "/scenes/work/keepitup.jpg",     codename: "KEEPITUP",        year: "2026" },
  { src: "/scenes/work/gymapp.jpg",       codename: "GYM-APP",         year: "2026" },
  { src: "/scenes/work/pilates.jpg",      codename: "PILATES-STUDIO",  year: "2026" },
  { src: "/scenes/work/cleanslate.jpg",   codename: "CLEANSLATE",      year: "2026" },
  { src: "/scenes/work/enderrat.jpg",     codename: "ENDERRAT-E-MIA",  year: "2026" },
  { src: "/scenes/work/socialcommand.jpg",codename: "SOCIAL-CMD",      year: "2026" },
] as const;

const backdropFragment = /* glsl */ `
precision highp float;
uniform float uProgress;
uniform float uTime;
varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(in vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(
    dot(a, hash2(i)),
    dot(b, hash2(i + o)),
    dot(c, hash2(i + 1.0))
  );
  return dot(n, vec3(70.0));
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int j = 0; j < 4; j++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

vec3 paletteAt(int i) {
  if (i <= 0) return vec3(0.10, 0.30, 0.40);
  if (i == 1) return vec3(0.16, 0.32, 0.18);
  if (i == 2) return vec3(0.46, 0.30, 0.30);
  if (i == 3) return vec3(0.36, 0.42, 0.50);
  if (i == 4) return vec3(0.42, 0.26, 0.20);
  return vec3(0.32, 0.14, 0.30);
}

void main() {
  float idx = clamp(uProgress * 5.0, 0.0, 5.0);
  int i = int(floor(idx));
  float t = fract(idx);
  vec3 a = paletteAt(i);
  vec3 b = paletteAt(min(i + 1, 5));
  vec3 base = mix(a, b, smoothstep(0.0, 1.0, t));

  vec2 uv = vUv;
  float n = fbm(uv * 2.4 + uTime * 0.05) * 0.10;

  vec2 c = vUv - 0.5;
  float vig = 1.0 - smoothstep(0.18, 0.85, length(c));

  vec3 col = (base + n * vec3(0.6, 0.7, 0.9)) * mix(0.40, 1.05, vig);

  // Subtle blue-shifted highlight at horizon
  float horizon = smoothstep(0.45, 0.65, vUv.y) * (1.0 - smoothstep(0.65, 0.95, vUv.y));
  col += vec3(0.16, 0.20, 0.32) * horizon * 0.18;

  gl_FragColor = vec4(col, 1.0);
}
`;

const backdropVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.999, 1.0);
}
`;

function Backdrop({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );
  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uProgress.value += (progressRef.current - u.uProgress.value) * 0.08;
  });
  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={backdropVertex}
        fragmentShader={backdropFragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function PanelTrack({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const floatIdx = Math.max(0, Math.min(5, progressRef.current * 5));
    const targetX = -floatIdx * SPACING + FOCAL_OFFSET;
    g.position.x += (targetX - g.position.x) * 0.20;

    // Subtle camera parallax on cursor — camera position drifts but keeps
    // looking at world origin, so the offset focal panel stays right-of-center.
    const tx = state.pointer.x * 0.30;
    const ty = state.pointer.y * 0.16;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {PANELS.map((p, i) => (
        <CarouselPanel
          key={p.src}
          src={p.src}
          codename={p.codename}
          year={p.year}
          index={i}
          spacing={SPACING}
          progressRef={progressRef}
        />
      ))}
    </group>
  );
}

export function CarouselScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <>
      <Backdrop progressRef={progressRef} />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={5}
          position={[-3, 2, 4]}
          scale={[5, 4, 1]}
          color="#a9a4ff"
        />
        <Lightformer
          form="rect"
          intensity={4.5}
          position={[3, -1, 4]}
          scale={[5, 5, 1]}
          color="#ffd5b5"
        />
        <Lightformer
          form="ring"
          intensity={2.4}
          position={[0, 0, -3]}
          scale={3}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          position={[0, 4, 1]}
          scale={[8, 1, 1]}
          color="#ff8e6b"
        />
      </Environment>

      <ambientLight intensity={0.18} />

      <Suspense fallback={null}>
        <PanelTrack progressRef={progressRef} />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={0.32}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.18}
          mipmapBlur
        />
        <ChromaticAberration offset={[0.0008, 0.0008]} radialModulation modulationOffset={0.4} />
      </EffectComposer>
    </>
  );
}
