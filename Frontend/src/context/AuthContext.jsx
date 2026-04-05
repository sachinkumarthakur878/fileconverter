import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(token && user)

  const saveAuth = (userData, authToken) => {
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(authToken)
    setUser(userData)
  }

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true)
    try {
      const { data } = await authAPI.register({ name, email, password })
      saveAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, password })
      saveAuth(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
