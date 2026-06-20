import { describe, it, expect } from 'vitest'
import {
  calcLineItem,
  calcDocumentTotals,
  calcRemainingBalance,
  allocateFIFO,
} from '../invoice-calc'

describe('calcLineItem', () => {
  it('calculates a basic line item with no discount or tax', () => {
    const result = calcLineItem({ quantity: 2, unitPrice: 50 })
    expect(result.subtotal).toBe(100)
    expect(result.discountAmount).toBe(0)
    expect(result.taxAmount).toBe(0)
    expect(result.lineTotal).toBe(100)
  })

  it('applies a percent discount', () => {
    const result = calcLineItem({ quantity: 1, unitPrice: 200, discount: 10, discountType: 'PERCENT' })
    expect(result.discountAmount).toBe(20)
    expect(result.taxableAmount).toBe(180)
    expect(result.lineTotal).toBe(180)
  })

  it('applies a fixed amount discount', () => {
    const result = calcLineItem({ quantity: 1, unitPrice: 200, discount: 25, discountType: 'AMOUNT' })
    expect(result.discountAmount).toBe(25)
    expect(result.taxableAmount).toBe(175)
    expect(result.lineTotal).toBe(175)
  })

  it('applies tax on the post-discount amount', () => {
    const result = calcLineItem({ quantity: 2, unitPrice: 100, discount: 10, discountType: 'PERCENT', taxRate: 20 })
    // subtotal = 200, discount = 20, taxable = 180, tax = 36, total = 216
    expect(result.subtotal).toBe(200)
    expect(result.discountAmount).toBe(20)
    expect(result.taxAmount).toBe(36)
    expect(result.lineTotal).toBe(216)
  })

  it('handles zero quantity', () => {
    const result = calcLineItem({ quantity: 0, unitPrice: 50, taxRate: 18 })
    expect(result.subtotal).toBe(0)
    expect(result.lineTotal).toBe(0)
  })

  it('rounds to 2 decimal places', () => {
    const result = calcLineItem({ quantity: 3, unitPrice: 10, taxRate: 7 })
    // subtotal = 30, tax = 2.1, total = 32.1
    expect(result.lineTotal).toBe(32.1)
  })
})

describe('calcDocumentTotals', () => {
  it('sums multiple line items correctly', () => {
    const items = [
      { quantity: 2, unitPrice: 100, taxRate: 10 },
      { quantity: 1, unitPrice: 50, taxRate: 10 },
    ]
    const totals = calcDocumentTotals(items, 'USD')
    // Line 1: subtotal 200, tax 20 → 220
    // Line 2: subtotal 50, tax 5 → 55
    // Grand total: 275
    expect(totals.subtotal).toBe(250)
    expect(totals.taxTotal).toBe(25)
    expect(totals.total).toBe(275)
    expect(totals.currency).toBe('USD')
  })

  it('returns zero totals for empty items array', () => {
    const totals = calcDocumentTotals([])
    expect(totals.total).toBe(0)
    expect(totals.subtotal).toBe(0)
  })
})

describe('calcRemainingBalance', () => {
  it('returns the correct outstanding balance', () => {
    expect(calcRemainingBalance(500, 200)).toBe(300)
  })

  it('never returns negative', () => {
    expect(calcRemainingBalance(100, 150)).toBe(0)
  })

  it('returns zero when fully paid', () => {
    expect(calcRemainingBalance(250, 250)).toBe(0)
  })
})

describe('allocateFIFO', () => {
  const invoices = [
    { invoiceId: 'inv-1', invoiceNumber: 'INV-001', dueDate: '2026-04-01', outstanding: 300 },
    { invoiceId: 'inv-2', invoiceNumber: 'INV-002', dueDate: '2026-05-01', outstanding: 500 },
    { invoiceId: 'inv-3', invoiceNumber: 'INV-003', dueDate: '2026-06-01', outstanding: 200 },
  ]

  it('allocates fully to first invoice when payment is less than or equal to it', () => {
    const { allocations, unallocated } = allocateFIFO(200, invoices)
    expect(allocations).toHaveLength(1)
    expect(allocations[0].invoiceId).toBe('inv-1')
    expect(allocations[0].allocated).toBe(200)
    expect(unallocated).toBe(0)
  })

  it('spills across multiple invoices in FIFO order', () => {
    const { allocations, unallocated } = allocateFIFO(700, invoices)
    expect(allocations).toHaveLength(2)
    expect(allocations[0].allocated).toBe(300)
    expect(allocations[1].allocated).toBe(400)
    expect(unallocated).toBe(0)
  })

  it('tracks unallocated excess when payment exceeds all invoices', () => {
    const { allocations, unallocated } = allocateFIFO(1200, invoices)
    expect(allocations).toHaveLength(3)
    expect(unallocated).toBe(200)
  })

  it('returns empty allocations for zero payment', () => {
    const { allocations, unallocated } = allocateFIFO(0, invoices)
    expect(allocations).toHaveLength(0)
    expect(unallocated).toBe(0)
  })

  it('handles empty invoice list', () => {
    const { allocations, unallocated } = allocateFIFO(500, [])
    expect(allocations).toHaveLength(0)
    expect(unallocated).toBe(500)
  })
})
