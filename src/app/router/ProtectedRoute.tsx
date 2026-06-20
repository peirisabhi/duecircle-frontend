import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@shared/store'

/**
 * Wraps private routes. Redirects to /auth/login if not authenticated,
 * preserving the intended destination via location state.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitializing = useAuthStore((s) => s.isInitializing)
  const location = useLocation()

  // While we're restoring session from a stored refresh token, render nothing
  // to avoid a flash of the login page.
  if (isInitializing) return null

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
