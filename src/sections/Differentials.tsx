import { differentials } from "../siteConfig";
import { Icon } from "../components/Icon";
import { SectionHeading } from "../components/SectionHeading";

export function Differentials() {
  return (
    <section id="diferenciales" className="section section--dark">
      <div className="container">
        <SectionHeading
          eyebrow="Por qué elegirnos"
          title="Nuestra forma de trabajar"
          description="No prometemos milagros. Prometemos atención, criterio y soluciones pensadas para tu empresa."
          dark
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--sp-4)",
          }}
        >
          {differentials.map((item, i) => (
            <div
              key={item.title}
              className="reveal"
              style={{
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "var(--sp-2)",
                  color: "#fff",
                }}
              >
                <Icon name={item.icon} size={22} />
              </div>
              <h3 style={{ fontSize: "var(--fs-lg)", marginBottom: "var(--sp-1)", color: "#fff" }}>
                {item.title}
              </h3>
              <p style={{ color: "var(--c-muted-2)", fontSize: "var(--fs-sm)", lineHeight: "var(--lh-relaxed)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
