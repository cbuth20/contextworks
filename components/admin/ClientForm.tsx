'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Client } from '@/types'

const clientSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  company_name: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientFormProps {
  client?: Client
  onSubmit: (data: ClientFormData) => Promise<{ error: string | null }>
  onCancel: () => void
}

export function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          email: client.email,
          full_name: client.full_name,
          company_name: client.company_name || '',
        }
      : undefined,
  })

  const handleFormSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true)
    setError(null)

    const result = await onSubmit(data)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled={!!client}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input id="full_name" {...register('full_name')} />
        {errors.full_name && (
          <p className="text-sm text-red-500 mt-1">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="company_name">Company Name</Label>
        <Input id="company_name" {...register('company_name')} />
        {errors.company_name && (
          <p className="text-sm text-red-500 mt-1">{errors.company_name.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : client ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
