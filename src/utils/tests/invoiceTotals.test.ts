import { calcInvoiceTotals } from '../invoiceTotals'
import {
  invoiceTotalsTwoLines,
  invoiceTotalsTopLevel,
  invoiceTotalsInvalid,
  invoiceTotalsEmpty,
} from 'test/fixtures/invoices'

describe('calcInvoiceTotals', () => {
  it('sums line price & tax when invoice total/tax are null', () => {
    const invoice = invoiceTotalsTwoLines

    const { total, tax } = calcInvoiceTotals(invoice)
    expect(total).toBeCloseTo(87000, 2)
    expect(tax).toBeCloseTo(3666.66, 2)
  })

  it('uses top-level invoice total/tax when present', () => {
    const invoice = invoiceTotalsTopLevel

    const { total, tax } = calcInvoiceTotals(invoice)
    const expectedTotal = 25000 + 20000
    const expectedTax = 4166.67 + 1818.18
    expect(total).toBeCloseTo(expectedTotal, 2)
    expect(tax).toBeCloseTo(expectedTax, 2)
  })

  it('handles invalid numeric strings gracefully', () => {
    const invoice = invoiceTotalsInvalid

    const { total, tax } = calcInvoiceTotals(invoice)
    expect(total).toBe(0)
    expect(tax).toBe(0)
  })

  it('returns zeros for empty invoice lines', () => {
    const invoice = invoiceTotalsEmpty
    const { total, tax } = calcInvoiceTotals(invoice)
    expect(total).toBe(0)
    expect(tax).toBe(0)
  })
})
