import { useEffect, useState, type ReactNode } from 'react'
import { type User } from '../types'
import { getMe, login as apiLogin, logout as apiLogout } from '../services/authService'
import { getTokens, clearTokens } from '../utils/authHelpers'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Initialise isLoading to false when there is no token — avoids a
  // synchronous setState call inside the effect body.
  const [isLoading, setIsLoading] = useState(() => Boolean(getTokens().access))

  useEffect(() => {
    const { access } = getTokens()
    if (!access) return
    getMe()
      .then(setUser)
      .catch(() => { clearTokens() })
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const response = await apiLogin(email, password)
    setUser(response.user)
  }

  async function logout() {
    const { refresh } = getTokens()
    if (refresh) {
      await apiLogout(refresh).catch(() => {})
    }
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
