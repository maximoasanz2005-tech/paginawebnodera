import { Logo } from "../components/Logo";
import { Icon } from "../components/Icon";
import { site, contact, nav, footer } from "../siteConfig";

export function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    { url: contact.social.instagram, icon: "instagram", label: "Instagram" },
    { url: contact.social.linkedin, icon: "linkedin", label: "LinkedIn" },
    { url: contact.social.facebook, icon: "facebook", label: "Facebook" },
  ].filter((s) => s.url);

  return (
    <footer
      style={{
        background: "var(--c-ink)",
        color: "var(--c-muted-2)",
        paddingTop: "var(--sp-10)",
        paddingBottom: "var(--sp-5)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--sp-5)",
          }}
          className="footer-grid"
        >
          <div style={{ maxWidth: "40ch" }}>
            <Logo variant="light" />
            <p style={{ marginTop: "var(--sp-3)", fontSize: "var(--fs-sm)", lineHeight: "var(--lh-relaxed)" }}>
              {footer.description}
            </p>
          </div>

          <div>
            <h4
              style={{
                color: "#fff",
                fontSize: "var(--fs-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "var(--sp-2)",
              }}
            >
              Navegación
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    style={{
                      fontSize: "var(--fs-sm)",
                      color: "var(--c-muted-2)",
                      transition: "color var(--transition)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-muted-2)")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: "#fff",
                fontSize: "var(--fs-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "var(--sp-2)",
              }}
            >
              Contacto
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "var(--fs-sm)",
                    color: "var(--c-muted-2)",
                  }}
                >
                  <Icon name="mail" size={16} />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "var(--fs-sm)",
                    color: "var(--c-muted-2)",
                  }}
                >
                  <Icon name="phone" size={16} />
                  {contact.phoneDisplay}
                </a>
              </li>
            </ul>
            {socialLinks.length > 0 && (
              <div style={{ display: "flex", gap: "var(--sp-1)", marginTop: "var(--sp-3)" }}>
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--c-muted-2)",
                      transition: "color var(--transition), border-color var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--c-muted-2)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                  >
                    <Icon name={s.icon} size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: "var(--sp-8)",
            paddingTop: "var(--sp-4)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-1)",
            fontSize: "var(--fs-xs)",
          }}
        >
          <p>
            © {year} {site.name}. {site.market}.
          </p>
          <p style={{ color: "var(--c-muted)" }}>
            Aviso de privacidad: próximamente disponible.
          </p>
        </div>
      </div>
    </footer>
  );
}
