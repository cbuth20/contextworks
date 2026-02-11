'use client'

import { useCallback, useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  accept?: string
  maxSize?: number // in bytes
  onFileSelect: (file: File | null) => void
  selectedFile?: File | null
  disabled?: boolean
}

export function FileUpload({
  accept = '.pdf',
  maxSize = 52428800, // 50MB default
  onFileSelect,
  selectedFile,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      const acceptedTypes = accept.split(',').map((t) => t.trim())
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
      const isValidType = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension === type
        }
        return file.type.match(type)
      })

      if (!isValidType) {
        return `Invalid file type. Please upload a ${accept} file.`
      }

      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / 1048576)
        return `File size exceeds ${maxSizeMB}MB limit.`
      }

      return null
    },
    [accept, maxSize]
  )

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        onFileSelect(null)
        return
      }

      setError(null)
      onFileSelect(file)
    },
    [validateFile, onFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [disabled, handleFile]
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    setError(null)
    onFileSelect(null)
  }, [onFileSelect])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-3">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all',
            isDragging
              ? 'border-contextworks-gold bg-contextworks-gold/5'
              : 'border-contextworks-steel bg-white hover:border-contextworks-gold/50 hover:bg-gray-50',
            disabled && 'opacity-50 cursor-not-allowed',
            'p-8'
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <Upload className={cn(
            'h-12 w-12 mb-4',
            isDragging ? 'text-contextworks-gold' : 'text-contextworks-silver-muted'
          )} />
          <p className="text-sm font-medium text-contextworks-silver mb-1">
            {isDragging ? 'Drop file here' : 'Drag and drop file here'}
          </p>
          <p className="text-xs text-contextworks-silver-muted mb-4">
            or click to browse
          </p>
          <div className="flex items-center space-x-2 text-xs text-contextworks-silver-muted">
            <span>Accepted: {accept}</span>
            <span>•</span>
            <span>Max: {Math.round(maxSize / 1048576)}MB</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-contextworks-steel bg-white p-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-contextworks-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-contextworks-silver truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-contextworks-silver-muted">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="flex-shrink-0 ml-3 p-1 rounded hover:bg-gray-100 text-contextworks-silver-muted hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
