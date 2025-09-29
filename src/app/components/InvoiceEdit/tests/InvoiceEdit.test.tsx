import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

const mockPutInvoice = jest.fn(async () => ({ data: { id: 321 } }))

jest.mock('api', () => {
  const { invoiceEditFixture } = require('test/fixtures/invoices')
  return {
    useApi: () => ({
      getInvoice: async () => ({ data: invoiceEditFixture }),
      putInvoice: mockPutInvoice,
    }),
  }
})

// eslint-disable-next-line import/first
import InvoiceEdit from '../index'

describe('InvoiceEdit Save Changes', () => {
  beforeEach(() => {
    mockPutInvoice.mockClear()
  })
  it('renders existing invoice line and summary totals', async () => {
    render(
      <MemoryRouter initialEntries={['/invoice/321/edit']}>
        <Routes>
          <Route path="/invoice/:id/edit" element={<InvoiceEdit />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() =>
      expect(screen.queryByText('Loading …')).not.toBeInTheDocument()
    )

    await screen.findByText('Edit Invoice #321')

    await screen.findByText('Audi S5')

    const qty = await screen.findByDisplayValue('3')
    expect(qty).toBeInTheDocument()

    expect(screen.getAllByText('$75,000.00').length).toBeGreaterThanOrEqual(1)
    screen.getByText('Net (Excl Tax):')
    screen.getByText('$62,499.99')
    screen.getByText('Tax (VAT):')
    screen.getByText('$12,500.01')
    screen.getAllByText('$75,000.00')
  })
  it("calls putInvoice with updated line when 'Save Changes' clicked", async () => {
    render(
      <MemoryRouter initialEntries={['/invoice/321/edit']}>
        <Routes>
          <Route path="/invoice/:id/edit" element={<InvoiceEdit />} />
          <Route path="/invoice/:id" element={<div>Show Page</div>} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() =>
      expect(screen.queryByText('Loading …')).not.toBeInTheDocument()
    )

    await screen.findByText('Edit Invoice #321')

    await screen.findByText('Audi S5')

    const qtyInput = (await screen.findByDisplayValue('3')) as HTMLInputElement
    await userEvent.clear(qtyInput)
    await userEvent.type(qtyInput, '2')
    expect(qtyInput.value).toBe('2')

    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => expect(mockPutInvoice).toHaveBeenCalledTimes(1))
    const call = (mockPutInvoice.mock.calls[0] || []) as any
    const paramsArg = call[0]
    const payloadArg = call[1]
    expect(paramsArg).toEqual({ id: 321 })
    const sent = payloadArg.invoice
    expect(sent.customer_id).toBe(22)
    const line = sent.invoice_lines_attributes[0]
    expect(line.product_id).toBe(5)
    expect(line.quantity).toBe(2)
    expect(line.label).toBe('Audi S5')

    expect(line.price).toBe('50000.00')
    expect(line.tax).toBe('10000.00')
  })
})
