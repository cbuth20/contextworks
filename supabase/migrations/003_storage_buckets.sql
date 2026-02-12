-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents', 'documents', false, 52428800, ARRAY['application/pdf']),
  ('signed-documents', 'signed-documents', false, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Drop old storage policies if they exist
DROP POLICY IF EXISTS "Admins can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view signed documents" ON storage.objects;
DROP POLICY IF EXISTS "Service role handles signed uploads" ON storage.objects;

-- Storage policies for documents bucket
CREATE POLICY "Admins can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND is_admin());

CREATE POLICY "Admins can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND is_admin());

CREATE POLICY "Admins can delete documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND is_admin());

-- Storage policies for signed-documents bucket
CREATE POLICY "Admins can view signed documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'signed-documents' AND is_admin());

CREATE POLICY "Service role handles signed uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'signed-documents');
