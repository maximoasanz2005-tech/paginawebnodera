import { Icon } from "../components/Icon";
import { services } from "../siteConfig";
import { SectionHeading } from "../components/SectionHeading";

export function Services() {
  return (
    <section id="servicios" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Servicios"
          title="Lo que podemos hacer juntos"
          description="Tres áreas de trabajo que se combinan para profesionalizar la presencia digital de tu empresa."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--sp-3)",
          }}
        >
          {services.map((service, i) => (
            <article
              key={service.id}
              className="reveal"
              style={{
                background: "var(--c-surface)",
                border: "1px solid var(--c-line)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--sp-4)",
                display: "flex",
                flexDirection: "column",
                transition: "transform var(--transition), box-shadow var(--transition), border-color var(--transition)",
                transitionDelay: `${i * 60}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                e.currentTarget.style.borderColor = "var(--c-line-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "var(--c-line)";
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius)",
                  background: "var(--c-ink)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "var(--sp-3)",
                }}
              >
                <Icon name={service.icon} size={24} />
              </div>
              <h3 style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-2)" }}>
                {service.title}
              </h3>
              <p style={{ color: "var(--c-ink-3)", marginBottom: "var(--sp-3)", lineHeight: "var(--lh-relaxed)" }}>
                {service.description}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 var(--sp-4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--sp-1)",
                  flex: 1,
                }}
              >
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--sp-1)",
                      fontSize: "var(--fs-sm)",
                      color: "var(--c-ink-3)",
                    }}
                  >
                    <Icon
                      name="check"
                      size={18}
                      style={{ color: "var(--c-accent)", flexShrink: 0, marginTop: "2px" }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={service.cta.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--sp-1)",
                  fontSize: "var(--fs-sm)",
                  fontWeight: 600,
                  color: "var(--c-ink)",
                  transition: "gap var(--transition)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.gap = "0.75rem")}
                onMouseLeave={(e) => (e.currentTarget.style.gap = "0.5rem")}
              >
                {service.cta.label}
                <Icon name="arrow-up-right" size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
