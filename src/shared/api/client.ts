/**
 * Axios instance with:
 * - Auto-attach Authorization header from in-memory token store
 * - Automatic token refresh on 401
 * - Error normalization to ApiError shape
 * - Tenant (org) scoping via X-Org-Id header
 */

import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError, AuthTokens } from '@shared/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

// ─── Token store (in-memory, not localStorage) ────────────────────────
// Access token lives only in memory; refresh token in localStorage with rotation.
// This mitigates XSS risk on access tokens while maintaining persistent sessions.
let accessToken: string | null = null
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}> = []

export const tokenStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => { accessToken = token },
  getRefreshToken: () => localStorage.getItem('dc_refresh_token'),
  setRefreshToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('dc_refresh_token', token)
    } else {
      localStorage.removeItem('dc_refresh_token')
    }
  },
  setTokens: (tokens: AuthTokens) => {
    accessToken = tokens.accessToken
    localStorage.setItem('dc_refresh_token', tokens.refreshToken)
  },
  clearTokens: () => {
    accessToken = null
    localStorage.removeItem('dc_refresh_token')
    localStorage.removeItem('dc_active_org')
  },
}

// ─── Axios instance ───────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
  withCredentials: false,
})

// ─── Request interceptor ──────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Attach active org id from localStorage (set by org store)
    const activeOrgId = localStorage.getItem('dc_active_org')
    if (activeOrgId) {
      config.headers['X-Org-Id'] = activeOrgId
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor with token refresh ──────────────────────────
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) { reject(error) } else { resolve(token!) }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenStore.getRefreshToken()

      if (!refreshToken) {
        // No refresh token — redirect to login
        tokenStore.clearTokens()
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<AuthTokens>(
          `${BASE_URL}/api/v1/auth/refresh`,
          { refreshToken }
        )
        tokenStore.setTokens(data)
        processQueue(null, data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        tokenStore.clearTokens()
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(normalizeError(error))
  }
)

// ─── Error normalization ──────────────────────────────────────────────
function normalizeError(error: AxiosError): ApiError {
  const data = error.response?.data as Record<string, unknown> | undefined

  return {
    status: error.response?.status ?? 0,
    code: (data?.code as string) ?? 'UNKNOWN_ERROR',
    message:
      (data?.message as string) ??
      error.message ??
      'An unexpected error occurred',
    details: data?.details as Record<string, string> | undefined,
    timestamp: new Date().toISOString(),
  }
}

// ─── Typed helpers ─────────────────────────────────────────────────────
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<T>(url, config)
  return res.data
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.post<T>(url, data, config)
  return res.data
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.put<T>(url, data, config)
  return res.data
}

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.patch<T>(url, data, config)
  return res.data
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.delete<T>(url, config)
  return res.data
}
