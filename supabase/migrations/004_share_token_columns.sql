-- Add columns to documents table for token-based sharing
ALTER TABLE documents ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS share_token_expires_at TIMESTAMPTZ;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS shared_at TIMESTAMPTZ;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS client_email TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS client_name TEXT;

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_documents_share_token ON documents(share_token) WHERE share_token IS NOT NULL;

-- Allow public read access via share_token (for /sign/[token] page)
CREATE POLICY "Public can read documents by share_token"
  ON documents FOR SELECT
  USING (share_token IS NOT NULL);
