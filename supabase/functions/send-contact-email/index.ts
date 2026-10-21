/**
 * Edge Function: send-contact-email
 *
 * Recibe los datos del formulario de contacto, los valida, guarda la consulta
 * en la tabla `contact_submissions` e intenta enviar un email de notificación
 * al destinatario comercial usando Resend (https://resend.com).
 *
 * Variables de entorno necesarias (configuradas en Supabase, no en .env del frontend):
 * - RESEND_API_KEY       — API key de Resend
 * - CONTACT_RECIPIENT    — correo destino (noderaservicios@gmail.com)
 * - CONTACT_FROM_EMAIL   — correo remitente verificado en Resend
 *
 * Si falta alguna variable, la consulta se guarda igualmente en la base de datos
 * (status = 'pending'), pero el email no se envía. El propietario puede revisar
 * las consultas desde el panel de Supabase.
 *
 * Para activar el envío de emails:
 * 1. Crear una cuenta en Resend.
 * 2. Verificar un dominio o usar el remitente de prueba onboarding@resend.dev.
 * 3. Configurar los secrets en Supabase: RESEND_API_KEY, CONTACT_RECIPIENT, CONTACT_FROM_EMAIL.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  consent: boolean;
  // Honeypot anti-spam — debe estar vacío
  website?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(text: string): string {
  // Eliminar caracteres de control y saltos de línea que podrían inyectar cabeceras
  return text.replace(/[\r\n]/g, " ").trim().slice(0, 5000);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método no permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body: ContactPayload = await req.json();

    // Honeypot: si el campo website tiene contenido, es un bot
    if (body.website && body.website.trim().length > 0) {
      // Responder OK para no delatar el honeypot
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validación server-side
    if (!body.name || body.name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "El nombre es obligatorio" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!body.email || !validateEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: "El correo no es válido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!body.message || body.message.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "El mensaje es muy corto" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!body.consent) {
      return new Response(
        JSON.stringify({ error: "Debés aceptar el aviso de privacidad" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const company = body.company ? sanitize(body.company) : null;
    const service = body.service ? sanitize(body.service) : null;
    const message = sanitize(body.message);

    // Guardar en la base de datos usando service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Error de configuración del servidor" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insertar la consulta en la base de datos
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        name,
        email,
        company,
        service,
        message,
        consent: true,
        status: "pending",
      }),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error("Error guardando consulta:", errText);
      return new Response(
        JSON.stringify({ error: "No pudimos guardar tu consulta. Intentá de nuevo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Intentar enviar email por Resend si está configurado
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipient = Deno.env.get("CONTACT_RECIPIENT") ?? "noderaservicios@gmail.com";
    const fromEmail = Deno.env.get("CONTACT_FROM_EMAIL");

    let emailSent = false;
    let emailError: string | null = null;

    if (resendApiKey && fromEmail) {
      try {
        const emailHtml = `
          <h2>Nueva consulta desde el sitio web de NODERA</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
          ${company ? `<p><strong>Empresa:</strong> ${escapeHtml(company)}</p>` : ""}
          ${service ? `<p><strong>Servicio de interés:</strong> ${escapeHtml(service)}</p>` : ""}
          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          <hr>
          <p style="color:#999;font-size:12px">Consulta recibida el ${new Date().toLocaleString("es-AR")}</p>
        `;

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [recipient],
            subject: `Nueva consulta web — ${name}`,
            html: emailHtml,
            reply_to: email,
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
          // Actualizar estado a 'sent'
          await fetch(`${supabaseUrl}/rest/v1/contact_submissions?id=eq.${(await insertRes.json())[0]?.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "apikey": serviceRoleKey,
              "Authorization": `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify({ status: "sent" }),
          });
        } else {
          const errBody = await resendRes.text();
          emailError = errBody;
          console.error("Error enviando email:", errBody);
        }
      } catch (err) {
        emailError = String(err);
        console.error("Excepción enviando email:", err);
      }
    } else {
      emailError = "Resend no configurado";
    }

    // Responder éxito al frontend si la consulta se guardó, aunque el email no se haya enviado
    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        message: emailSent
          ? "Tu consulta fue enviada. Te respondemos a la brevedad."
          : "Tu consulta fue recibida. Te respondemos a la brevedad.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error en send-contact-email:", err);
    return new Response(
      JSON.stringify({ error: "Ocurrió un error inesperado. Intentá de nuevo." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
