"use client";

import Link from "next/link";

const ROUTES = [
  { href: "/#cases", label: "Cases" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Editorial masthead — fixed letterhead row with thin double-rule.
 * Three columns: dispatch number / centered title / nav links.
 */
export function NavBar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: "color-mix(in oklch, var(--color-bg) 92%, transparent)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="border-b"
        style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
      />
      <div className="grid grid-cols-3 items-baseline px-6 py-3 md:px-10 lg:px-16">
        <p
          className="font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
        >
          Dispatch № 01
        </p>
        <p
          className="text-center font-serif"
          style={{ color: "var(--color-fg)", fontSize: 13, letterSpacing: "0.32em" }}
        >
          <Link href="/" className="hover:opacity-70 transition-opacity">
            JURGEN HALILI
          </Link>
        </p>
        <nav
          className="flex items-baseline justify-end gap-5 font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
        >
          {ROUTES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              {r.label}
            </Link>
          ))}
        </nav>
      </div>
      <div
        className="border-b"
        style={{ borderColor: "var(--color-fg)", borderBottomWidth: 1 }}
      />
    </header>
  );
}
