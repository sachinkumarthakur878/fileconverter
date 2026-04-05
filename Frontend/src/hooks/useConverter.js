import { useState, useCallback } from 'react'
import { fileAPI } from '../api'
import toast from 'react-hot-toast'

export const CONVERSION_TYPES = {
  TO_PDF: 'to-pdf',
  TO_WORD: 'to-word',
}

// What conversions does each file type support?
export const SUPPORTED_CONVERSIONS = {
  '.txt':  [CONVERSION_TYPES.TO_PDF, CONVERSION_TYPES.TO_WORD],
  '.docx': [CONVERSION_TYPES.TO_PDF],
  '.doc':  [CONVERSION_TYPES.TO_PDF],
  '.pdf':  [CONVERSION_TYPES.TO_WORD],
}

export const ALLOWED_EXTENSIONS = ['.txt', '.docx', '.doc', '.pdf']

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/html',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

export function useConverter() {
  const [file, setFile] = useState(null)
  const [conversionType, setConversionType] = useState(CONVERSION_TYPES.TO_PDF)
  const [status, setStatus] = useState('idle') // idle | uploading | converting | done | error
  const [progress, setProgress] = useState(0)
  const [resultFilename, setResultFilename] = useState('')
  const [error, setError] = useState('')

  const getExt = (f) => {
    if (!f) return ''
    return '.' + f.name.split('.').pop().toLowerCase()
  }

  const selectFile = useCallback((f) => {
    setFile(f)
    setStatus('idle')
    setProgress(0)
    setResultFilename('')
    setError('')
    // Auto-set default conversion type
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    const supported = SUPPORTED_CONVERSIONS[ext] || []
    if (supported.length > 0) setConversionType(supported[0])
  }, [])

  const reset = useCallback(() => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setResultFilename('')
    setError('')
  }, [])

  const convert = useCallback(async () => {
    if (!file) return
    setStatus('uploading')
    setProgress(0)
    setError('')

    try {
      let response
      const onProgress = (p) => {
        setProgress(p)
        if (p === 100) setStatus('converting')
      }

      if (conversionType === CONVERSION_TYPES.TO_PDF) {
        response = await fileAPI.convertToPDF(file, onProgress)
      } else {
        response = await fileAPI.convertToWord(file, onProgress)
      }

      // response.data is a Blob
      const ext = conversionType === CONVERSION_TYPES.TO_PDF ? '.pdf' : '.docx'
      const baseName = file.name.replace(/\.[^.]+$/, '')
      const filename = `${baseName}-converted${ext}`

      // Trigger browser download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setResultFilename(filename)
      setStatus('done')
      toast.success(`Converted successfully!`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Conversion failed. Please try again.'
      setError(msg)
      setStatus('error')
      toast.error(msg)
    }
  }, [file, conversionType])

  const supportedConversions = SUPPORTED_CONVERSIONS[getExt(file)] || []
  const isSupported = supportedConversions.length > 0

  return {
    file,
    conversionType,
    setConversionType,
    status,
    progress,
    resultFilename,
    error,
    selectFile,
    reset,
    convert,
    supportedConversions,
    isSupported,
    isLoading: status === 'uploading' || status === 'converting',
  }
}
