import type { ReactNode } from "react";

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={`group relative flex w-full overflow-hidden ${className ?? ""}`}
    >
      <div
        className={`flex shrink-0 items-center gap-4 pr-4 ${
          reverse ? "[animation-direction:reverse]" : ""
        } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""} animate-marquee`}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={`flex shrink-0 items-center gap-4 pr-4 ${
          reverse ? "[animation-direction:reverse]" : ""
        } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""} animate-marquee`}
      >
        {children}
      </div>
    </div>
  );
}
