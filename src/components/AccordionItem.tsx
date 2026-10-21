import { useId, useRef, useState, useEffect } from "react";
import { Icon } from "./Icon";

interface AccordionItemProps {
  question: string;
  answer: string;
  pending?: boolean;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, pending, defaultOpen }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [maxHeight, setMaxHeight] = useState<number | string>(defaultOpen ? "none" : 0);
  const panelId = useId();
  const btnId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      setMaxHeight(el.scrollHeight);
      const t = setTimeout(() => setMaxHeight("none"), 520);
      return () => clearTimeout(t);
    } else {
      setMaxHeight(el.scrollHeight);
      requestAnimationFrame(() => setMaxHeight(0));
    }
  }, [open]);

  return (
    <div style={{ borderBottom: "1px solid var(--c-line)" }}>
      <h3 style={{ margin: 0, fontSize: "var(--fs-lg)" }}>
        <button
          id={btnId}
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--sp-2)",
            padding: "var(--sp-3) 0",
            background: "transparent",
            border: "none",
            textAlign: "left",
            color: "var(--c-ink)",
            fontSize: "inherit",
            fontWeight: 600,
            lineHeight: "var(--lh-snug)",
          }}
        >
          <span>{question}</span>
          <Icon
            name="chevron-down"
            size={20}
            style={{
              flexShrink: 0,
              transition: "transform var(--transition)",
              transform: open ? "rotate(180deg)" : "none",
              color: "var(--c-muted)",
            }}
          />
        </button>
      </h3>
      <div
        id={panelId}
        ref={contentRef}
        role="region"
        aria-labelledby={btnId}
        style={{
          overflow: "hidden",
          maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
          transition: "max-height var(--transition-slow) ease",
        }}
      >
        <div style={{ padding: "0 0 var(--sp-3)", color: "var(--c-ink-3)", lineHeight: "var(--lh-relaxed)" }}>
          <p>{answer}</p>
          {pending && (
            <p
              style={{
                marginTop: "var(--sp-2)",
                fontSize: "var(--fs-xs)",
                color: "var(--c-muted)",
                fontStyle: "italic",
              }}
            >
              Texto a completar antes de publicar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
