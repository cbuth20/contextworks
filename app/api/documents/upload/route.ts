import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const user = await requireAdmin(supabase)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const channelId = formData.get('channelId') as string
    const folderId = formData.get('folderId') as string | null

    if (!file || !channelId) {
      return NextResponse.json({ error: 'File and channelId required' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
    }

    // Create document record first to get ID
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        name: file.name,
        file_path: '', // will update after upload
        file_size: file.size,
        mime_type: file.type,
        channel_id: channelId,
        folder_id: folderId || null,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (docError) throw docError

    // Upload to storage
    const filePath = `${channelId}/${doc.id}/${file.name}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      // Clean up the doc record
      await supabase.from('documents').delete().eq('id', doc.id)
      throw uploadError
    }

    // Update document with file path
    await supabase
      .from('documents')
      .update({ file_path: filePath })
      .eq('id', doc.id)

    // Create event
    await supabase.from('document_events').insert({
      document_id: doc.id,
      event_type: 'uploaded',
      actor_email: user.email,
    })

    return NextResponse.json({ id: doc.id })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
