"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Lightformer,
  ContactShadows,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

/**
 * Persistent cinematic canvas — fixed full-viewport, behind all content.
 * One shared scene across the whole page:
 *   - Fluid GLSL shader backdrop (color drifts with scroll)
 *   - Iridescent torus knot with Lightformer envmap
 *   - Postprocessing: Bloom + ChromaticAberration + Noise + Vignette
 *
 * The torus knot's position/scale shift based on scroll progress so it stays
 * a recurring motif but feels different per section.
 */

// ---------------- Fluid shader ----------------

const fluidFragment = /* glsl */ `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
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
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  // gentle mouse pull
  vec2 mouse = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float dM = distance(uv, mouse);
  vec2 dir = normalize(uv - mouse + 0.0001);
  float pull = exp(-dM * 1.7) * 0.20;
  uv -= dir * pull;

  float t = uTime * 0.06;
  vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) + t * 0.7));
  vec2 r = vec2(
    fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t),
    fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.9)
  );
  float f = fbm(uv + 4.0 * r + t * 0.5);

  // Per-section palette stops, blended by scroll progress.
  // 0.0 (hero): cool indigo+violet
  // 0.25 (work): deeper navy, less saturated
  // 0.5 (about): violet+rose
  // 0.75 (experience): warm amber-violet mix
  // 1.0 (contact): violet+peach climax

  vec3 c1a = vec3(0.025, 0.025, 0.045); // base navy
  vec3 c2a = vec3(0.10, 0.07, 0.22);    // indigo
  vec3 c3a = vec3(0.32, 0.16, 0.52);    // violet
  vec3 c4a = vec3(0.95, 0.62, 0.42);    // peach climax

  // Slight scroll-driven hue shift in mid + highlight stops
  vec3 c2 = mix(c2a, vec3(0.16, 0.06, 0.30), uScroll); // a touch deeper
  vec3 c3 = mix(c3a, vec3(0.55, 0.30, 0.78), smoothstep(0.3, 0.9, uScroll));
  vec3 c4 = mix(c4a, vec3(1.0, 0.70, 0.55), smoothstep(0.5, 1.0, uScroll));

  vec3 color = mix(c1a, c2, smoothstep(-0.6, 0.5, f));
  color = mix(color, c3, smoothstep(0.25, 0.95, f) * 0.55);
  color = mix(color, c4, smoothstep(0.7, 1.0, f) * 0.32);
  color += vec3(0.85, 0.75, 1.0) * smoothstep(0.78, 0.97, abs(r.y)) * 0.2;

  // Soft center darken for type legibility
  float vig = 1.0 - smoothstep(0.1, 0.85, length(vUv - 0.5));
  color *= mix(0.42, 1.0, vig);

  gl_FragColor = vec4(color, 1.0);
}
`;

const fluidVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.999, 1.0);
}
`;

function FluidBackground({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>;
}) {
  const { size, pointer } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uResolution.value.set(size.width, size.height);
    targetMouse.current.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    u.uMouse.value.lerp(targetMouse.current, 0.06);
    // smooth scroll-progress towards external value
    u.uScroll.value += (scrollRef.current - u.uScroll.value) * 0.06;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={fluidVertex}
        fragmentShader={fluidFragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// ---------------- Iridescent sculpture ----------------

function Sculpture({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  // smoothed pose values
  const pose = useRef({ x: 0, y: 0, scale: 1.4, rot: 0 });

  useFrame((state, delta) => {
    if (!ref.current) return;

    const s = scrollRef.current; // 0..1

    // Per-section pose targets — torus drifts right and shrinks as you go down,
    // then re-centers and grows again at the contact climax.
    const targetX =
      s < 0.1
        ? 0
        : s < 0.5
          ? THREE.MathUtils.lerp(0, 1.6, (s - 0.1) / 0.4)
          : s < 0.85
            ? THREE.MathUtils.lerp(1.6, 0.9, (s - 0.5) / 0.35)
            : THREE.MathUtils.lerp(0.9, 0, (s - 0.85) / 0.15);

    const targetY =
      s < 0.5
        ? THREE.MathUtils.lerp(0, -0.6, s / 0.5)
        : THREE.MathUtils.lerp(-0.6, 0.2, (s - 0.5) / 0.5);

    const targetScale =
      s < 0.85
        ? THREE.MathUtils.lerp(1.45, 0.85, s / 0.85)
        : THREE.MathUtils.lerp(0.85, 1.65, (s - 0.85) / 0.15);

    pose.current.x += (targetX - pose.current.x) * 0.05;
    pose.current.y += (targetY - pose.current.y) * 0.05;
    pose.current.scale += (targetScale - pose.current.scale) * 0.05;

    // cursor parallax on top
    const px = state.pointer.x * 0.35 + pose.current.x;
    const py = -state.pointer.y * 0.18 + pose.current.y;
    ref.current.position.x += (px - ref.current.position.x) * 0.06;
    ref.current.position.y += (py - ref.current.position.y) * 0.06;
    ref.current.scale.setScalar(pose.current.scale);

    // continuous rotation
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x += delta * 0.06;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} scale={1.4}>
        <torusKnotGeometry args={[1, 0.34, 256, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#0a0814"
          metalness={0.85}
          roughness={0.14}
          iridescence={1}
          iridescenceIOR={1.45}
          iridescenceThicknessRange={[100, 480]}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.6}
        />
      </mesh>
    </Float>
  );
}

// ---------------- Scene + Canvas ----------------

function Scene({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>;
}) {
  return (
    <>
      <FluidBackground scrollRef={scrollRef} />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={6}
          position={[-3, 2, 4]}
          scale={[5, 4, 1]}
          color="#a9a4ff"
        />
        <Lightformer
          form="rect"
          intensity={5}
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
          intensity={3}
          position={[0, 4, 1]}
          scale={[8, 1, 1]}
          color="#ff8e6b"
        />
      </Environment>

      <ambientLight intensity={0.18} />
      <Sculpture scrollRef={scrollRef} />

      <ContactShadows
        position={[0, -2.4, 0]}
        scale={10}
        blur={3}
        far={4}
        opacity={0.4}
      />

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.18}
          mipmapBlur
        />
        <ChromaticAberration
          offset={[0.0014, 0.0014]}
          radialModulation
          modulationOffset={0.3}
          blendFunction={BlendFunction.NORMAL}
        />
        <Noise opacity={0.045} />
        <Vignette eskil={false} offset={0.18} darkness={0.72} />
      </EffectComposer>
    </>
  );
}

export function PersistentCanvas() {
  const scrollRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Hero-visible drives frameloop. Off-hero we stop the rAF loop entirely
  // (frameloop="never") — saves the postprocessing chain + shader updates.
  const [active, setActive] = useState(true);
  // Initial opacity 0 → 1 fade-in on first paint, so the hero doesn't pop.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-in after first paint
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;

      // Hero-only: fade canvas out as user scrolls past first viewport.
      if (wrapperRef.current) {
        const vh = window.innerHeight;
        const fadeStart = vh * 0.6;
        const fadeEnd = vh * 1.0;
        const y = window.scrollY;
        const t = Math.max(0, Math.min(1, (y - fadeStart) / (fadeEnd - fadeStart)));
        const fadeOpacity = 1 - t;
        const finalOpacity = mounted ? fadeOpacity : 0;
        wrapperRef.current.style.opacity = String(finalOpacity);
        wrapperRef.current.style.visibility = t >= 1 ? "hidden" : "visible";

        // Suspend / resume the render loop based on hero visibility.
        // 100px rootMargin so resume happens just before user sees it.
        const shouldRun = y < fadeEnd + 100;
        setActive((prev) => (prev !== shouldRun ? shouldRun : prev));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        contain: "strict",
        willChange: "opacity",
        opacity: 0,
        transition: "opacity 1200ms cubic-bezier(0.2, 0.6, 0.2, 1)",
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        style={{ position: "absolute", inset: 0 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={36} />
        <Scene scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
