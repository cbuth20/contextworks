import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { generateShareToken, getShareTokenExpiry } from '@/lib/tokens'
import { sendShareEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const user = await requireAdmin(supabase)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { documentId, email } = await request.json()

    if (!documentId || !email) {
      return NextResponse.json({ error: 'documentId and email required' }, { status: 400 })
    }

    const token = generateShareToken()
    const expiresAt = getShareTokenExpiry()

    const { error: updateError } = await supabase
      .from('documents')
      .update({
        share_token: token,
        share_token_expires_at: expiresAt.toISOString(),
        shared_at: new Date().toISOString(),
        status: 'sent',
        signer_email: email,
      })
      .eq('id', documentId)

    if (updateError) throw updateError

    // Get document name
    const { data: doc } = await supabase
      .from('documents')
      .select('name')
      .eq('id', documentId)
      .single()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const shareUrl = `${appUrl}/share/${token}`

    // Record event
    await supabase.from('document_events').insert({
      document_id: documentId,
      event_type: 'shared',
      actor_email: user.email,
      metadata: { recipient: email },
    })

    // Send email
    await sendShareEmail({
      to: email,
      documentName: doc?.name || 'Document',
      shareUrl,
      senderName: user.email?.split('@')[0],
    })

    return NextResponse.json({ token, shareUrl })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
