import { Invoice } from 'types'
import {
  filterInvoices,
  getInvoiceFilterLabel,
  getInvoiceCount,
} from '../invoiceFilters'

const sampleInvoices: Invoice[] = [
  {
    id: 1,
    customer_id: null,
    finalized: false,
    paid: false,
    date: null,
    deadline: null,
    total: '100',
    tax: '10',
    invoice_lines: [],
  },
  {
    id: 2,
    customer_id: null,
    finalized: false,
    paid: true,
    date: null,
    deadline: null,
    total: '200',
    tax: '20',
    invoice_lines: [],
  },
  {
    id: 3,
    customer_id: null,
    finalized: false,
    paid: false,
    date: null,
    deadline: null,
    total: '150',
    tax: '15',
    invoice_lines: [],
  },
  {
    id: 4,
    customer_id: null,
    finalized: false,
    paid: true,
    date: null,
    deadline: null,
    total: '250',
    tax: '25',
    invoice_lines: [],
  },
]

describe('filterInvoices', () => {
  it('should return all invoices for "all" filter', () => {
    const result = filterInvoices(sampleInvoices, 'all')
    expect(result).toHaveLength(4)
  })

  it('should return only unpaid invoices for "open" filter', () => {
    const result = filterInvoices(sampleInvoices, 'open')
    expect(result).toHaveLength(2)
    expect(result.every((inv) => !inv.paid)).toBe(true)
  })

  it('should return only paid invoices for "past" filter', () => {
    const result = filterInvoices(sampleInvoices, 'past')
    expect(result).toHaveLength(2)
    expect(result.every((inv) => inv.paid)).toBe(true)
  })
})

describe('getInvoiceFilterLabel', () => {
  it('should return correct label for "all" filter', () => {
    expect(getInvoiceFilterLabel('all')).toBe('All Invoices')
  })

  it('should return correct label for "open" filter', () => {
    expect(getInvoiceFilterLabel('open')).toBe('Open Invoices')
  })

  it('should return correct label for "past" filter', () => {
    expect(getInvoiceFilterLabel('past')).toBe('Past Invoices')
  })
})

describe('getInvoiceCount', () => {
  it('should return correct count for "all" filter', () => {
    expect(getInvoiceCount(sampleInvoices, 'all')).toBe(4)
  })

  it('should return correct count for "open" filter', () => {
    expect(getInvoiceCount(sampleInvoices, 'open')).toBe(2)
  })

  it('should return correct count for "past" filter', () => {
    expect(getInvoiceCount(sampleInvoices, 'past')).toBe(2)
  })
})
