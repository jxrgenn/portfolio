"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AI_PATH = "M 0 78 C 240 48, 480 92, 720 58 S 1080 80, 1200 68";
const BC_PATH = "M 0 130 C 240 162, 480 118, 720 152 S 1080 128, 1200 142";

const AI_NODES = [
  { x: 150, y: 65, label: "bachelor" },
  { x: 600, y: 72, label: "personal projects" },
  { x: 1080, y: 76, label: "nextgen ai" },
] as const;

const BC_NODES = [
  { x: 150, y: 152, label: "self-taught" },
  { x: 600, y: 138, label: "freelance" },
  { x: 1080, y: 130, label: "cert (soon)" },
] as const;

export function TwoTracks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const aiPathRef = useRef<SVGPathElement>(null);
  const bcPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const aiPath = aiPathRef.current;
    const bcPath = bcPathRef.current;
    const wrap = wrapRef.current;
    if (!aiPath || !bcPath || !wrap) return;

    const aiLen = aiPath.getTotalLength();
    const bcLen = bcPath.getTotalLength();
    aiPath.style.strokeDasharray = String(aiLen);
    aiPath.style.strokeDashoffset = String(aiLen);
    bcPath.style.strokeDasharray = String(bcLen);
    bcPath.style.strokeDashoffset = String(bcLen);

    const ctx = gsap.context(() => {
      gsap.to(aiPath, {
        strokeDashoffset: 0,
        duration: 1.7,
        ease: "power2.inOut",
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
      gsap.to(bcPath, {
        strokeDashoffset: 0,
        duration: 1.7,
        delay: 0.18,
        ease: "power2.inOut",
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
      gsap.from("[data-track-node]", {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
        stagger: 0.07,
        duration: 0.5,
        delay: 0.7,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
      gsap.from("[data-track-label]", {
        opacity: 0,
        y: 6,
        stagger: 0.05,
        duration: 0.55,
        delay: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  const monoStyle = { fontFamily: "var(--font-mono), ui-monospace, monospace" };

  return (
    <div ref={wrapRef} className="relative w-full" aria-hidden>
      {/* Mobile fallback — labels would be unreadable in a 65px-tall SVG */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:hidden">
        <div className="flex flex-col gap-2.5">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(70,40,120,0.92)" }}
          >
            AI · NATIVE
          </p>
          <ul className="flex flex-col gap-2.5">
            {AI_NODES.map((n) => (
              <li
                key={n.label}
                className="flex items-center gap-2.5 text-[12px]"
                style={{ color: "rgba(40,20,70,0.85)" }}
              >
                <span
                  aria-hidden
                  className="block h-2 w-2 rounded-full"
                  style={{
                    background: "#9590ff",
                    boxShadow: "0 0 8px #9590ff",
                  }}
                />
                <span className="font-sans capitalize">{n.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2.5">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(120,60,20,0.92)" }}
          >
            BC / NAV
          </p>
          <ul className="flex flex-col gap-2.5">
            {BC_NODES.map((n) => (
              <li
                key={n.label}
                className="flex items-center gap-2.5 text-[12px]"
                style={{ color: "rgba(70,30,5,0.85)" }}
              >
                <span
                  aria-hidden
                  className="block h-2 w-2 rounded-full"
                  style={{
                    background: "#d68d4a",
                    boxShadow: "0 0 8px #d68d4a",
                  }}
                />
                <span className="font-sans capitalize">{n.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop SVG — rendered only md+, so the GSAP draw-in works on the visible one */}
      <svg
        viewBox="0 0 1200 210"
        preserveAspectRatio="xMidYMid meet"
        className="hidden w-full md:block"
      >
        <defs>
          <linearGradient id="ai-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9590ff" stopOpacity="0" />
            <stop offset="14%" stopColor="#9590ff" stopOpacity="0.85" />
            <stop offset="86%" stopColor="#5b51d6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#5b51d6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8a26a" stopOpacity="0" />
            <stop offset="14%" stopColor="#e8a26a" stopOpacity="0.85" />
            <stop offset="86%" stopColor="#b56e30" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#b56e30" stopOpacity="0" />
          </linearGradient>
          <filter id="track-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          ref={aiPathRef}
          d={AI_PATH}
          fill="none"
          stroke="url(#ai-grad)"
          strokeWidth="1.4"
          strokeLinecap="round"
          filter="url(#track-glow)"
        />
        <path
          ref={bcPathRef}
          d={BC_PATH}
          fill="none"
          stroke="url(#bc-grad)"
          strokeWidth="1.4"
          strokeLinecap="round"
          filter="url(#track-glow)"
        />

        {AI_NODES.map((n) => (
          <g key={n.label}>
            <circle
              data-track-node
              cx={n.x}
              cy={n.y}
              r="3.4"
              fill="#9590ff"
              filter="url(#track-glow)"
            />
            <text
              data-track-label
              x={n.x}
              y={n.y - 10}
              textAnchor="middle"
              fontSize="8.5"
              letterSpacing="1.4"
              fill="rgba(70,40,120,0.78)"
              style={monoStyle}
            >
              {n.label.toUpperCase()}
            </text>
          </g>
        ))}

        {BC_NODES.map((n) => (
          <g key={n.label}>
            <circle
              data-track-node
              cx={n.x}
              cy={n.y}
              r="3.4"
              fill="#d68d4a"
              filter="url(#track-glow)"
            />
            <text
              data-track-label
              x={n.x}
              y={n.y + 16}
              textAnchor="middle"
              fontSize="8.5"
              letterSpacing="1.4"
              fill="rgba(120,60,20,0.78)"
              style={monoStyle}
            >
              {n.label.toUpperCase()}
            </text>
          </g>
        ))}

        <text
          data-track-label
          x="0"
          y="32"
          fontSize="10"
          letterSpacing="2.2"
          fill="rgba(70,40,120,0.92)"
          style={monoStyle}
        >
          AI · NATIVE
        </text>
        <text
          data-track-label
          x="0"
          y="200"
          fontSize="10"
          letterSpacing="2.2"
          fill="rgba(120,60,20,0.92)"
          style={monoStyle}
        >
          BC / NAV
        </text>
      </svg>
    </div>
  );
}
