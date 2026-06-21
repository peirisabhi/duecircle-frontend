import { Tag } from 'antd'
import type { InvoiceStatus, QuotationStatus } from '@shared/types'

type AnyStatus = InvoiceStatus | QuotationStatus | string

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  DRAFT:     { color: '#6B7280', bg: '#F1F5F9', label: 'Draft' },
  SENT:      { color: '#0284C7', bg: '#E0F2FE', label: 'Sent' },
  PAID:      { color: '#059669', bg: '#D1FAE5', label: 'Paid' },
  PARTIAL:   { color: '#D97706', bg: '#FEF3C7', label: 'Partial' },
  OVERDUE:   { color: '#DC2626', bg: '#FEE2E2', label: 'Overdue' },
  VOIDED:    { color: '#9CA3AF', bg: '#F3F4F6', label: 'Voided' },
  CANCELLED: { color: '#9CA3AF', bg: '#F3F4F6', label: 'Cancelled' },
  ACCEPTED:  { color: '#059669', bg: '#D1FAE5', label: 'Accepted' },
  REJECTED:  { color: '#DC2626', bg: '#FEE2E2', label: 'Rejected' },
  EXPIRED:   { color: '#9CA3AF', bg: '#F3F4F6', label: 'Expired' },
  CONVERTED: { color: '#7C3AED', bg: '#EDE9FE', label: 'Converted' },
  ACTIVE:    { color: '#059669', bg: '#D1FAE5', label: 'Active' },
  INACTIVE:  { color: '#9CA3AF', bg: '#F3F4F6', label: 'Inactive' },
  PENDING:   { color: '#D97706', bg: '#FEF3C7', label: 'Pending' },
  DELIVERED: { color: '#059669', bg: '#D1FAE5', label: 'Delivered' },
  FAILED:    { color: '#DC2626', bg: '#FEE2E2', label: 'Failed' },
}

interface Props {
  status: AnyStatus
  size?: 'sm' | 'md'
}

export function StatusTag({ status, size = 'sm' }: Props) {
  const cfg = STATUS_CONFIG[status] ?? { color: '#6B7280', bg: '#F1F5F9', label: status }
  return (
    <Tag
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: 'none',
        fontWeight: 600,
        fontSize: size === 'sm' ? 11 : 12,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        borderRadius: 4,
        padding: size === 'sm' ? '0 6px' : '1px 8px',
        lineHeight: '20px',
      }}
    >
      {cfg.label}
    </Tag>
  )
}
