"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Work", href: "#work", n: "01" },
  { label: "Path", href: "#path", n: "02" },
  { label: "Live", href: "#live", n: "03" },
  { label: "About", href: "#about", n: "04" },
  { label: "Contact", href: "#contact", n: "05" },
];

export function SiteNav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
  });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (latest > previous && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Body scroll lock + escape-to-close while overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
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
          transition:
            "background-color 250ms ease, border-color 250ms ease",
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

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="relative grid h-9 w-9 place-items-center rounded-full md:hidden"
            style={{
              border: "1px solid var(--color-border-strong)",
              color: "var(--color-fg)",
            }}
          >
            <span aria-hidden className="flex flex-col gap-[5px]">
              <span
                className="block h-[1.5px] w-4 rounded"
                style={{ background: "var(--color-fg)" }}
              />
              <span
                className="block h-[1.5px] w-4 rounded"
                style={{ background: "var(--color-fg)" }}
              />
            </span>
          </button>
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

      <AnimatePresence>
        {open && <MobileMenuOverlay onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MobileMenuOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0.6, 0.2, 1] }}
      className="fixed inset-0 z-[60] md:hidden"
      style={{
        backgroundColor: "color-mix(in oklch, var(--color-bg) 92%, transparent)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
      }}
    >
      {/* Top bar — close button */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3"
          aria-label="Home"
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

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid h-9 w-9 place-items-center rounded-full"
          style={{
            border: "1px solid var(--color-border-strong)",
            color: "var(--color-fg)",
          }}
        >
          <span aria-hidden className="text-base leading-none">×</span>
        </button>
      </div>

      {/* Items */}
      <motion.ul
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
        className="mt-6 flex flex-col px-6"
      >
        {NAV_ITEMS.map((item) => (
          <motion.li
            key={item.href}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.2, 0.6, 0.2, 1] }}
            className="border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <a
              href={item.href}
              onClick={onClose}
              className="flex items-baseline gap-4 py-5"
              style={{ color: "var(--color-fg)" }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.24em]"
                style={{ color: "var(--color-fg-subtle)" }}
              >
                {item.n}
              </span>
              <span
                className="font-serif"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(2rem, 8vw, 2.6rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </a>
          </motion.li>
        ))}
      </motion.ul>

      {/* Footer block */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
        className="mt-10 flex flex-col gap-4 px-6"
      >
        <a
          href="mailto:jurgenhalili1142@gmail.com"
          onClick={onClose}
          className="inline-flex w-full items-center justify-between rounded-full px-5 py-3 font-sans text-sm"
          style={{
            border: "1px solid var(--color-border-strong)",
            color: "var(--color-fg)",
          }}
        >
          <span>jurgenhalili1142@gmail.com</span>
          <span style={{ color: "var(--color-accent)" }}>↗</span>
        </a>

        <a
          href="/cv.pdf"
          download
          onClick={onClose}
          className="inline-flex w-full items-center justify-between rounded-full px-5 py-3 font-sans text-sm font-medium"
          style={{
            background: "var(--color-fg)",
            color: "var(--color-bg)",
          }}
        >
          <span>Download CV</span>
          <span aria-hidden>↓</span>
        </a>

        <ul
          className="mt-1 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "var(--color-fg-muted)" }}
        >
          <li>
            <a href="https://github.com/jxrgenn" target="_blank" rel="noopener noreferrer">
              github
            </a>
          </li>
          <li aria-hidden>·</li>
          <li>
            <a
              href="https://www.linkedin.com/in/jurgen-halili-b227a6255"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin
            </a>
          </li>
          <li aria-hidden>·</li>
          <li>
            <a href="https://instagram.com/jxrgenn" target="_blank" rel="noopener noreferrer">
              instagram
            </a>
          </li>
          <li aria-hidden>·</li>
          <li>kiel, de</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
