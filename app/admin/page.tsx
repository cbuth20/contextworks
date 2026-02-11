'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, CheckCircle } from 'lucide-react'
import { useDocuments } from '@/hooks/useDocuments'
import { useClients } from '@/hooks/useClients'

export default function AdminDashboard() {
  const { documents } = useDocuments()
  const { clients } = useClients()

  const signedCount = documents.filter(d => d.status === 'signed').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-contextworks-black mb-2">
          Dashboard
        </h1>
        <p className="text-contextworks-silver-muted">
          Welcome back to ContextWorks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-contextworks-gold/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-contextworks-silver-muted">Total Clients</CardTitle>
            <Users className="h-5 w-5 text-contextworks-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-contextworks-black">{clients.length}</div>
            <p className="text-xs text-contextworks-silver-muted mt-1">
              Manage clients in the Clients section
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-contextworks-gold/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-contextworks-silver-muted">
              Total Documents
            </CardTitle>
            <FileText className="h-5 w-5 text-contextworks-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-contextworks-black">{documents.length}</div>
            <p className="text-xs text-contextworks-silver-muted mt-1">
              Upload documents to get started
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-contextworks-gold/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-contextworks-silver-muted">Signed Documents</CardTitle>
            <CheckCircle className="h-5 w-5 text-contextworks-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-contextworks-black">{signedCount}</div>
            <p className="text-xs text-contextworks-silver-muted mt-1">
              Documents completed by clients
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Welcome to ContextWorks Client Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-contextworks-silver-muted">
            Get started by creating clients and uploading documents for signature.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
