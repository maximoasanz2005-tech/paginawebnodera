import { about } from "../siteConfig";

export function About() {
  return (
    <section id="nosotros" className="section section--alt">
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--sp-6)",
          }}
        >
          <div className="reveal" style={{ maxWidth: "60ch" }}>
            <span className="eyebrow">Quiénes somos</span>
            <h2 style={{ fontSize: "var(--fs-4xl)", marginTop: "var(--sp-2)", maxWidth: "18ch" }}>
              {about.title}
            </h2>
          </div>
          <div className="reveal" style={{ maxWidth: "62ch" }}>
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: "var(--fs-lg)",
                  lineHeight: "var(--lh-relaxed)",
                  color: "var(--c-ink-3)",
                  marginBottom: "var(--sp-3)",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
