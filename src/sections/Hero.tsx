import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { hero } from "../siteConfig";

export function Hero() {
  return (
    <section id="inicio" style={{ paddingTop: "calc(var(--header-h) + var(--sp-10))", paddingBottom: "var(--sp-12)" }}>
      <div className="container">
        <div
          className="reveal"
          style={{
            maxWidth: "var(--container-narrow)",
          }}
        >
          <span className="eyebrow">NODERA · {`Imagen y presencia digital`}</span>
          <h1
            style={{
              fontSize: "var(--fs-5xl)",
              lineHeight: "var(--lh-tight)",
              marginTop: "var(--sp-3)",
              letterSpacing: "-0.03em",
            }}
          >
            {hero.title}
          </h1>
          <p
            className="lead"
            style={{
              marginTop: "var(--sp-4)",
              fontSize: "var(--fs-xl)",
              maxWidth: "52ch",
            }}
          >
            {hero.text}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)", marginTop: "var(--sp-5)" }}>
            <Button as="a" href={hero.ctaPrimary.href} variant="primary" size="lg">
              {hero.ctaPrimary.label}
              <Icon name="arrow" size={18} />
            </Button>
            <Button as="a" href={hero.ctaSecondary.href} variant="secondary" size="lg">
              {hero.ctaSecondary.label}
            </Button>
          </div>
        </div>

        {/* Detalle visual abstracto — composición minimalista con grid */}
        <div
          className="reveal"
          aria-hidden="true"
          style={{
            marginTop: "var(--sp-10)",
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "var(--sp-2)",
            height: "320px",
          }}
        >
          <div
            style={{
              gridColumn: "span 7",
              background: "linear-gradient(135deg, var(--c-ink) 0%, var(--c-ink-2) 100%)",
              borderRadius: "var(--radius-lg)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "200px",
                height: "200px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "120px",
                height: "120px",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          <div
            style={{
              gridColumn: "span 5",
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              gap: "var(--sp-2)",
            }}
          >
            <div
              style={{
                background: "var(--c-surface)",
                border: "1px solid var(--c-line)",
                borderRadius: "var(--radius-lg)",
              }}
            />
            <div
              style={{
                background: "var(--c-accent-soft)",
                border: "1px solid var(--c-line)",
                borderRadius: "var(--radius-lg)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
