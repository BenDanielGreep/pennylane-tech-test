import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import type { Invoice } from 'types'
import InvoiceTable from '../index'

const mockInvoices: Invoice[] = [
  {
    id: 54321,
    customer_id: 0,
    finalized: true,
    paid: true,
    date: '2024-01-01',
    deadline: '2024-01-15',
    total: '555.00',
    tax: '0',
    invoice_lines: [],
    customer: {
      first_name: 'Alice',
      last_name: 'Smith',
      city: 'London',
      id: 0,
      address: '',
      zip_code: '',
      country: '',
      country_code: '',
    },
  },
  {
    id: 54322,
    customer_id: 0,
    finalized: false,
    paid: false,
    date: '2024-02-01',
    deadline: '2024-02-20',
    total: null,
    tax: '0',
    invoice_lines: [
      {
        id: 1,
        invoice_id: 54322,
        product_id: 1,
        quantity: 1,
        label: 'Line A',
        unit: 'piece',
        vat_rate: '20',
        price: '100.00',
        tax: '0',
        product: {
          id: 1,
          label: 'X',
          vat_rate: '20',
          unit: 'piece',
          unit_price: '0',
          unit_price_without_tax: '0',
          unit_tax: '0',
        },
      },
      {
        id: 2,
        invoice_id: 54322,
        product_id: 2,
        quantity: 1,
        label: 'Line B',
        unit: 'piece',
        vat_rate: '20',
        price: '23.45',
        tax: '0',
        product: {
          id: 2,
          label: 'Y',
          vat_rate: '20',
          unit: 'piece',
          unit_price: '0',
          unit_price_without_tax: '0',
          unit_tax: '0',
        },
      },
    ],
    customer: {
      first_name: 'Bob',
      last_name: 'Brown',
      city: 'Paris',
      id: 0,
      address: '',
      zip_code: '',
      country: '',
      country_code: '',
    },
  },
]

const setup = (invoices: Invoice[] = mockInvoices) =>
  render(
    <MemoryRouter>
      <InvoiceTable invoices={invoices} />
    </MemoryRouter>
  )

describe('InvoiceTable', () => {
  it('renders rows for each invoice', () => {
    setup()
    expect(screen.getByText('54321')).toBeInTheDocument()
    expect(screen.getByText('54322')).toBeInTheDocument()
  })

  it('renders customer names', () => {
    setup()
    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Brown')).toBeInTheDocument()
  })

  it('renders explicit total using real formatter', () => {
    setup()
    expect(screen.getByText('$555.00')).toBeInTheDocument()
  })

  it('falls back to computed line totals when no invoice.total', () => {
    setup()
    expect(screen.getByText('$123.45')).toBeInTheDocument()
  })

  it('shows Paid badge only for paid invoices', () => {
    setup()
    expect(screen.getAllByText('Paid')).toHaveLength(1)
  })

  it('shows Paid badge only for finalized invoices which are paid', () => {
    setup()
    const rows = screen.getAllByRole('row')
    const finalizedRow = rows.find((r) => /54321/.test(r.textContent || ''))
    expect(finalizedRow).toBeTruthy()
    expect(finalizedRow).toHaveTextContent('Paid')
    expect(screen.getAllByText('Paid')).toHaveLength(1)
  })
  it('does  show Finalized badge for finalized invoices which are not paid', () => {
    setup()
    const rows = screen.getAllByRole('row')
    const finalizedRow = rows.find((r) => /54324/.test(r.textContent || ''))
    expect(finalizedRow).toBeTruthy()
    expect(finalizedRow).toHaveTextContent('Finalized')
    expect(screen.getAllByText('Finalized')).toHaveLength(1)
  })

  it('renders formatted dates for date and deadline', () => {
    setup()
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument()
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('Feb 1, 2024')).toBeInTheDocument()
    expect(screen.getByText('Feb 20, 2024')).toBeInTheDocument()
  })

  it('renders link to invoice detail', () => {
    setup()
    const links = screen.getAllByRole('link', { name: 'View' })
    expect(links[0]).toHaveAttribute('href', '/invoice/54321')
  })

  it('shows empty state when no invoices', () => {
    setup([])
    expect(screen.getByText('No invoices found')).toBeInTheDocument()
  })
})
