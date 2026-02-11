export type DocumentStatus = "draft" | "sent" | "viewed" | "signed" | "archived"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin'
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  email: string
  full_name: string
  company_name?: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  title: string
  client_id: string
  status: DocumentStatus
  original_file_path?: string
  signed_file_path?: string
  dropbox_sign_request_id?: string
  signing_url?: string
  share_token?: string
  share_token_expires_at?: string
  shared_at?: string
  client_email?: string
  client_name?: string
  sent_at?: string
  viewed_at?: string
  signed_at?: string
  archived_at?: string
  created_at: string
  updated_at: string
}

export interface DocumentEvent {
  id: string
  document_id: string
  event_type: string
  payload_json: Record<string, any>
  created_at: string
}
