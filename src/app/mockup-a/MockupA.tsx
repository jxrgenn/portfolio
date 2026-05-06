"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
 * Mockup A — Iridescent Sculpture
 * Cutting-edge 2026 stack: MeshPhysicalMaterial w/ iridescence + clearcoat,
 * Lightformer studio rig (no external HDR), full postprocessing pass:
 * Bloom + ChromaticAberration + Noise + Vignette.
 */

function Sculpture() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.22;
    ref.current.rotation.x += delta * 0.08;
    const tx = state.pointer.x * 0.4;
    const ty = -state.pointer.y * 0.25;
    ref.current.position.x += (tx - ref.current.position.x) * 0.04;
    ref.current.position.y += (ty - ref.current.position.y) * 0.04;
  });

  return (
    <Float speed={0.9} rotationIntensity={0.25} floatIntensity={0.7}>
      <mesh ref={ref} scale={1.45}>
        <torusKnotGeometry args={[1, 0.34, 256, 32, 2, 3]} />
        <meshPhysicalMaterial
          color="#0a0814"
          metalness={0.85}
          roughness={0.15}
          iridescence={1}
          iridescenceIOR={1.45}
          iridescenceThicknessRange={[100, 480]}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

export function MockupA() {
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
      {/* Mockup label badge */}
      <div className="fixed left-6 top-6 z-50 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 backdrop-blur-md">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          Mockup A · Iridescent
        </span>
      </div>

      {/* Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas dpr={[1, 1.75]} gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={36} />
          <color attach="background" args={["#06060a"]} />
          <ambientLight intensity={0.15} />

          {/* Studio rig — Lightformers create rich reflections without external HDR */}
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

          <Sculpture />

          <ContactShadows
            position={[0, -2.2, 0]}
            scale={10}
            blur={3}
            far={4}
            opacity={0.6}
          />

          <EffectComposer>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.18}
              luminanceSmoothing={0.18}
              mipmapBlur
            />
            <ChromaticAberration
              offset={[0.0012, 0.0012]}
              radialModulation
              modulationOffset={0.3}
              blendFunction={BlendFunction.NORMAL}
            />
            <Noise opacity={0.04} />
            <Vignette eskil={false} offset={0.18} darkness={0.78} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Type overlay */}
      <section className="relative z-10 flex min-h-svh flex-col justify-between px-6 pt-32 pb-16 md:px-10 md:pt-40 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <p
            data-mock-eyebrow
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/55"
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
            className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
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
              className="text-sm text-white/85 underline underline-offset-4"
              style={{ textDecorationColor: "#a9a4ff" }}
            >
              say hi →
            </a>
          </div>
        </div>
      </section>

      {/* Caption pill */}
      <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          Stack
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-white/85">
          R3F · MeshPhysicalMaterial w/ iridescence + clearcoat · Lightformers
          envmap · Bloom + ChromaticAberration + Noise + Vignette · GSAP
          letter-stagger · cursor parallax
        </p>
      </div>
    </main>
  );
}
