export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DocumentStatus = "draft" | "sent" | "viewed" | "signed" | "archived"

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          email: string
          full_name: string
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          client_id: string
          status: DocumentStatus
          original_file_path: string | null
          signed_file_path: string | null
          dropbox_sign_request_id: string | null
          signing_url: string | null
          share_token: string | null
          share_token_expires_at: string | null
          shared_at: string | null
          client_email: string | null
          client_name: string | null
          sent_at: string | null
          viewed_at: string | null
          signed_at: string | null
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client_id: string
          status?: DocumentStatus
          original_file_path?: string | null
          signed_file_path?: string | null
          dropbox_sign_request_id?: string | null
          signing_url?: string | null
          share_token?: string | null
          share_token_expires_at?: string | null
          shared_at?: string | null
          client_email?: string | null
          client_name?: string | null
          sent_at?: string | null
          viewed_at?: string | null
          signed_at?: string | null
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          client_id?: string
          status?: DocumentStatus
          original_file_path?: string | null
          signed_file_path?: string | null
          dropbox_sign_request_id?: string | null
          signing_url?: string | null
          share_token?: string | null
          share_token_expires_at?: string | null
          shared_at?: string | null
          client_email?: string | null
          client_name?: string | null
          sent_at?: string | null
          viewed_at?: string | null
          signed_at?: string | null
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_events: {
        Row: {
          id: string
          document_id: string
          event_type: string
          payload_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          event_type: string
          payload_json?: Json
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          event_type?: string
          payload_json?: Json
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_client_id_from_auth: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      document_status: DocumentStatus
    }
  }
}
