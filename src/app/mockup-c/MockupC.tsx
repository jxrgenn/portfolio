"use client";

import { useEffect, useMemo, useRef } from "react";
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
import { gsap } from "gsap";
import * as THREE from "three";

/**
 * Mockup C — Iridescent Sculpture + Liquid Shader Backdrop
 * Combines A and B: a real iridescent geometry (museum-piece) lit by
 * Lightformers, sitting in front of a fullscreen GLSL fluid-shader
 * background. Postprocessing ties them together.
 */

// --- Liquid shader (background plane) ---
const fluidFragment = /* glsl */ `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
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
  float pull = exp(-dM * 1.8) * 0.22;
  uv -= dir * pull;

  float t = uTime * 0.06;
  vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) + t * 0.7));
  vec2 r = vec2(
    fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t),
    fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.9)
  );
  float f = fbm(uv + 4.0 * r + t * 0.5);

  // Quieter palette (so iridescent geometry remains the hero)
  vec3 c1 = vec3(0.025, 0.025, 0.045);
  vec3 c2 = vec3(0.10, 0.07, 0.22);
  vec3 c3 = vec3(0.32, 0.16, 0.52);
  vec3 c4 = vec3(0.95, 0.62, 0.42);

  vec3 color = mix(c1, c2, smoothstep(-0.6, 0.5, f));
  color = mix(color, c3, smoothstep(0.25, 0.95, f) * 0.55);
  color = mix(color, c4, smoothstep(0.7, 1.0, f) * 0.28);
  color += vec3(0.85, 0.75, 1.0) * smoothstep(0.78, 0.97, abs(r.y)) * 0.18;

  // Center darken to focus the eye on the geometry
  float vig = 1.0 - smoothstep(0.05, 0.85, length(vUv - 0.5));
  color *= mix(0.45, 1.0, vig);

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

function FluidBackground() {
  const { size, pointer } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
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

// --- Iridescent sculpture (foreground geometry) ---
function Sculpture() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x += delta * 0.06;
    const tx = state.pointer.x * 0.4;
    const ty = -state.pointer.y * 0.22;
    ref.current.position.x += (tx - ref.current.position.x) * 0.04;
    ref.current.position.y += (ty - ref.current.position.y) * 0.04;
  });

  return (
    <Float speed={0.85} rotationIntensity={0.22} floatIntensity={0.55}>
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

export function MockupC() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-mock-eyebrow]", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from("[data-mock-char]", {
        y: "110%",
        opacity: 0,
        stagger: 0.025,
        duration: 1.0,
        ease: "power4.out",
        delay: 0.25,
      });
      gsap.from("[data-mock-sub]", {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.9,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={sectionRef}
      className="relative min-h-svh overflow-hidden"
      style={{ background: "#06060a" }}
    >
      {/* Mockup label */}
      <div className="fixed left-6 top-6 z-50 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 backdrop-blur-md">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          Mockup C · Iridescent + Liquid
        </span>
      </div>

      {/* Single canvas combines fluid shader bg + iridescent geometry + postproc */}
      <div className="fixed inset-0 z-0">
        <Canvas dpr={[1, 1.75]} gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={36} />

          {/* Fullscreen fluid shader plane behind everything */}
          <FluidBackground />

          {/* Studio rig — these don't render to scene, only contribute to envmap */}
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
          <Sculpture />

          <ContactShadows
            position={[0, -2.2, 0]}
            scale={10}
            blur={3}
            far={4}
            opacity={0.45}
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
        </Canvas>
      </div>

      {/* Type overlay */}
      <section className="relative z-10 flex min-h-svh flex-col justify-between px-6 pt-32 pb-16 md:px-10 md:pt-40 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <p
            data-mock-eyebrow
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/65"
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-emerald-400 shadow-[0_0_10px_currentColor]" />
            Kiel, Germany / Available 2026
          </p>

          <h1
            className="mt-8"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(4rem, 16vw, 14rem)",
              lineHeight: 0.86,
              letterSpacing: "-0.05em",
              fontWeight: 400,
              color: "#f5efe6",
            }}
          >
            <span className="block overflow-hidden">
              {"Jurgen".split("").map((c, i) => (
                <span key={i} data-mock-char className="inline-block">
                  {c}
                </span>
              ))}
            </span>
            <span
              className="block overflow-hidden"
              style={{ fontStyle: "italic", fontWeight: 300 }}
            >
              {"Halili.".split("").map((c, i) => (
                <span key={i} data-mock-char className="inline-block">
                  {c}
                </span>
              ))}
            </span>
          </h1>
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto]">
          <p
            data-mock-sub
            className="max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
            style={{ fontWeight: 300 }}
          >
            Solo full-stack engineer. AI-native products + Microsoft Business
            Central / NAV migrations, end-to-end. Originally Tirana, currently
            Kiel.
          </p>

          <div data-mock-sub className="flex items-center gap-6">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black"
            >
              Selected work
              <span aria-hidden>↓</span>
            </a>
            <a
              href="mailto:jurgenhalili1142@gmail.com"
              className="text-sm text-white/90 underline underline-offset-4"
              style={{ textDecorationColor: "#a9a4ff" }}
            >
              say hi →
            </a>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          Stack
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-white/85">
          Iridescent MeshPhysicalMaterial (clearcoat 1) · Lightformer envmap ·
          custom GLSL fluid backdrop · domain-warp FBM + cursor pull · Bloom +
          Chromatic + Noise + Vignette · GSAP letter-stagger · cursor parallax
        </p>
      </div>
    </main>
  );
}
