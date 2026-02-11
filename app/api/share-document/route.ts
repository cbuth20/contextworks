import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateShareToken, getShareUrl, getTokenExpiry } from '@/lib/tokens'

export async function POST(request: Request) {
  try {
    const { documentId, resend } = await request.json()

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId is required' },
        { status: 400 }
      )
    }

    const supabaseClient = await createClient()
    const supabase = supabaseClient as any

    // Verify admin auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // For resend, reuse existing token or generate new one
    let token = document.share_token
    let expiresAt = document.share_token_expires_at

    if (!token || resend) {
      token = token || generateShareToken()
      expiresAt = getTokenExpiry()
    }

    // Update document
    const updates: any = {
      share_token: token,
      share_token_expires_at: expiresAt,
      shared_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Only change status from draft to sent
    if (document.status === 'draft') {
      updates.status = 'sent'
      updates.sent_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update document' },
        { status: 500 }
      )
    }

    // Log event
    await supabase.from('document_events').insert({
      document_id: documentId,
      event_type: resend ? 'document_resent' : 'document_shared',
      payload_json: {
        shared_at: new Date().toISOString(),
        client_email: document.client_email,
      },
    })

    const shareUrl = getShareUrl(token)

    // Send email if resend lib is available
    try {
      const { sendSigningEmail } = await import('@/lib/email')
      await sendSigningEmail({
        to: document.client_email,
        clientName: document.client_name || 'Client',
        documentTitle: document.title,
        shareUrl,
      })
    } catch (emailError) {
      // Email sending is optional - don't fail the request
      console.warn('Email sending not configured or failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      shareUrl,
      token,
    })
  } catch (error: any) {
    console.error('Error sharing document:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
