/**
 * Invoice / document calculation utilities.
 * Pure functions — unit-tested independently of React.
 */

import type { LineItem, DocumentTotals } from '@shared/types'

export interface LineItemInput {
  quantity: number
  unitPrice: number
  discount?: number
  discountType?: 'PERCENT' | 'AMOUNT'
  taxRate?: number
}

/**
 * Calculate totals for a single line item.
 */
export function calcLineItem(item: LineItemInput): {
  subtotal: number
  discountAmount: number
  taxableAmount: number
  taxAmount: number
  lineTotal: number
} {
  const subtotal = item.quantity * item.unitPrice

  let discountAmount = 0
  if (item.discount && item.discount > 0) {
    if (item.discountType === 'AMOUNT') {
      discountAmount = item.discount
    } else {
      // Default: PERCENT
      discountAmount = subtotal * (item.discount / 100)
    }
  }

  const taxableAmount = subtotal - discountAmount
  const taxAmount = item.taxRate ? taxableAmount * (item.taxRate / 100) : 0
  const lineTotal = taxableAmount + taxAmount

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    lineTotal: Math.round(lineTotal * 100) / 100,
  }
}

/**
 * Calculate document-level totals from an array of line items.
 */
export function calcDocumentTotals(
  items: LineItemInput[],
  currency = 'USD'
): DocumentTotals {
  let subtotal = 0
  let discountTotal = 0
  let taxTotal = 0

  for (const item of items) {
    const calc = calcLineItem(item)
    subtotal += calc.subtotal
    discountTotal += calc.discountAmount
    taxTotal += calc.taxAmount
  }

  const total = subtotal - discountTotal + taxTotal

  return {
    subtotal: round2(subtotal),
    discountTotal: round2(discountTotal),
    taxTotal: round2(taxTotal),
    total: round2(total),
    currency,
  }
}

/**
 * Convert line item DTOs (from server) into calculation inputs.
 */
export function lineItemsToInputs(items: Partial<LineItem>[]): LineItemInput[] {
  return items.map((item) => ({
    quantity: item.quantity ?? 0,
    unitPrice: item.unitPrice ?? 0,
    discount: item.discount,
    discountType: item.discountType ?? 'PERCENT',
    taxRate: item.taxRate,
  }))
}

/**
 * Calculate remaining balance for an invoice after payments.
 */
export function calcRemainingBalance(total: number, paidAmount: number): number {
  return round2(Math.max(0, total - paidAmount))
}

/**
 * FIFO allocation: given a payment amount and list of open invoices (sorted by due date),
 * auto-allocate the payment across invoices from oldest to newest.
 */
export interface AllocationTarget {
  invoiceId: string
  invoiceNumber: string
  dueDate: string
  outstanding: number
}

export interface Allocation {
  invoiceId: string
  invoiceNumber: string
  allocated: number
}

export function allocateFIFO(
  paymentAmount: number,
  openInvoices: AllocationTarget[]
): { allocations: Allocation[]; unallocated: number } {
  let remaining = paymentAmount
  const allocations: Allocation[] = []

  for (const invoice of openInvoices) {
    if (remaining <= 0) break
    const allocated = Math.min(remaining, invoice.outstanding)
    allocations.push({
      invoiceId: invoice.invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      allocated: round2(allocated),
    })
    remaining -= allocated
  }

  return { allocations, unallocated: round2(Math.max(0, remaining)) }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}
