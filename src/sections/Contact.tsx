import { useState, type FormEvent } from "react";
import { Icon } from "../components/Icon";
import { contact, services } from "../siteConfig";

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  consent: boolean;
  website: string; // honeypot
}

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  service: "",
  message: "",
  consent: false,
  website: "",
};

export function Contact() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) e.name = "Ingresá tu nombre";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresá un correo válido";
    if (form.message.trim().length < 10) e.message = "Contanos un poco más sobre tu proyecto";
    if (!form.consent) e.consent = "Debés aceptar el aviso de privacidad";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm(initialState);
      } else {
        throw new Error(data.error || "No se pudo enviar");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Ocurrió un error inesperado");
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid var(--c-line-strong)",
    borderRadius: "var(--radius)",
    fontSize: "var(--fs-base)",
    fontFamily: "inherit",
    background: "var(--c-surface)",
    color: "var(--c-ink)",
    transition: "border-color var(--transition), box-shadow var(--transition)",
  };

  function inputStyle(hasError?: boolean): React.CSSProperties {
    return {
      ...inputBase,
      borderColor: hasError ? "var(--c-error)" : undefined,
    };
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "var(--fs-sm)",
    fontWeight: 600,
    marginBottom: "0.4rem",
    color: "var(--c-ink)",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "var(--fs-xs)",
    color: "var(--c-error)",
    marginTop: "0.3rem",
  };

  return (
    <section id="contacto" className="section section--alt">
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--sp-6)",
          }}
          className="contact-grid"
        >
          <div className="reveal">
            <span className="eyebrow">Contacto</span>
            <h2 style={{ fontSize: "var(--fs-4xl)", marginTop: "var(--sp-2)", maxWidth: "16ch" }}>
              Trabajemos juntos
            </h2>
            <p className="lead" style={{ marginTop: "var(--sp-3)" }}>
              Contanos qué necesitás y te respondemos a la brevedad. También podés escribirnos directamente.
            </p>

            <div style={{ marginTop: "var(--sp-4)", display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
              <a
                href={`mailto:${contact.email}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--sp-2)",
                  fontSize: "var(--fs-lg)",
                  fontWeight: 600,
                  color: "var(--c-ink)",
                }}
              >
                <Icon name="mail" size={22} style={{ color: "var(--c-accent)" }} />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--sp-2)",
                  fontSize: "var(--fs-lg)",
                  fontWeight: 600,
                  color: "var(--c-ink)",
                }}
              >
                <Icon name="phone" size={22} style={{ color: "var(--c-accent)" }} />
                {contact.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="reveal">
            {status === "success" ? (
              <div
                role="status"
                style={{
                  border: "1px solid var(--c-success)",
                  background: "var(--c-success-soft)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--sp-5)",
                  textAlign: "center",
                }}
              >
                <Icon
                  name="check"
                  size={40}
                  style={{ color: "var(--c-success)", margin: "0 auto var(--sp-2)" }}
                />
                <h3 style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-1)" }}>
                  Consulta enviada
                </h3>
                <p style={{ color: "var(--c-ink-3)" }}>
                  Gracias por escribirnos. Te respondemos a la brevedad.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn btn--secondary btn--md"
                  style={{ marginTop: "var(--sp-3)" }}
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--sp-3)",
                }}
              >
                {/* Honeypot anti-spam — oculto visualmente */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                >
                  <label>
                    No completar
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                    />
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--sp-3)" }}>
                  <div>
                    <label htmlFor="name" style={labelStyle}>
                      Nombre <span style={{ color: "var(--c-error)" }}>*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      style={inputStyle(!!errors.name)}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      autoComplete="name"
                    />
                    {errors.name && <p style={errorStyle}>{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" style={labelStyle}>
                      Correo electrónico <span style={{ color: "var(--c-error)" }}>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      style={inputStyle(!!errors.email)}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      autoComplete="email"
                    />
                    {errors.email && <p style={errorStyle}>{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="company" style={labelStyle}>
                      Empresa <span style={{ color: "var(--c-muted)", fontWeight: 400 }}>(opcional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      style={inputBase}
                      autoComplete="organization"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" style={labelStyle}>
                      Servicio de interés
                    </label>
                    <select
                      id="service"
                      value={form.service}
                      onChange={(e) => update("service", e.target.value)}
                      style={inputBase}
                    >
                      <option value="">Seleccionar...</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="otro">Otro / No estoy seguro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" style={labelStyle}>
                      Mensaje <span style={{ color: "var(--c-error)" }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      style={{ ...inputStyle(!!errors.message), resize: "vertical" }}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && <p style={errorStyle}>{errors.message}</p>}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        fontSize: "var(--fs-sm)",
                        color: "var(--c-ink-3)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => update("consent", e.target.checked)}
                        aria-required="true"
                        aria-invalid={!!errors.consent}
                        style={{ marginTop: "3px", width: "18px", height: "18px", flexShrink: 0 }}
                      />
                      <span>
                        Acepto que NODERA guarde mis datos de contacto para responder mi consulta. *
                      </span>
                    </label>
                    {errors.consent && <p style={errorStyle}>{errors.consent}</p>}
                  </div>
                </div>

                {status === "error" && (
                  <div
                    role="alert"
                    style={{
                      padding: "var(--sp-2) var(--sp-3)",
                      background: "var(--c-error-soft)",
                      border: "1px solid var(--c-error)",
                      borderRadius: "var(--radius)",
                      color: "var(--c-error)",
                      fontSize: "var(--fs-sm)",
                    }}
                  >
                    {errorMsg || "No pudimos enviar tu consulta. Intentá de nuevo o escribinos por correo."}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn btn--primary btn--lg"
                  >
                    {status === "submitting" ? "Enviando..." : "Enviar consulta"}
                    {status !== "submitting" && <Icon name="send" size={18} />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
