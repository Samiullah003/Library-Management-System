import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first paint, ask the servlet which user owns the current JSESSIONID.
  useEffect(() => {
    let cancelled = false
    api
      .me()
      .then((data) => {
        if (!cancelled) setUser(data || null)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const data = await api.register(payload)
    setUser(data)
    return data
  }, [])

  const logout = useCallback(async () => {
    await api.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isLibrarian: user?.role === 'LIBRARIAN',
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
