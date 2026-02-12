'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { CreateFolderDialog } from '@/components/dashboard/CreateFolderDialog'
import { UploadDocumentDialog } from '@/components/dashboard/UploadDocumentDialog'
import { formatDate, formatFileSize } from '@/lib/utils'
import Link from 'next/link'
import { Upload, FolderPlus, Folder, FileText, ArrowLeft } from 'lucide-react'
import type { Channel, Folder as FolderType, Document } from '@/types'

interface ChannelWorkspaceProps {
  channelId: string
}

export function ChannelWorkspace({ channelId }: ChannelWorkspaceProps) {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [folders, setFolders] = useState<FolderType[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const [channelRes, foldersRes, docsRes] = await Promise.all([
      supabase.from('channels').select('*, client:clients(*)').eq('id', channelId).single(),
      supabase.from('folders').select('*').eq('channel_id', channelId).order('name'),
      supabase.from('documents').select('*').eq('channel_id', channelId).order('created_at', { ascending: false }),
    ])

    setChannel(channelRes.data as Channel)
    setFolders((foldersRes.data as FolderType[]) || [])
    setDocuments((docsRes.data as Document[]) || [])
    setLoading(false)
  }, [channelId, supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!channel) return <p className="text-muted-foreground">Channel not found</p>

  const filteredDocs = currentFolder
    ? documents.filter((d) => d.folder_id === currentFolder)
    : documents.filter((d) => !d.folder_id)

  const rootFolders = folders.filter((f) => !f.parent_id)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/channels" className="hover:text-foreground transition-colors">Channels</Link>
        <span>/</span>
        <span className="text-foreground">{channel.name}</span>
        {currentFolder && (
          <>
            <span>/</span>
            <span className="text-foreground">{folders.find((f) => f.id === currentFolder)?.name}</span>
          </>
        )}
      </div>

      {channel.description && (
        <p className="text-sm text-muted-foreground">{channel.description}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4 mr-1.5" />
          Upload Document
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowNewFolder(true)}>
          <FolderPlus className="h-4 w-4 mr-1.5" />
          New Folder
        </Button>
        {currentFolder && (
          <Button variant="ghost" size="sm" onClick={() => setCurrentFolder(null)}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to root
          </Button>
        )}
      </div>

      {/* Folders */}
      {!currentFolder && rootFolders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {rootFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setCurrentFolder(folder.id)}
              className="p-4 border rounded-lg hover:bg-accent transition-colors text-left group"
            >
              <Folder className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors mb-2" />
              <p className="text-sm font-medium truncate">{folder.name}</p>
            </button>
          ))}
        </div>
      )}

      {/* Documents */}
      {filteredDocs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No documents yet. Upload one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/channels/${channelId}/documents/${doc.id}`}
                      className="text-sm hover:underline flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      {doc.name}
                    </Link>
                  </TableCell>
                  <TableCell><StatusBadge status={doc.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{formatFileSize(doc.file_size)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(doc.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <CreateFolderDialog
        open={showNewFolder}
        onClose={() => setShowNewFolder(false)}
        onCreated={loadData}
        channelId={channelId}
        parentId={currentFolder}
      />

      <UploadDocumentDialog
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={loadData}
        channelId={channelId}
        folderId={currentFolder}
      />
    </div>
  )
}
