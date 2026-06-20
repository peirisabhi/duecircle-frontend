import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, AuthTokens } from '@shared/types'
import { tokenStore } from '@shared/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean // true while checking stored refresh token on app boot

  // Actions
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens) => void
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  setInitializing: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (tokens) => {
        tokenStore.setTokens(tokens)
      },

      login: (user, tokens) => {
        tokenStore.setTokens(tokens)
        set({ user, isAuthenticated: true })
      },

      logout: () => {
        tokenStore.clearTokens()
        set({ user: null, isAuthenticated: false })
      },

      setInitializing: (value) => set({ isInitializing: value }),
    }),
    { name: 'auth-store' }
  )
)

// Selector helpers (avoids inline arrow fns causing re-renders)
export const selectUser = (s: AuthState) => s.user
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated
export const selectIsInitializing = (s: AuthState) => s.isInitializing
