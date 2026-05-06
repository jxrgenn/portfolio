"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { gsap } from "gsap";
import * as THREE from "three";

/**
 * Mockup B — Liquid Mercury Shader
 * Fullscreen GLSL fragment shader: animated metaball-style gradient with
 * cursor displacement + scroll-tied color drift. No traditional geometry —
 * the shader IS the visual. Inspired by linear.app / vercel hero gradients
 * but pushed further with custom flow distortion.
 */

const fragment = /* glsl */ `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseStrength;
varying vec2 vUv;

// Smooth value noise
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

  // Mouse displacement field
  vec2 mouse = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float distMouse = distance(uv, mouse);
  vec2 displaceDir = normalize(uv - mouse + 0.0001);
  float push = exp(-distMouse * 2.4) * 0.35 * uMouseStrength;
  uv -= displaceDir * push;

  // Flow field
  float t = uTime * 0.08;
  vec2 q = vec2(
    fbm(uv + vec2(0.0, 0.0) + t),
    fbm(uv + vec2(5.2, 1.3) + t * 0.7)
  );
  vec2 r = vec2(
    fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 1.1),
    fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.9)
  );
  float f = fbm(uv + 4.0 * r + t * 0.6);

  // Color palette — deep navy → indigo → electric purple → warm peach highlights
  vec3 c1 = vec3(0.04, 0.04, 0.10); // near-black navy
  vec3 c2 = vec3(0.18, 0.12, 0.42); // indigo
  vec3 c3 = vec3(0.55, 0.32, 0.95); // electric violet
  vec3 c4 = vec3(0.98, 0.78, 0.62); // peach highlight

  vec3 color = mix(c1, c2, smoothstep(-0.6, 0.5, f));
  color = mix(color, c3, smoothstep(0.2, 0.9, f) * 0.7);
  color = mix(color, c4, smoothstep(0.55, 1.0, f) * 0.5);

  // Add specular streak driven by r.y
  color += vec3(0.95, 0.88, 1.0) * smoothstep(0.7, 0.95, abs(r.y)) * 0.35;

  // Subtle vignette for cinematic feel
  float v = 1.0 - smoothstep(0.5, 1.4, length(vUv - 0.5));
  color *= v;

  gl_FragColor = vec4(color, 1.0);
}
`;

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

function FluidShader() {
  const { size, pointer } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetStrength = useRef(0);

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uResolution.value.set(size.width, size.height);

    // smooth mouse
    targetMouse.current.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    u.uMouse.value.lerp(targetMouse.current, 0.08);

    targetStrength.current = 1;
    u.uMouseStrength.value += (targetStrength.current - u.uMouseStrength.value) * 0.05;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function MockupB() {
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
      <div className="fixed left-6 top-6 z-50 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 backdrop-blur-md">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          Mockup B · Liquid Shader
        </span>
      </div>

      {/* Custom-shader fullscreen canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          orthographic
          camera={{ position: [0, 0, 1] }}
          dpr={[1, 1.75]}
        >
          <FluidShader />
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.2}
              mipmapBlur
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.2} darkness={0.65} />
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
              color: "#fafafa",
              mixBlendMode: "difference",
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
            className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
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
              className="text-sm text-white underline underline-offset-4"
              style={{ textDecorationColor: "#c799ff" }}
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
          Custom GLSL fragment shader · domain-warp FBM noise · cursor
          displacement field · navy → violet → peach palette · Bloom + Noise +
          Vignette · GSAP letter-stagger
        </p>
      </div>
    </main>
  );
}
