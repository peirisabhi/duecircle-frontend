export const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'AED', label: 'AED — UAE Dirham' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'LKR', label: 'LKR — Sri Lankan Rupee' },
  { value: 'BDT', label: 'BDT — Bangladeshi Taka' },
  { value: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { value: 'PKR', label: 'PKR — Pakistani Rupee' },
  { value: 'NGN', label: 'NGN — Nigerian Naira' },
  { value: 'ZAR', label: 'ZAR — South African Rand' },
  { value: 'KES', label: 'KES — Kenyan Shilling' },
  { value: 'GHS', label: 'GHS — Ghanaian Cedi' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'CNY', label: 'CNY — Chinese Yuan' },
  { value: 'CHF', label: 'CHF — Swiss Franc' },
  { value: 'NZD', label: 'NZD — New Zealand Dollar' },
  { value: 'BRL', label: 'BRL — Brazilian Real' },
  { value: 'MXN', label: 'MXN — Mexican Peso' },
]

export const TIMEZONES = Intl.supportedValuesOf('timeZone').map((tz: string) => ({
  value: tz,
  label: tz.replace(/_/g, ' '),
}))

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'CARD', label: 'Card' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money' },
  { value: 'OTHER', label: 'Other' },
]

export const INVOICE_STATUSES = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'VOIDED', label: 'Voided' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export const QUOTATION_STATUSES = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CONVERTED', label: 'Converted' },
]

export const TAX_RATES = [
  { value: 0, label: '0% — Tax exempt' },
  { value: 5, label: '5%' },
  { value: 10, label: '10%' },
  { value: 12, label: '12%' },
  { value: 15, label: '15%' },
  { value: 18, label: '18% — GST' },
  { value: 20, label: '20% — VAT' },
  { value: 21, label: '21%' },
  { value: 25, label: '25%' },
]

export const PAGE_SIZES = [10, 20, 50, 100] as const
export const DEFAULT_PAGE_SIZE = 20

export const DEBOUNCE_DELAY_MS = 300

export const DATE_FORMAT = 'MMM d, yyyy'
export const DATE_FORMAT_ISO = 'yyyy-MM-dd'
export const DATETIME_FORMAT = 'MMM d, yyyy h:mm a'

export const MAX_UPLOAD_SIZE_MB = 5
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
export const ALLOWED_DOC_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES]
