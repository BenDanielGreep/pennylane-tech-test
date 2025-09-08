import { Invoice } from 'types'

export type InvoiceFilter = 'all' | 'open' | 'past'

export const filterInvoices = (
  invoices: Invoice[],
  filter: InvoiceFilter
): Invoice[] => {
  switch (filter) {
    case 'all':
      return invoices
    case 'open':
      return invoices.filter((invoice) => !invoice.paid)
    case 'past':
      return invoices.filter((invoice) => invoice.paid)
    default:
      return invoices
  }
}

export const getInvoiceFilterLabel = (filter: InvoiceFilter): string => {
  switch (filter) {
    case 'all':
      return 'All Invoices'
    case 'open':
      return 'Open Invoices'
    case 'past':
      return 'Past Invoices'
    default:
      return 'All Invoices'
  }
}

export const getInvoiceCount = (
  invoices: Invoice[],
  filter: InvoiceFilter
): number => {
  return filterInvoices(invoices, filter).length
}
