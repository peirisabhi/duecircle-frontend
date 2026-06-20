import type { User, AuthTokens, OrgMembership } from '@shared/types'

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
  memberships: OrgMembership[]
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface SignupRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  orgName: string
  currency: string
  timezone: string
}

export interface SignupResponse {
  user: User
  tokens: AuthTokens
  memberships: OrgMembership[]
}

export interface AcceptInviteRequest {
  token: string
  firstName: string
  lastName: string
  password: string
}

export interface InviteInfo {
  inviterName: string
  orgName: string
  email: string
  role: string
  expiresAt: string
}
