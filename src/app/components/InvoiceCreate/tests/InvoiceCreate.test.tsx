import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import InvoiceCreate from '../index'

jest.mock('api', () => ({
  useApi: () => ({
    postInvoices: jest.fn().mockResolvedValue({ data: { id: 1 } }),
  }),
}))

const mockHook = jest.fn()
jest.mock('../../../../hooks/useInvoiceCreation', () => ({
  useInvoiceCreation: () => mockHook(),
}))

describe('InvoiceCreate', () => {
  beforeEach(() => {
    mockHook.mockReset()
  })

  const baseState = {
    form: {
      customer: null,
      customer_id: null,
      date: '2024-01-01',
      deadline: '2024-01-10',
      invoice_lines: [],
    },
    creating: false,
    error: null,
    totals: { net: 0, tax: 0, total: 0 },
    updateCustomer: jest.fn(),
    updateDate: jest.fn(),
    updateDeadline: jest.fn(),
    addLineItem: jest.fn(),
    updateLineQuantity: jest.fn(),
    removeLineItem: jest.fn(),
    submitInvoice: jest.fn(),
    cancelCreation: jest.fn(),
  }

  it('renders core form sections and disabled submit initially', () => {
    mockHook.mockReturnValue(baseState)

    render(
      <MemoryRouter>
        <InvoiceCreate />
      </MemoryRouter>
    )

    expect(screen.getByText('Create New Invoice')).toBeInTheDocument()
    expect(screen.getByText('Customer *')).toBeInTheDocument()
    expect(screen.getByText('Invoice Date *')).toBeInTheDocument()
    expect(screen.getByText('Due Date *')).toBeInTheDocument()
    expect(screen.getByText('Add Products')).toBeInTheDocument()
    expect(screen.getByText(/No products added yet/i)).toBeInTheDocument()
    expect(screen.getByText('Invoice Summary')).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', { name: /create invoice/i })
    expect(submitBtn).toBeDisabled()
  })

  it('enables submit when customer and at least one line item exist', () => {
    mockHook.mockReturnValue({
      ...baseState,
      form: {
        ...baseState.form,
        customer: {
          id: 1,
          first_name: 'Alice',
          last_name: 'Jones',
          address: '',
          zip_code: '',
          city: '',
          country: '',
          country_code: '',
        },
        customer_id: 1,
        invoice_lines: [
          {
            id: 'line-1',
            product_id: 10,
            product: {
              id: 10,
              unit_price: '50.00',
              vat_rate: '20',
              label: 'Prod A',
              unit: 'piece',
            },
            quantity: 2,
            label: 'Prod A',
            vat_rate: '20',
            price: '100.00',
            tax: '20.00',
          },
        ],
      },
      totals: { net: 100, tax: 20, total: 120 },
    })

    render(
      <MemoryRouter>
        <InvoiceCreate />
      </MemoryRouter>
    )

    expect(screen.getByText('Prod A')).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', { name: /create invoice/i })
    expect(submitBtn).not.toBeDisabled()
  })
})
