import { PDFDocument } from 'pdf-lib'

interface SignaturePosition {
  x: number
  y: number
  width: number
  height: number
  page: number
}

/**
 * Adds a signature image to a PDF document
 */
export async function signPDF(
  pdfBytes: ArrayBuffer,
  signatureDataUrl: string,
  position: SignaturePosition
): Promise<Uint8Array> {
  try {
    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes)

    // Convert data URL to bytes
    const signatureImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer())

    // Embed the signature image
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes)

    // Get the page
    const pages = pdfDoc.getPages()
    const page = pages[position.page - 1]

    if (!page) {
      throw new Error('Invalid page number')
    }

    // Draw the signature on the page
    page.drawImage(signatureImage, {
      x: position.x,
      y: position.y,
      width: position.width,
      height: position.height,
    })

    // Save the PDF
    const signedPdfBytes = await pdfDoc.save()
    return signedPdfBytes
  } catch (error) {
    console.error('Error signing PDF:', error)
    throw error
  }
}

/**
 * Helper to convert signature position from screen coordinates to PDF coordinates
 */
export function convertToPDFCoordinates(
  clickX: number,
  clickY: number,
  pageWidth: number,
  pageHeight: number,
  signatureWidth: number = 150,
  signatureHeight: number = 50
): SignaturePosition {
  // PDF coordinates start from bottom-left, screen coordinates from top-left
  return {
    x: clickX,
    y: pageHeight - clickY - signatureHeight, // Flip Y coordinate
    width: signatureWidth,
    height: signatureHeight,
    page: 1, // This will be set by the caller
  }
}
