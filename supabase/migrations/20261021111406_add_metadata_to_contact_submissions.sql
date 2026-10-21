/*
# Add metadata column to contact_submissions

1. Modified Tables
- `contact_submissions`
  - Add `metadata` (jsonb, nullable) — almacena datos auxiliares como la IP del remitente para rate limiting.

2. Security
- Sin cambios en RLS. La columna es escribible solo desde el service role (INSERT desde la edge function).
- La política INSERT existente permite a anon insertar filas, pero la edge function usa service role key.

3. Notas
- La columna `metadata` se usa para almacenar la IP del cliente y aplicar rate limiting por IP en la edge function.
- No es un dato sensible que requiera políticas adicionales.
*/

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS metadata jsonb;
