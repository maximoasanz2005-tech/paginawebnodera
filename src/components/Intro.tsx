import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { site } from "../siteConfig";

/**
 * Pantalla de introducción de marca.
 *
 * - Se muestra una vez por sesión del navegador (sessionStorage).
 * - Duración aproximada: ~1.6s.
 * - Respeta prefers-reduced-motion (sin animación, duración mínima).
 * - Incluye botón "Entrar al sitio" para omitir.
 * - Si JS falla, el contenido principal sigue siendo accesible porque
 *   el intro se renderiza condicionalmente y el resto de la página
 *   está siempre presente en el DOM.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  const reduceMotion = typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const DURATION = reduceMotion ? 400 : 1600;
    const t = setTimeout(() => startExit(), DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startExit() {
    setExiting(true);
    setTimeout(onDone, reduceMotion ? 0 : 520);
  }

  function handleSkip() {
    startExit();
  }

  return (
    <div
      role="dialog"
      aria-label="Bienvenida a NODERA"
      aria-modal="false"
      onClick={handleSkip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-intro)",
        background: "var(--c-ink)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--sp-4)",
        opacity: exiting ? 0 : 1,
        transition: reduceMotion ? "none" : "opacity 520ms ease",
        cursor: "pointer",
      }}
    >
      <div
        className="intro-logo"
        style={{
          opacity: reduceMotion ? 1 : 0,
          transform: reduceMotion ? "none" : "translateY(12px)",
          animation: reduceMotion ? "none" : "introFadeIn 700ms 200ms forwards ease-out",
        }}
      >
        <Logo variant="light" />
      </div>
      <p
        style={{
          color: "var(--c-muted-2)",
          fontSize: "var(--fs-xs)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          margin: 0,
          opacity: reduceMotion ? 1 : 0,
          animation: reduceMotion ? "none" : "introFadeIn 600ms 600ms forwards ease-out",
        }}
      >
        {site.tagline}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        style={{
          position: "absolute",
          bottom: "var(--sp-6)",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "var(--c-muted-2)",
          padding: "0.6rem 1.25rem",
          borderRadius: "var(--radius)",
          fontSize: "var(--fs-sm)",
          transition: "color var(--transition), border-color var(--transition)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--c-muted-2)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        Entrar al sitio
      </button>
    </div>
  );
}
