import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s for file uploads
})

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ---- AUTH ----
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
}

// ---- FILES ----
export const fileAPI = {
  // Upload a file (stores in DB, no conversion)
  upload: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
  },

  // Convert to PDF (returns blob)
  convertToPDF: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/file/to-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
      onUploadProgress: (e) => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
  },

  // Convert to Word (returns blob)
  convertToWord: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/file/to-word', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
      onUploadProgress: (e) => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
      },
    })
  },

  // Get all files for logged-in user
  getMyFiles: () => api.get('/api/file/my-files'),

  // Delete a file
  deleteFile: (id) => api.delete(`/api/file/${id}`),
}

export default api
