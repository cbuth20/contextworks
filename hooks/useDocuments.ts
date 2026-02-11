'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Document } from '@/types'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient() as any

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          clients:client_id (
            email,
            full_name,
            company_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getDocumentById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          clients:client_id (
            email,
            full_name,
            company_name
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const createDocument = async (document: {
    title: string
    client_id: string
    original_file_path?: string
    client_email?: string
    client_name?: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(document)
        .select()
        .single()

      if (error) throw error
      await fetchDocuments()
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchDocuments()
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchDocuments()
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const uploadFile = async (file: File, clientId: string, documentId: string) => {
    try {
      const filePath = `${clientId}/${documentId}/${file.name}`

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const getSignedUrl = async (path: string, bucket: string = 'documents') => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600) // 1 hour expiry

      if (error) throw error
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const shareDocument = async (documentId: string) => {
    try {
      const response = await fetch('/api/share-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to share document')
      }

      await fetchDocuments()
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return {
    documents,
    loading,
    error,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
    getSignedUrl,
    shareDocument,
    refetch: fetchDocuments,
  }
}
