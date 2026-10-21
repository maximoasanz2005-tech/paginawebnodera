import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { nav, site } from "../siteConfig";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`site-header ${scrolled ? "is-scrolled" : ""}`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: "var(--z-header)",
        background: scrolled ? "rgba(250, 250, 250, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--c-line)" : "1px solid transparent",
        transition: "background var(--transition), border-color var(--transition), backdrop-filter var(--transition)",
      }}
    >
      <div
        className="container"
        style={{
          height: "var(--header-h)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--sp-3)",
        }}
      >
        <a href="#inicio" aria-label={`${site.name} — Inicio`} onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="nav-desktop" aria-label="Navegación principal">
          <ul style={{ display: "flex", gap: "var(--sp-3)", listStyle: "none", margin: 0, padding: 0 }}>
            {nav.slice(0, -1).map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  style={{
                    fontSize: "var(--fs-sm)",
                    fontWeight: 500,
                    color: "var(--c-ink-3)",
                    transition: "color var(--transition)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-ink)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-ink-3)")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
          <a href="#contacto" className="btn btn--primary btn--md">
            Contacto
          </a>
          <button
            className="nav-toggle"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid var(--c-line-strong)",
              borderRadius: "var(--radius-sm)",
              padding: "0.5rem",
              color: "var(--c-ink)",
            }}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div
          className="nav-mobile"
          style={{
            position: "fixed",
            inset: "var(--header-h) 0 0 0",
            background: "var(--c-bg)",
            zIndex: 99,
            padding: "var(--sp-4) var(--sp-3)",
            overflowY: "auto",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "var(--sp-2) 0",
                    fontSize: "var(--fs-lg)",
                    fontWeight: 600,
                    color: "var(--c-ink)",
                    borderBottom: "1px solid var(--c-line)",
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
