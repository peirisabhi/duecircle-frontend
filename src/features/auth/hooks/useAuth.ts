import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { App } from 'antd'
import { authApi } from '../api'
import { useAuthStore } from '@shared/store/auth.store'
import { useOrgStore } from '@shared/store/org.store'
import type { LoginRequest, SignupRequest, AcceptInviteRequest } from '../types'
import type { LoginResponse } from '../types'

// ─── Dev mock — remove when backend is live ───────────────────────────
const DEV_EMAIL = 'admin@duecircle.dev'
const DEV_PASSWORD = 'password'

function mockLogin(): LoginResponse {
  return {
    user: {
      id: 'dev-user-1',
      email: DEV_EMAIL,
      firstName: 'Dev',
      lastName: 'Admin',
      fullName: 'Dev Admin',
      role: 'OWNER',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    tokens: {
      accessToken: 'dev-access-token',
      refreshToken: 'dev-refresh-token',
      expiresIn: 3600,
    },
    memberships: [
      {
        org: {
          id: 'dev-org-1',
          slug: 'demo-org',
          name: 'Demo Organization',
          currency: 'USD',
          currencySymbol: '$',
          currencyDecimals: 2,
          timezone: 'America/New_York',
          locale: 'en-US',
          fiscalYearStart: 1,
          createdAt: new Date().toISOString(),
        },
        role: 'OWNER',
        joinedAt: new Date().toISOString(),
      },
    ],
  }
}

export function useLogin() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const setMemberships = useOrgStore((s) => s.setMemberships)

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      // Dev bypass — delete this block when backend is ready
      if (import.meta.env.DEV && data.email === DEV_EMAIL && data.password === DEV_PASSWORD) {
        return new Promise((res) => setTimeout(() => res(mockLogin()), 400))
      }
      return authApi.login(data)
    },
    onSuccess: (res) => {
      login(res.user, res.tokens)
      setMemberships(res.memberships)
      const from = (location.state as { from?: Location })?.from?.pathname ?? '/app/dashboard'
      navigate(from, { replace: true })
    },
    onError: (err: { message?: string }) => {
      void message.error(err.message ?? 'Invalid email or password')
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Always clear local state even if API call fails
      logout()
      navigate('/auth/login', { replace: true })
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword({ email }),
  })
}

export function useResetPassword() {
  const navigate = useNavigate()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      authApi.resetPassword(data),
    onSuccess: () => {
      void message.success('Password updated. Please sign in.')
      navigate('/auth/login', { replace: true })
    },
    onError: (err: { message?: string }) => {
      void message.error(err.message ?? 'Reset link is invalid or expired.')
    },
  })
}

export function useSignup() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const setMemberships = useOrgStore((s) => s.setMemberships)

  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: (res) => {
      login(res.user, res.tokens)
      setMemberships(res.memberships)
      navigate('/app/dashboard', { replace: true })
    },
  })
}

export function useAcceptInvite() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const setMemberships = useOrgStore((s) => s.setMemberships)

  return useMutation({
    mutationFn: (data: AcceptInviteRequest) => authApi.acceptInvite(data),
    onSuccess: (res) => {
      login(res.user, res.tokens)
      setMemberships(res.memberships)
      navigate('/app/dashboard', { replace: true })
    },
  })
}
