/** Common shared types used across the application. */

// ─── Pagination ──────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  first: boolean
  last: boolean
}

export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
}

// ─── API ─────────────────────────────────────────────────────────────
export interface ApiError {
  status: number
  code: string
  message: string
  details?: Record<string, string>
  timestamp?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

// ─── User & Auth ─────────────────────────────────────────────────────
export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'STAFF' | 'VIEWER'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatarUrl?: string
  role: UserRole
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number // seconds
}

// ─── Organization ─────────────────────────────────────────────────────
export interface Organization {
  id: string
  slug: string
  name: string
  logoUrl?: string
  currency: string
  currencySymbol: string
  currencyDecimals: number
  timezone: string
  locale: string
  fiscalYearStart: number // 1-12 (month)
  address?: Address
  phone?: string
  email?: string
  taxNumber?: string
  website?: string
  createdAt: string
}

export interface OrgMembership {
  org: Organization
  role: UserRole
  joinedAt: string
}

// ─── Address ─────────────────────────────────────────────────────────
export interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
}

// ─── Status types ─────────────────────────────────────────────────────
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'VOIDED' | 'CANCELLED'
export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED'
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'CARD' | 'MOBILE_MONEY' | 'OTHER'
export type StockMovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN'

// ─── Document / Line item ─────────────────────────────────────────────
export interface LineItem {
  id?: string
  productId?: string
  productName: string
  description?: string
  quantity: number
  unitPrice: number
  discount?: number
  discountType?: 'PERCENT' | 'AMOUNT'
  taxRate?: number
  taxAmount?: number
  lineTotal: number
  unit?: string
  warehouseId?: string
}

export interface DocumentTotals {
  subtotal: number
  discountTotal: number
  taxTotal: number
  total: number
  currency: string
}

// ─── Notification ─────────────────────────────────────────────────────
export type NotificationChannel = 'EMAIL' | 'WHATSAPP' | 'IN_APP'
export type NotificationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED'

export interface Notification {
  id: string
  title: string
  body: string
  type: string
  isRead: boolean
  resourceType?: string
  resourceId?: string
  createdAt: string
}

// ─── Audit ────────────────────────────────────────────────────────────
export interface AuditEntry {
  id: string
  userId: string
  userFullName: string
  action: string
  resourceType: string
  resourceId: string
  changes?: Record<string, { from: unknown; to: unknown }>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

// ─── Select option helper ─────────────────────────────────────────────
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  description?: string
}

// ─── Upload ───────────────────────────────────────────────────────────
export interface UploadedFile {
  id: string
  name: string
  url: string
  mimeType: string
  size: number
}

// ─── Currency / Money ─────────────────────────────────────────────────
export interface Money {
  amount: number
  currency: string
}
