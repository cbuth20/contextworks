-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents', 'documents', false, 52428800, ARRAY['application/pdf']),
  ('signed-documents', 'signed-documents', false, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- DOCUMENTS BUCKET POLICIES

-- Admin can upload to documents bucket
CREATE POLICY "Admin can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- Admin can view all documents
CREATE POLICY "Admin can view all documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- Admin can delete documents
CREATE POLICY "Admin can delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- Clients can view their own documents
CREATE POLICY "Clients can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1]::uuid = (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  );

-- SIGNED-DOCUMENTS BUCKET POLICIES

-- Admin can upload signed documents (from webhooks)
CREATE POLICY "Admin can upload signed documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'signed-documents'
    AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- Admin can view all signed documents
CREATE POLICY "Admin can view all signed documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'signed-documents'
    AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- Admin can delete signed documents
CREATE POLICY "Admin can delete signed documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'signed-documents'
    AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- Clients can view their own signed documents
CREATE POLICY "Clients can view own signed documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'signed-documents'
    AND (storage.foldername(name))[1]::uuid = (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Service role can do everything (for webhooks)
-- This is automatic with Supabase service_role key
