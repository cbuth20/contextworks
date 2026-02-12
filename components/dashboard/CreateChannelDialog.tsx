'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { Client } from '@/types'

interface CreateChannelDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateChannelDialog({ open, onClose, onCreated }: CreateChannelDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [showNewClient, setShowNewClient] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientCompany, setNewClientCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      supabase.from('clients').select('*').order('name').then(({ data }) => {
        setClients((data as Client[]) || [])
      })
    }
  }, [open, supabase])

  const reset = () => {
    setName('')
    setDescription('')
    setClientId('')
    setShowNewClient(false)
    setNewClientName('')
    setNewClientEmail('')
    setNewClientCompany('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalClientId = clientId || null

      if (showNewClient && newClientName) {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({ name: newClientName, email: newClientEmail || null, company: newClientCompany || null })
          .select()
          .single()

        if (clientError) throw clientError
        finalClientId = newClient.id
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('channels').insert({
        name,
        description: description || null,
        client_id: finalClientId,
        created_by: user.id,
      })

      if (error) throw error

      toast.success('Channel created')
      reset()
      onClose()
      onCreated()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Channel</DialogTitle>
            <DialogDescription>Add a new workspace for a client.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="channel-name">Name</Label>
              <Input
                id="channel-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Acme Corp - Q1 Strategy"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel-desc">Description</Label>
              <Textarea
                id="channel-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Client (optional)</Label>
              {!showNewClient ? (
                <div className="space-y-2">
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} {c.company ? `(${c.company})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => setShowNewClient(true)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + Create new client
                  </button>
                </div>
              ) : (
                <div className="space-y-3 p-3 rounded-md border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">New Client</span>
                    <button
                      type="button"
                      onClick={() => setShowNewClient(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                  <Input value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Client name" />
                  <Input type="email" value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} placeholder="Email" />
                  <Input value={newClientCompany} onChange={(e) => setNewClientCompany(e.target.value)} placeholder="Company" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name}>
              {loading ? 'Creating...' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
