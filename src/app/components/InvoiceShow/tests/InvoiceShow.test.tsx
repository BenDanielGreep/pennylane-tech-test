import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import InvoiceShow from '../index'

jest.mock('hooks/useInvoiceShow', () => {
  const { invoiceShowFixture } = require('test/fixtures/invoices')
  return {
    useInvoiceShow: () => ({
      invoice: invoiceShowFixture,
      loading: false,
      error: null,
      updating: false,
      totals: { total: 50000, tax: 8333.34 },
      net: 41666.66,
      fetchInvoice: jest.fn(),
      markPaid: jest.fn(),
      finalizeInvoice: jest.fn(),
      deleteInvoice: jest.fn(),
    }),
  }
})

describe('InvoiceShow', () => {
  it('renders invoice header, customer and totals', () => {
    render(
      <MemoryRouter>
        <InvoiceShow />
      </MemoryRouter>
    )

    expect(screen.getByText(/Viewing Invoice #999/)).toBeInTheDocument()
    expect(screen.getByText('INVOICE')).toBeInTheDocument()

    expect(screen.getByText('FINALIZED')).toBeInTheDocument()

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('1 Main St')).toBeInTheDocument()
    expect(screen.getByText(/Berlin/)).toBeInTheDocument()

    expect(screen.getByText('Audi S5')).toBeInTheDocument()
    expect(screen.getAllByText('$50,000.00').length).toBeGreaterThanOrEqual(2)

    expect(screen.getByText('Subtotal:')).toBeInTheDocument()
    expect(screen.getByText('Tax:')).toBeInTheDocument()
    expect(screen.getAllByText('$8,333.34').length).toBeGreaterThanOrEqual(1)
  })
})
