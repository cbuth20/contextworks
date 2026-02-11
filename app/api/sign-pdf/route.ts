import { NextResponse } from 'next/server'
import { signPDF, convertToPDFCoordinates } from '@/lib/pdf/signer'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { isTokenExpired } from '@/lib/tokens'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const pdfFile = formData.get('pdf') as File
    const signatureDataUrl = formData.get('signature') as string
    const x = parseFloat(formData.get('x') as string)
    const y = parseFloat(formData.get('y') as string)
    const page = parseInt(formData.get('page') as string)
    const token = formData.get('token') as string
    const documentId = formData.get('documentId') as string

    if (!pdfFile || !signatureDataUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use service role for token-based access
    const supabase = await createServiceRoleClient() as any

    // Validate access: either by token or documentId
    let docId = documentId

    if (token) {
      const { data: document, error } = await supabase
        .from('documents')
        .select('id, share_token_expires_at, client_id')
        .eq('share_token', token)
        .single()

      if (error || !document) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 403 }
        )
      }

      if (isTokenExpired(document.share_token_expires_at)) {
        return NextResponse.json(
          { error: 'This link has expired' },
          { status: 410 }
        )
      }

      docId = document.id
    }

    if (!docId) {
      return NextResponse.json(
        { error: 'documentId or token required' },
        { status: 400 }
      )
    }

    // Convert PDF to ArrayBuffer
    const pdfBytes = await pdfFile.arrayBuffer()

    // Convert coordinates (assuming standard page size)
    const position = convertToPDFCoordinates(x, y, 600, 800)
    position.page = page

    // Sign the PDF
    const signedPdfBytes = await signPDF(
      pdfBytes,
      signatureDataUrl,
      position
    )

    // Get document info
    const { data: document } = await supabase
      .from('documents')
      .select('client_id')
      .eq('id', docId)
      .single()

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Upload signed PDF to storage
    const signedFilePath = `${document.client_id}/${docId}/signed_${Date.now()}.pdf`

    const { error: uploadError } = await supabase.storage
      .from('signed-documents')
      .upload(signedFilePath, signedPdfBytes, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Update document status
    await supabase
      .from('documents')
      .update({
        status: 'signed',
        signed_at: new Date().toISOString(),
        signed_file_path: signedFilePath,
      })
      .eq('id', docId)

    // Log event
    await supabase.from('document_events').insert({
      document_id: docId,
      event_type: 'document_signed',
      payload_json: {
        signed_at: new Date().toISOString(),
        signature_position: { x, y, page },
      },
    })

    // Return the signed PDF
    return new NextResponse(Buffer.from(signedPdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="signed-document.pdf"',
      },
    })
  } catch (error: any) {
    console.error('Error signing PDF:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sign PDF' },
      { status: 500 }
    )
  }
}
