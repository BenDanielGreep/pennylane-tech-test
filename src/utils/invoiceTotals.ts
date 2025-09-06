import { Invoice } from 'types'

export interface InvoiceComputedTotals {
  total: number
  tax: number
}

// Totals dont show if it isn't paid, so we manually find them in the invoice and show them

export const calcInvoiceTotals = (invoice: Invoice): InvoiceComputedTotals => {
  const lineTotals = invoice.invoice_lines || []
  const summedTotal = lineTotals.reduce((sum, l) => {
    const v = Number(l.price ?? 0)
    return sum + (isNaN(v) ? 0 : v)
  }, 0)
  const summedTax = lineTotals.reduce((sum, l) => {
    const v = Number(l.tax ?? 0)
    return sum + (isNaN(v) ? 0 : v)
  }, 0)

  const total = invoice.total ? Number(invoice.total) : summedTotal
  const tax = invoice.tax ? Number(invoice.tax) : summedTax

  return { total, tax }
}
