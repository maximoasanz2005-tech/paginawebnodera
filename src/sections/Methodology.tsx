import { methodology } from "../siteConfig";
import { SectionHeading } from "../components/SectionHeading";

export function Methodology() {
  return (
    <section id="metodologia" className="section section--alt">
      <div className="container">
        <SectionHeading
          eyebrow="Metodología"
          title="Cómo trabajamos"
          description="Un proceso claro y colaborativo, de la primera charla a la entrega final."
        />

        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--sp-3)",
            counterReset: "step",
          }}
        >
          {methodology.map((step, i) => (
            <li
              key={step.number}
              className="reveal"
              style={{
                background: "var(--c-surface)",
                border: "1px solid var(--c-line)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--sp-4)",
                position: "relative",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--fs-2xl)",
                  fontWeight: 800,
                  color: "var(--c-line-strong)",
                  lineHeight: 1,
                  display: "block",
                  marginBottom: "var(--sp-2)",
                }}
              >
                {step.number}
              </span>
              <h3 style={{ fontSize: "var(--fs-lg)", marginBottom: "var(--sp-1)" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "var(--fs-sm)", color: "var(--c-ink-3)", lineHeight: "var(--lh-relaxed)" }}>
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
