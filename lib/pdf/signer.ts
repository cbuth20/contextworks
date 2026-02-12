import { PDFDocument, rgb } from 'pdf-lib'

interface SignPdfParams {
  pdfBytes: Uint8Array
  signatureImageBytes: Uint8Array
  signerName: string
  signerEmail: string
  pageNumber?: number
  x?: number
  y?: number
}

export async function signPdf({
  pdfBytes,
  signatureImageBytes,
  signerName,
  signerEmail,
  pageNumber = 0,
  x,
  y,
}: SignPdfParams): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  const page = pages[pageNumber] || pages[pages.length - 1]
  const { width, height } = page.getSize()

  // Embed signature image
  const signatureImage = await pdfDoc.embedPng(signatureImageBytes)
  const sigDims = signatureImage.scale(0.5)
  const sigWidth = Math.min(sigDims.width, 200)
  const sigHeight = (sigWidth / sigDims.width) * sigDims.height

  // Position: default to bottom-right area
  const sigX = x ?? width - sigWidth - 60
  const sigY = y ?? 80

  page.drawImage(signatureImage, {
    x: sigX,
    y: sigY,
    width: sigWidth,
    height: sigHeight,
  })

  // Add signature info text below
  const fontSize = 8
  page.drawText(`Signed by: ${signerName} (${signerEmail})`, {
    x: sigX,
    y: sigY - 14,
    size: fontSize,
    color: rgb(0.4, 0.4, 0.4),
  })
  page.drawText(`Date: ${new Date().toISOString().split('T')[0]}`, {
    x: sigX,
    y: sigY - 24,
    size: fontSize,
    color: rgb(0.4, 0.4, 0.4),
  })

  return pdfDoc.save()
}
