/*
# Create contact_submissions table (single-tenant, no auth)

1. New Tables
- `contact_submissions`
  - `id` (uuid, primary key)
  - `name` (text, not null) — nombre del remitente
  - `email` (text, not null) — correo del remitente
  - `company` (text, nullable) — empresa, opcional
  - `service` (text, nullable) — servicio de interés
  - `message` (text, not null) — mensaje de la consulta
  - `consent` (boolean, not null) — consentimiento de privacidad
  - `status` (text, default 'pending') — estado del envío
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `contact_submissions`.
- Allow anon + authenticated INSERT only (los visitantes envían consultas sin login).
- No SELECT/UPDATE/DELETE desde el anon key: solo el panel de Supabase (service role) puede leer y gestionar las consultas.

3. Notas
- La tabla almacena las consultas para que NODERA pueda revisarlas desde el panel de Supabase incluso si el envío por correo falla.
- El estado `status` permite trackear si el email se envió correctamente.
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  service text,
  message text NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Solo permitir INSERT desde anon (visitantes sin login)
DROP POLICY IF EXISTS "anon_insert_contact" ON contact_submissions;
CREATE POLICY "anon_insert_contact"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No permitir SELECT/UPDATE/DELETE desde anon ni authenticated.
-- Las consultas se gestionan desde el panel de Supabase con service role.

-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions (created_at DESC);
