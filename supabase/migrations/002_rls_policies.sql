-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_events ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin via JWT email (no profiles dependency)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' IN ('connor@contextworks.co', 'patrick@contextworks.co')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can read own, admins can read all
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update profiles" ON profiles FOR UPDATE USING (is_admin());

-- Clients: admin-only CRUD
DROP POLICY IF EXISTS "Admins can view clients" ON clients;
DROP POLICY IF EXISTS "Admins can create clients" ON clients;
DROP POLICY IF EXISTS "Admins can update clients" ON clients;
DROP POLICY IF EXISTS "Admins can delete clients" ON clients;
CREATE POLICY "Admins can view clients" ON clients FOR SELECT USING (is_admin());
CREATE POLICY "Admins can create clients" ON clients FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update clients" ON clients FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete clients" ON clients FOR DELETE USING (is_admin());

-- Channels: admin-only CRUD
DROP POLICY IF EXISTS "Admins can view channels" ON channels;
DROP POLICY IF EXISTS "Admins can create channels" ON channels;
DROP POLICY IF EXISTS "Admins can update channels" ON channels;
DROP POLICY IF EXISTS "Admins can delete channels" ON channels;
CREATE POLICY "Admins can view channels" ON channels FOR SELECT USING (is_admin());
CREATE POLICY "Admins can create channels" ON channels FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update channels" ON channels FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete channels" ON channels FOR DELETE USING (is_admin());

-- Folders: admin-only CRUD
DROP POLICY IF EXISTS "Admins can view folders" ON folders;
DROP POLICY IF EXISTS "Admins can create folders" ON folders;
DROP POLICY IF EXISTS "Admins can update folders" ON folders;
DROP POLICY IF EXISTS "Admins can delete folders" ON folders;
CREATE POLICY "Admins can view folders" ON folders FOR SELECT USING (is_admin());
CREATE POLICY "Admins can create folders" ON folders FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update folders" ON folders FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete folders" ON folders FOR DELETE USING (is_admin());

-- Documents: admin CRUD + public SELECT by share_token
DROP POLICY IF EXISTS "Admins can view documents" ON documents;
DROP POLICY IF EXISTS "Public can view shared documents" ON documents;
DROP POLICY IF EXISTS "Admins can create documents" ON documents;
DROP POLICY IF EXISTS "Admins can update documents" ON documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON documents;
CREATE POLICY "Admins can view documents" ON documents FOR SELECT USING (is_admin());
CREATE POLICY "Public can view shared documents" ON documents FOR SELECT USING (
  share_token IS NOT NULL
  AND (share_token_expires_at IS NULL OR share_token_expires_at > NOW())
);
CREATE POLICY "Admins can create documents" ON documents FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update documents" ON documents FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete documents" ON documents FOR DELETE USING (is_admin());

-- Document events: admin-only read + insert
DROP POLICY IF EXISTS "Admins can view events" ON document_events;
DROP POLICY IF EXISTS "Admins can create events" ON document_events;
CREATE POLICY "Admins can view events" ON document_events FOR SELECT USING (is_admin());
CREATE POLICY "Admins can create events" ON document_events FOR INSERT WITH CHECK (is_admin());
