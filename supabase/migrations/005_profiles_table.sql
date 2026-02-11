-- Create profiles table linked to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Admins can read all profiles
CREATE POLICY "Admins can read profiles"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create trigger: when a new auth.users row is inserted, create a profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Replace is_admin() to check the profiles table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old client-specific policies that no longer apply
-- (clients use token-based access now, not Supabase auth)
DROP POLICY IF EXISTS "Clients can view own record" ON clients;
DROP POLICY IF EXISTS "Clients can view own documents" ON documents;
DROP POLICY IF EXISTS "Clients can view own document events" ON document_events;
DROP POLICY IF EXISTS "Clients can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Clients can view own signed documents" ON storage.objects;

-- Drop the now-unused function
DROP FUNCTION IF EXISTS get_client_id_from_auth();

-- Fix storage policies to use is_admin() instead of broken current_setting()
DROP POLICY IF EXISTS "Admin can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can view all documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload signed documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can view all signed documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete signed documents" ON storage.objects;

CREATE POLICY "Admin can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND is_admin());

CREATE POLICY "Admin can view all documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND is_admin());

CREATE POLICY "Admin can delete documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND is_admin());

CREATE POLICY "Admin can upload signed documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'signed-documents' AND is_admin());

CREATE POLICY "Admin can view all signed documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'signed-documents' AND is_admin());

CREATE POLICY "Admin can delete signed documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'signed-documents' AND is_admin());

-- Insert profiles for any existing auth users (idempotent)
INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, COALESCE(raw_user_meta_data ->> 'full_name', '')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
