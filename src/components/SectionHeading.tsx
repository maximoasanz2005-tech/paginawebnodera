import type { ReactNode, CSSProperties } from "react";
import { useId } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  children,
  style,
}: SectionHeadingProps) {
  const id = useId();
  const alignStyle = align === "center" ? { textAlign: "center" as const, margin: "0 auto" } : {};

  return (
    <div className="reveal" style={{ marginBottom: "var(--sp-6)", ...alignStyle, ...style }}>
      {eyebrow && (
        <span className="eyebrow" style={dark ? { color: "var(--c-muted-2)" } : undefined}>
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        style={{
          marginTop: "var(--sp-2)",
          fontSize: "var(--fs-4xl)",
          maxWidth: align === "center" ? "20ch" : "16ch",
          ...alignStyle,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="lead"
          style={{
            marginTop: "var(--sp-3)",
            color: dark ? "var(--c-muted-2)" : "var(--c-ink-3)",
            ...alignStyle,
          }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
