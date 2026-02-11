'use client'

import { useState, useEffect } from 'react'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import type { Client } from '@/types'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient() as any

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single()

      if (error) throw error
      await fetchClients()
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const findOrCreateClient = async (email: string, name: string) => {
    try {
      // Check if client exists
      const { data: existing } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single()

      if (existing) {
        return { data: existing, error: null }
      }

      // Create new client
      const { data, error } = await supabase
        .from('clients')
        .insert({ email, full_name: name })
        .select()
        .single()

      if (error) throw error
      await fetchClients()
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchClients()
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchClients()
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    loading,
    error,
    createClient,
    findOrCreateClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  }
}
