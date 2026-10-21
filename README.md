# NODERA — Portfolio Web

Sitio web profesional de NODERA, diseñado para presentar servicios de diseño web, imagen de marca y marketing digital, y captar consultas de potenciales clientes.

## Tecnologías

- **Vite + React + TypeScript** — frontend
- **Supabase** — base de datos para guardar consultas de contacto + Edge Function para envío de emails
- **CSS personalizado** — sistema de tokens de diseño, sin frameworks de estilos
- **Iconos SVG propios** — sin dependencias externas de iconos

## Estructura del proyecto

```
project/
├── public/
│   ├── nodera-wordmark.svg        ← Logo NODERA (versión oscura)
│   ├── nodera-wordmark-light.svg  ← Logo NODERA (versión clara)
│   ├── favicon.svg                ← Favicon
│   ├── robots.txt                 ← Configuración para buscadores
│   └── sitemap.xml                ← Sitemap
├── src/
│   ├── siteConfig.ts              ← ⭐ DATOS EDITABLES (textos, servicios, contacto, etc.)
│   ├── styles/global.css          ← Tokens de diseño y estilos globales
│   ├── components/                ← Componentes reutilizables (Button, Icon, Logo, etc.)
│   ├── sections/                  ← Secciones de la página (Hero, Services, Contact, etc.)
│   ├── hooks/                     ← Hooks personalizados
│   ├── App.tsx                    ← Componente principal
│   └── main.tsx                   ← Punto de entrada
├── supabase/
│   ├── config.toml                ← Configuración de Edge Functions
│   └── functions/
│       └── send-contact-email/    ← Función serverless para el formulario
├── index.html                     ← HTML base con metadatos SEO
└── .env                           ← Variables de entorno (no subirlas al repo)
```

## Cómo editar los contenidos

### Textos, servicios, contacto y preguntas frecuentes

**Todo el contenido editable está centralizado en `src/siteConfig.ts`.**

En ese archivo encontrás:

- `site` — nombre, eslogan, descripción SEO, URL, mercado
- `contact` — correo, teléfono, WhatsApp, redes sociales
- `nav` — enlaces de navegación
- `hero` — título, texto y botones de la sección principal
- `about` — textos de presentación
- `services` — lista de servicios con sus características
- `methodology` — pasos del proceso de trabajo
- `projects` — array de proyectos del portfolio
- `differentials` — lista de diferenciales
- `faqs` — preguntas frecuentes
- `footer` — descripción del pie de página

### Cómo cambiar el logo

1. Reemplazá el archivo `public/nodera-wordmark.svg` por el logo original (versión para fondos claros).
2. Reemplazá `public/nodera-wordmark-light.svg` por el logo en versión clara (para fondos oscuros).
3. Conservá el formato SVG si es posible. Si usás PNG/WebP, cambiá la extensión en `src/components/Logo.tsx`.
4. El favicon está en `public/favicon.svg`. Reemplazalo también si querés actualizarlo.

### Cómo cambiar colores y tipografía

Los tokens de diseño están en `src/styles/global.css`, al principio del archivo, bajo `:root`.

- `--c-bg`, `--c-ink`, `--c-accent` — colores principales
- `--font-sans`, `--font-display` — tipografías
- `--sp-*` — escala de espaciado (sistema de 8px)

### Cómo agregar imágenes

1. Colocá las imágenes en `public/` o en subcarpetas dentro de `public/`.
2. Referencialas desde el código con rutas absolutas: `/mi-imagen.jpg`.
3. Para imágenes del portfolio, creá una carpeta `public/projects/<id>/`.
4. Usá formatos optimizados (WebP, AVIF) y dimensiones apropiadas.
5. Siempre incluí atributo `alt` descriptivo en las imágenes.

### Cómo agregar un proyecto al portfolio

En `src/siteConfig.ts`, agregá un objeto al array `projects`:

```typescript
{
  id: "mi-proyecto",
  name: "Nombre del proyecto",
  client: "Nombre del cliente",         // opcional, solo si está autorizado
  category: "Diseño web",
  description: "Breve descripción del trabajo realizado.",
  coverImage: "/projects/mi-proyecto/cover.jpg",
  liveUrl: "https://ejemplo.com",       // opcional
  technologies: ["React", "Supabase"],  // opcional
  type: "real",                         // "real" o "conceptual"
  published: true,
}
```

Colocá la imagen de portada en `public/projects/mi-proyecto/cover.jpg`.

Si el proyecto es conceptual (demostración), usá `type: "conceptual"` para que se identifique claramente.

### Cómo actualizar los datos de contacto

En `src/siteConfig.ts`, modificá el objeto `contact`:

- `email` — correo comercial
- `phone` — número con prefijo internacional (sin espacios ni guiones)
- `phoneDisplay` — número formateado para mostrar
- `whatsappUrl` — enlace de WhatsApp (solo si el número tiene WhatsApp activo)
- `social.instagram`, `social.linkedin`, `social.facebook` — URLs completas. Dejá vacío `""` si no están confirmadas.

## Formulario de contacto

El formulario guarda las consultas en una tabla `contact_submissions` de Supabase e intenta enviar una notificación por correo usando **Resend** (proveedor de email transaccional).

### Estado actual

- ✅ Interfaz del formulario con validación
- ✅ Guardado en base de datos (Supabase) — funcional
- ✅ Edge Function desplegada
- ⚠️ Envío de email por Resend — requiere configurar secrets en Supabase

### Cómo activar el envío de emails

1. Crear una cuenta en [Resend](https://resend.com).
2. Obtener la API key.
3. Verificar un dominio en Resend, o usar `onboarding@resend.dev` como remitente de prueba.
4. Configurar los siguientes secrets en Supabase (Edge Functions → Secrets):
   - `RESEND_API_KEY` — tu API key de Resend
   - `CONTACT_RECIPIENT` — `noderaservicios@gmail.com`
   - `CONTACT_FROM_EMAIL` — el correo remitente verificado en Resend
5. Sin estos secrets, las consultas se guardan igualmente en la base de datos y pueden revisarse desde el panel de Supabase.

### Revisar las consultas recibidas

Desde el panel de Supabase → Table Editor → `contact_submissions`, podés ver todas las consultas con su estado (`pending` = pendiente de envío de email, `sent` = email enviado).

## Introducción animada

Al entrar por primera vez en una sesión del navegador, se muestra una pantalla de presentación con el logo de NODERA. Esta animación:

- Se muestra una sola vez por sesión (usa `sessionStorage`).
- Dura aproximadamente 1.6 segundos.
- Puede omitirse con el botón "Entrar al sitio".
- Respeta `prefers-reduced-motion` (sin animación para usuarios que la tienen activada).

## SEO

- Títulos y meta descripciones en `index.html`.
- Open Graph configurado para compartir en redes.
- `robots.txt` y `sitemap.xml` en `public/`.
- Canonical configurable: cambiá la URL en `index.html` (línea con `data-canonical`) y en `src/siteConfig.ts` (`site.url`) al conectar el dominio propio.

## Conectar el dominio propio

Cuando tengas un dominio comprado:

1. En el panel de Bolt, conectá el dominio a tu proyecto.
2. Actualizá `site.url` en `src/siteConfig.ts` con la URL definitiva.
3. Actualizá la URL canonical en `index.html`.
4. Actualizá `public/robots.txt` y `public/sitemap.xml` con el dominio definitivo.
5. Si activás envío de emails, verificá el dominio en Resend para usarlo como remitente.

## Comandos

```bash
npm install      # Instalar dependencias
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Previsualizar la versión compilada
```
