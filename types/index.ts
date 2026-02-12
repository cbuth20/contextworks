export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'user'
  created_at: string
}

export interface Client {
  id: string
  name: string
  email: string | null
  company: string | null
  phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Channel {
  id: string
  name: string
  description: string | null
  client_id: string | null
  created_by: string
  created_at: string
  updated_at: string
  client?: Client | null
}

export interface Folder {
  id: string
  name: string
  channel_id: string
  parent_id: string | null
  created_at: string
}

export type DocumentStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'expired'

export interface Document {
  id: string
  name: string
  file_path: string
  file_size: number
  mime_type: string
  channel_id: string
  folder_id: string | null
  status: DocumentStatus
  share_token: string | null
  share_token_expires_at: string | null
  shared_at: string | null
  signed_at: string | null
  signed_file_path: string | null
  signer_name: string | null
  signer_email: string | null
  uploaded_by: string
  created_at: string
  updated_at: string
  channel?: Channel
  folder?: Folder
}

export interface DocumentEvent {
  id: string
  document_id: string
  event_type: 'uploaded' | 'shared' | 'viewed' | 'signed' | 'expired' | 'downloaded'
  actor_email: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}
