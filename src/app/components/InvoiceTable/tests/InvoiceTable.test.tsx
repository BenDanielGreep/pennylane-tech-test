import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import InvoiceTable from '../index'
import { invoiceTableInvoices } from 'test/fixtures/invoices'

const setup = (invoices = invoiceTableInvoices) =>
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
    expect(screen.getByText('$11,000.00')).toBeInTheDocument()
  })

  it('falls back to computed line totals when no invoice.total', () => {
    setup()
    expect(screen.getByText('$62,000.00')).toBeInTheDocument()
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
