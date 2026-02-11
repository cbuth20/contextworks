'use client'

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
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Send, Download, Eye } from 'lucide-react'
import Link from 'next/link'
import type { Document } from '@/types'

interface DocumentTableProps {
  documents: Document[]
  onSendForSignature: (document: Document) => void
  onDownload: (document: Document) => void
}

export function DocumentTable({ documents, onSendForSignature, onDownload }: DocumentTableProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-contextworks-silver-muted">
        No documents yet. Upload your first document to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document: any) => (
          <TableRow key={document.id}>
            <TableCell className="font-medium">{document.title}</TableCell>
            <TableCell>
              {document.clients?.full_name || document.client_name || 'Unknown'}
            </TableCell>
            <TableCell>
              <StatusBadge status={document.status} />
            </TableCell>
            <TableCell>{format(new Date(document.created_at), 'MMM d, yyyy')}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Link href={`/admin/documents/${document.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-contextworks-silver-muted hover:text-contextworks-gold"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>

                {document.status === 'draft' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSendForSignature(document)}
                    className="text-contextworks-silver-muted hover:text-contextworks-gold"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                )}

                {document.status === 'signed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(document)}
                    className="text-contextworks-silver-muted hover:text-contextworks-gold"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
