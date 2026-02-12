import { createServiceRoleClient } from '@/lib/supabase/server'
import { signPdf } from '@/lib/pdf/signer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token, signerName, signerEmail, signatureDataUrl } = await request.json()

    if (!token || !signerName || !signerEmail || !signatureDataUrl) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Get document
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('share_token', token)
      .single()

    if (docError || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (doc.status === 'signed') {
      return NextResponse.json({ error: 'Document already signed' }, { status: 400 })
    }

    if (doc.share_token_expires_at && new Date(doc.share_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Link has expired' }, { status: 410 })
    }

    // Download original PDF
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(doc.file_path)

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'Could not download PDF' }, { status: 500 })
    }

    // Convert signature data URL to bytes
    const signatureBase64 = signatureDataUrl.split(',')[1]
    const signatureBytes = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0))

    // Sign the PDF
    const pdfBytes = new Uint8Array(await fileData.arrayBuffer())
    const signedPdfBytes = await signPdf({
      pdfBytes,
      signatureImageBytes: signatureBytes,
      signerName,
      signerEmail,
    })

    // Upload signed PDF
    const signedPath = `${doc.channel_id}/${doc.id}/signed_${doc.name}`
    const { error: uploadError } = await supabase.storage
      .from('signed-documents')
      .upload(signedPath, signedPdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Update document
    await supabase
      .from('documents')
      .update({
        status: 'signed',
        signed_at: new Date().toISOString(),
        signed_file_path: signedPath,
        signer_name: signerName,
        signer_email: signerEmail,
      })
      .eq('id', doc.id)

    // Record event
    await supabase.from('document_events').insert({
      document_id: doc.id,
      event_type: 'signed',
      actor_email: signerEmail,
      metadata: { signer_name: signerName },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
