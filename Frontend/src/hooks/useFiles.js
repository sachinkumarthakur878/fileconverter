import { useState, useCallback } from 'react'
import { fileAPI } from '../api'
import toast from 'react-hot-toast'

export function useFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await fileAPI.getMyFiles()
      setFiles(data.files || [])
      setFetched(true)
    } catch (err) {
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteFile = useCallback(async (id) => {
    try {
      await fileAPI.deleteFile(id)
      setFiles(prev => prev.filter(f => f._id !== id))
      toast.success('File deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }, [])

  const addFile = useCallback((file) => {
    setFiles(prev => [file, ...prev])
  }, [])

  return { files, loading, fetched, fetchFiles, deleteFile, addFile }
}
