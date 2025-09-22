import { calcInvoiceTotals } from '../invoiceTotals'
import { Invoice } from 'types'

const makeInvoice = (partial: Partial<Invoice>): Invoice => {
  return {
    id: partial.id ?? 1,
    customer_id: partial.customer_id ?? 1,
    finalized: partial.finalized ?? false,
    paid: partial.paid ?? false,
    date: partial.date ?? '2025-01-01',
    deadline: partial.deadline ?? '2025-01-15',
    total: partial.total ?? null,
    tax: partial.tax ?? null,
    invoice_lines: partial.invoice_lines ?? [],
    customer: partial.customer,
  }
}

describe('calcInvoiceTotals', () => {
  it('sums line price & tax when invoice total/tax are null', () => {
    const invoice = makeInvoice({
      total: null,
      tax: null,
      invoice_lines: [
        {
          id: 1,
          invoice_id: 1,
          product_id: 1,
          quantity: 2,
          unit: 'piece',
          label: 'Item A',
          vat_rate: '20',
          price: '100.00',
          tax: '20.00',
          product: {
            id: 1,
            label: 'Item A',
            vat_rate: '20',
            unit: 'piece',
            unit_price: '50.00',
            unit_price_without_tax: '41.67',
            unit_tax: '8.33',
          },
        },
        {
          id: 2,
          invoice_id: 1,
          product_id: 2,
          quantity: 1,
          unit: 'piece',
          label: 'Item B',
          vat_rate: '10',
          price: '50.00',
          tax: '5.00',
          product: {
            id: 2,
            label: 'Item B',
            vat_rate: '10',
            unit: 'piece',
            unit_price: '50.00',
            unit_price_without_tax: '45.45',
            unit_tax: '4.55',
          },
        },
      ],
    })

    const { total, tax } = calcInvoiceTotals(invoice)
    expect(total).toBeCloseTo(150)
    expect(tax).toBeCloseTo(25)
  })

  it('uses top-level invoice total/tax when present', () => {
    const invoice = makeInvoice({
      total: '999.99',
      tax: '199.99',
      invoice_lines: [
        {
          id: 1,
          invoice_id: 1,
          product_id: 1,
          quantity: 1,
          unit: 'piece',
          label: 'X',
          vat_rate: '20',
          price: '10.00',
          tax: '2.00',
          product: {
            id: 1,
            label: 'X',
            vat_rate: '20',
            unit: 'piece',
            unit_price: '10.00',
            unit_price_without_tax: '8.33',
            unit_tax: '1.67',
          },
        },
      ],
    })

    const { total, tax } = calcInvoiceTotals(invoice)
    expect(total).toBe(999.99)
    expect(tax).toBe(199.99)
  })

  it('handles invalid numeric strings gracefully', () => {
    const invoice = makeInvoice({
      invoice_lines: [
        {
          id: 1,
          invoice_id: 1,
          product_id: 1,
          quantity: 1,
          unit: 'piece',
          label: 'Bad',
          vat_rate: '20',
          price: 'abc',
          tax: 'xyz',
          product: {
            id: 1,
            label: 'Bad',
            vat_rate: '20',
            unit: 'piece',
            unit_price: '0',
            unit_price_without_tax: '0',
            unit_tax: '0',
          },
        },
      ],
    })

    const { total, tax } = calcInvoiceTotals(invoice)
    expect(total).toBe(0)
    expect(tax).toBe(0)
  })

  it('returns zeros for empty invoice lines', () => {
    const invoice = makeInvoice({ invoice_lines: [] })
    const { total, tax } = calcInvoiceTotals(invoice)
    expect(total).toBe(0)
    expect(tax).toBe(0)
  })
})
