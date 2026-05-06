// Editorial colophon footer — hairline rule, three-column layout.
export function Footer() {
  return (
    <footer
      className="relative z-10 px-6 pb-10 pt-16 md:px-10 lg:px-16"
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="border-t"
        style={{ borderColor: "var(--color-fg)", borderTopWidth: 2 }}
      />
      <div
        className="mt-1 border-t"
        style={{ borderColor: "var(--color-fg)", borderTopWidth: 1 }}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:items-baseline">
        <div>
          <p
            className="font-serif italic"
            style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
          >
            Colophon
          </p>
          <p
            className="mt-2 font-serif"
            style={{ color: "var(--color-fg)", fontSize: 18 }}
          >
            Jurgen Halili
          </p>
          <p
            className="mt-1 font-serif italic"
            style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
          >
            Tirana, Albania — 2026
          </p>
        </div>

        <ul
          className="flex flex-col gap-2 font-serif md:items-center"
          style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
        >
          <li>
            <a
              href="mailto:jurgenhalili1142@gmail.com"
              className="transition-colors hover:text-[var(--color-accent)]"
              style={{
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                textUnderlineOffset: 4,
              }}
            >
              jurgenhalili1142@gmail.com
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/jurgen-halili-b227a6255"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              linkedin
            </a>
            <span style={{ color: "var(--color-fg-subtle)" }}> — </span>
            <a
              href="https://github.com/jurgenhalili"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              github
            </a>
          </li>
        </ul>

        <p
          className="font-serif italic md:text-right"
          style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
        >
          Set in Fraunces & Geist. Built with Next.js 16,
          <br />
          MongoDB Atlas, deployed on Vercel.
        </p>
      </div>
    </footer>
  );
}
