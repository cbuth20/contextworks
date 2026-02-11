-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the authenticated user's email matches the admin email
  -- Note: In production, this would be configured via environment variable
  -- For now, this will be checked in the application layer
  RETURN auth.jwt() ->> 'email' = current_setting('app.admin_email', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get client_id from authenticated user's email
CREATE OR REPLACE FUNCTION get_client_id_from_auth()
RETURNS UUID AS $$
DECLARE
  client_uuid UUID;
BEGIN
  SELECT id INTO client_uuid
  FROM clients
  WHERE email = auth.jwt() ->> 'email';

  RETURN client_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CLIENTS TABLE POLICIES

-- Admin can do everything with clients
CREATE POLICY "Admin can view all clients"
  ON clients FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can insert clients"
  ON clients FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update clients"
  ON clients FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin can delete clients"
  ON clients FOR DELETE
  USING (is_admin());

-- Clients can view their own record
CREATE POLICY "Clients can view own record"
  ON clients FOR SELECT
  USING (email = auth.jwt() ->> 'email');

-- DOCUMENTS TABLE POLICIES

-- Admin can do everything with documents
CREATE POLICY "Admin can view all documents"
  ON documents FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can insert documents"
  ON documents FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update documents"
  ON documents FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin can delete documents"
  ON documents FOR DELETE
  USING (is_admin());

-- Clients can view their own documents
CREATE POLICY "Clients can view own documents"
  ON documents FOR SELECT
  USING (client_id = get_client_id_from_auth());

-- DOCUMENT_EVENTS TABLE POLICIES

-- Admin can view all events
CREATE POLICY "Admin can view all events"
  ON document_events FOR SELECT
  USING (is_admin());

-- Admin can insert events
CREATE POLICY "Admin can insert events"
  ON document_events FOR INSERT
  WITH CHECK (is_admin());

-- Clients can view events for their documents
CREATE POLICY "Clients can view own document events"
  ON document_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_events.document_id
      AND documents.client_id = get_client_id_from_auth()
    )
  );

-- Service role bypasses RLS (for webhooks)
-- This is automatic with Supabase service_role key
