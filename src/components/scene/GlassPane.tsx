import type { CSSProperties, ReactNode } from "react";

export function GlassPane({
  children,
  className = "",
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "article" | "aside";
}) {
  return (
    <Tag className={`glass-pane ${className}`} style={style}>
      {children}
    </Tag>
  );
}
