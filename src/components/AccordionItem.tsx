import { useId, useRef, useState } from "react";
import { Icon } from "./Icon";

interface AccordionItemProps {
  question: string;
  answer: string;
  pending?: boolean;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, pending, defaultOpen }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const panelId = useId();
  const btnId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--c-line)",
      }}
    >
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
          maxHeight: open ? (contentRef.current?.scrollHeight ?? 500) : 0,
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
