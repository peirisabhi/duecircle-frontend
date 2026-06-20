/**
 * Formatting utilities — currency, numbers, dates, etc.
 * All functions are pure and i18n-aware.
 */

import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns'

// ─── Currency ─────────────────────────────────────────────────────────
interface FormatCurrencyOptions {
  currency?: string
  locale?: string
  compact?: boolean
  showSign?: boolean
}

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const { currency = 'USD', locale = 'en-US', compact = false, showSign = false } = options

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))

  if (showSign && amount !== 0) {
    return amount < 0 ? `-${formatted}` : `+${formatted}`
  }
  if (amount < 0) return `-${formatted}`
  return formatted
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value)
}

// ─── Dates ────────────────────────────────────────────────────────────
const DATE_FORMAT = 'MMM d, yyyy'
const DATETIME_FORMAT = 'MMM d, yyyy h:mm a'

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return isValid(d) ? format(d, DATE_FORMAT) : '—'
  } catch {
    return '—'
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return isValid(d) ? format(d, DATETIME_FORMAT) : '—'
  } catch {
    return '—'
  }
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '—'
  } catch {
    return '—'
  }
}

// ─── Strings ──────────────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 3)}...`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─── Document numbers ─────────────────────────────────────────────────
export function formatDocNumber(prefix: string, number: number, padLength = 5): string {
  return `${prefix}${String(number).padStart(padLength, '0')}`
}

// ─── Percentages ──────────────────────────────────────────────────────
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

// ─── Phone ────────────────────────────────────────────────────────────
export function formatPhone(phone: string): string {
  // Basic formatting; extend with libphonenumber if needed
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

// ─── File size ────────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
