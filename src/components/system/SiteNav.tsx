"use client";

import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Work", href: "#work", n: "01" },
  { label: "About", href: "#about", n: "02" },
  { label: "Contact", href: "#contact", n: "03" },
];

export function SiteNav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
  });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (latest > previous && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.6, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-6 py-4 md:px-10"
      style={{
        backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        backgroundColor: scrolled
          ? "color-mix(in oklch, var(--color-bg) 70%, transparent)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--color-border)"
          : "1px solid transparent",
        transition: "background-color 250ms ease, border-color 250ms ease",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Home"
          data-cursor-text="Home"
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{
              background: "var(--color-success)",
              boxShadow: "0 0 12px var(--color-success)",
            }}
            aria-hidden
          />
          <span
            className="font-sans text-sm font-medium tracking-tight"
            style={{ color: "var(--color-fg)" }}
          >
            Jurgen Halili
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.2em] transition-colors"
                style={{ color: "var(--color-fg-muted)" }}
              >
                <span style={{ color: "var(--color-fg-subtle)" }}>
                  {item.n}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="mailto:jurgenhalili1142@gmail.com"
          data-cursor-text="Email"
          className="hidden rounded-full px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.2em] transition-colors md:inline-flex md:items-center md:gap-2"
          style={{
            border: "1px solid var(--color-border-strong)",
            color: "var(--color-fg)",
          }}
        >
          <span style={{ color: "var(--color-accent)" }}>↗</span>
          Get in touch
        </a>
      </div>

      <motion.div
        aria-hidden
        style={{
          scaleX: progressX,
          transformOrigin: "0% 50%",
          background:
            "linear-gradient(to right, var(--color-accent), color-mix(in oklch, var(--color-accent) 50%, white))",
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
      />
    </motion.nav>
  );
}
