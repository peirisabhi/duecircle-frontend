import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider, App as AntApp, theme as antdThemeAlgorithm } from 'antd'
import { router } from './router'
import { antdTheme, antdDarkTheme } from '@styles/theme'
import { useUiStore, useAuthStore } from '@shared/store'
import { tokenStore } from '@shared/api'
import { post } from '@shared/api'
import type { AuthTokens, User } from '@shared/types'
import '@shared/i18n'
import '@styles/global.css'

// ─── TanStack Query client ────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,        // 2 min
      gcTime: 1000 * 60 * 10,          // 10 min
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        const status = (error as { status?: number })?.status
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
})

// ─── Session restoration ──────────────────────────────────────────────
async function restoreSession(
  login: (user: User, tokens: AuthTokens) => void,
  setInitializing: (v: boolean) => void
) {
  const refreshToken = tokenStore.getRefreshToken()
  if (!refreshToken) {
    setInitializing(false)
    return
  }

  // Dev bypass — skip real refresh call when using the mock token
  // @ts-ignore
  if (import.meta.env.DEV && refreshToken === 'dev-refresh-token') {
    setInitializing(false)
    return
  }

  try {
    const data = await post<AuthTokens & { user: User }>('/auth/refresh', { refreshToken })
    login(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken, expiresIn: data.expiresIn })
  } catch {
    tokenStore.clearTokens()
  } finally {
    setInitializing(false)
  }
}

// ─── Online/offline detection ─────────────────────────────────────────
function useOnlineStatus() {
  const setOnline = useUiStore((s) => s.setOnline)
  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline])
}

// ─── Root App ─────────────────────────────────────────────────────────
function AppContent() {
  const isDarkMode = useUiStore((s) => s.isDarkMode)
  const isOnline = useUiStore((s) => s.isOnline)
  const login = useAuthStore((s) => s.login)
  const setInitializing = useAuthStore((s) => s.setInitializing)

  useOnlineStatus()

  useEffect(() => {
    // Apply persisted dark mode on mount
    const stored = localStorage.getItem('dc-ui-prefs')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { state?: { isDarkMode?: boolean } }
        if (parsed.state?.isDarkMode) {
          document.documentElement.setAttribute('data-theme', 'dark')
        }
      } catch { /* ignore */ }
    }

    // Restore auth session
    void restoreSession(login, setInitializing)
  }, [login, setInitializing])

  const selectedTheme = isDarkMode
    ? { ...antdDarkTheme, algorithm: antdThemeAlgorithm.darkAlgorithm }
    : antdTheme

  return (
    <ConfigProvider theme={selectedTheme}>
      <AntApp>
        {!isOnline && (
          <div className="offline-banner">
            No internet connection — some features may not work correctly.
          </div>
        )}
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  )
}

export default function App() {
  // @ts-ignore
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      {import.meta.env.VITE_ENABLE_DEVTOOLS === 'true' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
