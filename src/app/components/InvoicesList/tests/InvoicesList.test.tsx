import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import InvoicesList from '../index'
import { useInvoicesList } from 'hooks/useInvoicesList'

jest.mock('hooks/useInvoicesList', () => ({
  useInvoicesList: jest.fn(),
}))

jest.mock('app/components/InvoiceFields/CustomerAutocomplete', () => () => (
  <div data-testid="customer-autocomplete" />
))

const setupMock = (overrides?: Partial<ReturnType<typeof useInvoicesList>>) => {
  const setPage = jest.fn()
  const base: any = {
    invoicesList: [],
    activeTab: 'all',
    setActiveTab: jest.fn(),
    filteredInvoices: [],
    page: 1,
    setPage,
    pagination: { page: 1, page_size: 10, total_pages: 3, total_entries: 25 },
    pageSize: 10,
    fetchInvoices: jest.fn(),
    setCustomerId: jest.fn(),
  }
  ;(useInvoicesList as jest.Mock).mockReturnValue({ ...base, ...overrides })
  return { setPage }
}

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <InvoicesList />
    </MemoryRouter>
  )

describe('InvoicesList pagination', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows page summary and enables Next button on first page, calling setPage(page+1)', async () => {
    const { setPage } = setupMock({ page: 1 })
    renderWithRouter()

    expect(screen.getByText('Page 1 of 3 • 25 total')).toBeInTheDocument()

    const prevBtn = screen.getByRole('button', { name: '‹ Prev' })
    const nextBtn = screen.getByRole('button', { name: 'Next ›' })

    expect(prevBtn).toBeDisabled()
    expect(nextBtn).toBeEnabled()

    await userEvent.click(nextBtn)
    expect(setPage).toHaveBeenCalledWith(2)
  })

  it('disables Next on last page and Prev calls setPage(page-1)', async () => {
    const { setPage } = setupMock({
      page: 3,
      pagination: { page: 3, page_size: 10, total_pages: 3, total_entries: 25 },
    })
    renderWithRouter()

    const prevBtn = screen.getByRole('button', { name: '‹ Prev' })
    const nextBtn = screen.getByRole('button', { name: 'Next ›' })

    expect(prevBtn).toBeEnabled()
    expect(nextBtn).toBeDisabled()

    await userEvent.click(prevBtn)
    expect(setPage).toHaveBeenCalledWith(2)
  })
})
