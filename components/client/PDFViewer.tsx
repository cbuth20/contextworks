'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
  fileUrl: string
  onPageChange?: (page: number) => void
  selectedPage?: number
}

export function PDFViewer({ fileUrl, onPageChange, selectedPage }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(selectedPage || 1)
  const [loading, setLoading] = useState(true)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const goToPrevPage = () => {
    const newPage = Math.max(1, pageNumber - 1)
    setPageNumber(newPage)
    onPageChange?.(newPage)
  }

  const goToNextPage = () => {
    const newPage = Math.min(numPages, pageNumber + 1)
    setPageNumber(newPage)
    onPageChange?.(newPage)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <span className="text-sm text-gray-600">
          Page {pageNumber} of {numPages}
        </span>

        <Button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto bg-gray-50 flex justify-center p-4">
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contextworks-gold"></div>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contextworks-gold"></div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={600}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  )
}
