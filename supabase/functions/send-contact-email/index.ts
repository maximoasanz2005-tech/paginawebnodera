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
 * Protección anti-abuso:
 * - Honeypot (campo website oculto).
 * - Rate limiting: máximo 3 consultas por email en 1 hora, consultando la base de datos.
 * - Rate limiting por IP: máximo 5 consultas por IP en 1 hora.
 * - Sanitización de todos los campos contra inyección de cabeceras.
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
  website?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(text: string): string {
  return text.replace(/[\r\n]/g, " ").trim().slice(0, 5000);
}

function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
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
    const clientIP = sanitize(getClientIP(req));

    // Conexión a Supabase con service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Error de configuración del servidor" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminHeaders = {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    };

    // Rate limiting: verificar consultas recientes por email (máx 3 por hora)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const emailCheckUrl = `${supabaseUrl}/rest/v1/contact_submissions?select=id&email=eq.${encodeURIComponent(email)}&created_at=gte.${oneHourAgo}`;
    const emailCheckRes = await fetch(emailCheckUrl, { headers: adminHeaders });
    if (emailCheckRes.ok) {
      const recentByEmail = await emailCheckRes.json();
      if (Array.isArray(recentByEmail) && recentByEmail.length >= 3) {
        return new Response(
          JSON.stringify({ error: "Demasiadas consultas desde este correo. Esperá un rato e intentá de nuevo." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Rate limiting por IP (máx 5 por hora)
    const ipCheckUrl = `${supabaseUrl}/rest/v1/contact_submissions?select=id&metadata->>ip=eq.${encodeURIComponent(clientIP)}&created_at=gte.${oneHourAgo}`;
    const ipCheckRes = await fetch(ipCheckUrl, { headers: adminHeaders });
    if (ipCheckRes.ok) {
      const recentByIP = await ipCheckRes.json();
      if (Array.isArray(recentByIP) && recentByIP.length >= 5) {
        return new Response(
          JSON.stringify({ error: "Demasiadas consultas desde esta dirección. Esperá un rato e intentá de nuevo." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Insertar la consulta en la base de datos
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
      method: "POST",
      headers: { ...adminHeaders, "Prefer": "return=representation" },
      body: JSON.stringify({
        name,
        email,
        company,
        service,
        message,
        consent: true,
        status: "pending",
        metadata: { ip: clientIP },
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

    const insertedRows = await insertRes.json();
    const submissionId = insertedRows[0]?.id;

    // Intentar enviar email por Resend si está configurado
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipient = Deno.env.get("CONTACT_RECIPIENT") ?? "noderaservicios@gmail.com";
    const fromEmail = Deno.env.get("CONTACT_FROM_EMAIL");

    let emailSent = false;

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
          if (submissionId) {
            await fetch(`${supabaseUrl}/rest/v1/contact_submissions?id=eq.${submissionId}`, {
              method: "PATCH",
              headers: adminHeaders,
              body: JSON.stringify({ status: "sent" }),
            });
          }
        } else {
          const errBody = await resendRes.text();
          console.error("Error enviando email:", errBody);
        }
      } catch (err) {
        console.error("Excepción enviando email:", err);
      }
    } else {
      console.log("Resend no configurado — consulta guardada sin envío de email");
    }

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
