/**
 * Reveal-friendly text splitter with two modes.
 *
 * mode="word" (default): each word is its own overflow:hidden box with a
 *   single span inside — GSAP can do a confident mask-from-bottom reveal in
 *   one tween per word. Few DOM nodes, calm reading rhythm. Use the same
 *   `dataAttr` to target the inner span.
 *
 * mode="char": original behavior, one span per char inside no-wrap word
 *   wrappers. Per-character stagger, more frantic.
 */
export function SplitText({
  text,
  dataAttr = "data-scene-char",
  className = "",
  mode = "word",
}: {
  text: string;
  dataAttr?: string;
  className?: string;
  mode?: "char" | "word";
}) {
  const tokens = text.split(/(\s+)/); // keep whitespace tokens

  return (
    <span className={className}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) {
          return (
            <span key={i} aria-hidden style={{ whiteSpace: "pre" }}>
              {tok}
            </span>
          );
        }

        if (mode === "word") {
          return (
            <span
              key={i}
              className="inline-block overflow-hidden align-bottom"
              style={{ whiteSpace: "nowrap" }}
            >
              <span
                {...{ [dataAttr]: "" }}
                className="inline-block"
                style={{ willChange: "transform" }}
              >
                {tok}
              </span>
            </span>
          );
        }

        return (
          <span
            key={i}
            className="inline-block"
            style={{ whiteSpace: "nowrap" }}
          >
            {tok.split("").map((c, j) => (
              <span
                key={j}
                {...{ [dataAttr]: "" }}
                className="inline-block"
              >
                {c}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
