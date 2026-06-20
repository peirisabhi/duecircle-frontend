import { post, get } from '@shared/api'
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignupRequest,
  SignupResponse,
  AcceptInviteRequest,
  InviteInfo,
} from './types'

export const authApi = {
  login: (data: LoginRequest) =>
    post<LoginResponse>('/auth/login', data),

  logout: () =>
    post<void>('/auth/logout'),

  forgotPassword: (data: ForgotPasswordRequest) =>
    post<void>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    post<void>('/auth/reset-password', data),

  signup: (data: SignupRequest) =>
    post<SignupResponse>('/auth/signup', data),

  getInviteInfo: (token: string) =>
    get<InviteInfo>(`/auth/invite/${token}`),

  acceptInvite: (data: AcceptInviteRequest) =>
    post<LoginResponse>('/auth/accept-invite', data),

  me: () =>
    get<LoginResponse>('/auth/me'),
}
