import { projects } from "../siteConfig";
import { SectionHeading } from "../components/SectionHeading";
import { Icon } from "../components/Icon";

/**
 * Sección de portfolio.
 *
 * Si el array `projects` en siteConfig.ts está vacío, se muestra un mensaje
 * informativo en lugar de tarjetas vacías o contenido ficticio.
 *
 * Para agregar un proyecto, completá un objeto en el array `projects`
 * con los campos definidos en la interfaz ProjectCard de siteConfig.ts.
 */
export function Portfolio() {
  const hasProjects = projects.length > 0;

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Portfolio"
          title="Nuestros proyectos"
          description="Una selección de trabajos realizados. Próximamente compartiremos más proyectos aquí."
        />

        {hasProjects ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "var(--sp-3)",
            }}
          >
            {projects
              .filter((p) => p.published)
              .map((project, i) => (
                <article
                  key={project.id}
                  className="reveal"
                  style={{
                    background: "var(--c-surface)",
                    border: "1px solid var(--c-line)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    transitionDelay: `${i * 60}ms`,
                  }}
                >
                  {project.coverImage && (
                    <div
                      style={{
                        aspectRatio: "16 / 10",
                        background: "var(--c-bg-alt)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={project.coverImage}
                        alt={`Portada del proyecto ${project.name}`}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}
                  <div style={{ padding: "var(--sp-3)" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--sp-1)",
                        marginBottom: "var(--sp-1)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "var(--fs-xs)",
                          fontWeight: 600,
                          color: "var(--c-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {project.category}
                      </span>
                      {project.type === "conceptual" && (
                        <span
                          style={{
                            fontSize: "var(--fs-xs)",
                            color: "var(--c-muted)",
                            fontStyle: "italic",
                          }}
                        >
                          · Concepto
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "var(--fs-lg)", marginBottom: "var(--sp-1)" }}>
                      {project.name}
                    </h3>
                    <p style={{ fontSize: "var(--fs-sm)", color: "var(--c-ink-3)", marginBottom: "var(--sp-2)" }}>
                      {project.description}
                    </p>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "var(--fs-sm)",
                          fontWeight: 600,
                          color: "var(--c-ink)",
                        }}
                      >
                        Ver proyecto
                        <Icon name="arrow-up-right" size={16} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
          </div>
        ) : (
          <div
            className="reveal"
            style={{
              border: "1px dashed var(--c-line-strong)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--sp-8)",
              textAlign: "center",
              background: "var(--c-surface-alt)",
            }}
          >
            <p
              style={{
                fontSize: "var(--fs-lg)",
                color: "var(--c-ink-3)",
                maxWidth: "40ch",
                margin: "0 auto",
              }}
            >
              Próximamente compartiremos acá los proyectos realizados.
            </p>
            <p style={{ marginTop: "var(--sp-2)", color: "var(--c-muted)", fontSize: "var(--fs-sm)" }}>
              Si querés ver avances o trabajos en curso, escribinos desde el formulario de contacto.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
