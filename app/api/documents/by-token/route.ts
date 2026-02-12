import { createServiceRoleClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  try {
    const { data: doc, error } = await supabase
      .from('documents')
      .select('id, name, file_path, file_size, status, share_token_expires_at, signer_name, signer_email, signed_at')
      .eq('share_token', token)
      .single()

    if (error || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check expiry
    if (doc.share_token_expires_at && new Date(doc.share_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Link has expired' }, { status: 410 })
    }

    // Get signed URL for the PDF
    const { data: signedUrl } = await supabase.storage
      .from('documents')
      .createSignedUrl(doc.file_path, 3600)

    // Record view event (only if not already signed)
    if (doc.status !== 'signed') {
      await supabase
        .from('documents')
        .update({ status: 'viewed' })
        .eq('share_token', token)
        .neq('status', 'signed')

      await supabase.from('document_events').insert({
        document_id: doc.id,
        event_type: 'viewed',
        actor_email: doc.signer_email,
      })
    }

    return NextResponse.json({
      id: doc.id,
      name: doc.name,
      fileUrl: signedUrl?.signedUrl,
      status: doc.status,
      signerName: doc.signer_name,
      signerEmail: doc.signer_email,
      signedAt: doc.signed_at,
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
