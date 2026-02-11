import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { isTokenExpired } from '@/lib/tokens'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Use service role client for public access (no auth needed)
    const supabase = await createServiceRoleClient() as any

    // Find document by token
    const { data: document, error } = await supabase
      .from('documents')
      .select('id, title, status, original_file_path, signed_file_path, share_token_expires_at, client_name, client_email')
      .eq('share_token', token)
      .single()

    if (error || !document) {
      return NextResponse.json(
        { error: 'Invalid or expired link' },
        { status: 404 }
      )
    }

    // Check expiry
    if (isTokenExpired(document.share_token_expires_at)) {
      return NextResponse.json(
        { error: 'This link has expired. Please contact the sender for a new link.' },
        { status: 410 }
      )
    }

    // On first access, update status to 'viewed'
    if (document.status === 'sent') {
      await supabase
        .from('documents')
        .update({
          status: 'viewed',
          viewed_at: new Date().toISOString(),
        })
        .eq('id', document.id)

      await supabase.from('document_events').insert({
        document_id: document.id,
        event_type: 'document_viewed',
        payload_json: {
          viewed_at: new Date().toISOString(),
        },
      })

      document.status = 'viewed'
    }

    // Generate signed URL for the PDF
    let pdfUrl = null
    if (document.original_file_path) {
      const { data: urlData } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.original_file_path, 3600)

      pdfUrl = urlData?.signedUrl || null
    }

    // Generate signed URL for signed PDF if available
    let signedPdfUrl = null
    if (document.signed_file_path) {
      const { data: urlData } = await supabase.storage
        .from('signed-documents')
        .createSignedUrl(document.signed_file_path, 3600)

      signedPdfUrl = urlData?.signedUrl || null
    }

    return NextResponse.json({
      id: document.id,
      title: document.title,
      status: document.status,
      clientName: document.client_name,
      pdfUrl,
      signedPdfUrl,
    })
  } catch (error: any) {
    console.error('Error fetching document by token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
