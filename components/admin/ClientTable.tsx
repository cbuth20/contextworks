'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import type { Client } from '@/types'

interface ClientTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (id: string) => void
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client? This will also delete all their documents.')) {
      setDeletingId(id)
      await onDelete(id)
      setDeletingId(null)
    }
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No clients yet. Create your first client to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.email}</TableCell>
            <TableCell>{client.full_name}</TableCell>
            <TableCell>{client.company_name || '-'}</TableCell>
            <TableCell>{format(new Date(client.created_at), 'MMM d, yyyy')}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(client)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(client.id)}
                  disabled={deletingId === client.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
