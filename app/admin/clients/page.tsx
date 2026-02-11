'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientForm } from '@/components/admin/ClientForm'
import { ClientTable } from '@/components/admin/ClientTable'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useClients } from '@/hooks/useClients'
import { Plus } from 'lucide-react'
import type { Client } from '@/types'

export default function ClientsPage() {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const handleCreate = async (data: any) => {
    const result = await createClient(data)
    if (!result.error) {
      setIsFormOpen(false)
    }
    return result
  }

  const handleUpdate = async (data: any) => {
    if (!editingClient) return { error: 'No client selected' }
    const result = await updateClient(editingClient.id, data)
    if (!result.error) {
      setEditingClient(null)
    }
    return result
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
  }

  const handleDelete = async (id: string) => {
    await deleteClient(id)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-contextworks-black mb-2">Clients</h1>
          <p className="text-contextworks-silver-muted">Manage client accounts and access</p>
        </div>
        <Button variant="gold" size="lg" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Add Client
        </Button>
      </div>

      {(isFormOpen || editingClient) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingClient ? 'Edit Client' : 'Create New Client'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientForm
              client={editingClient || undefined}
              onSubmit={editingClient ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingClient(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientTable
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}
