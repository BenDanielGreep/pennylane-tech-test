import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from 'api'
import CustomerAutocomplete from '../CustomerAutocomplete'
import ProductAutocomplete from '../ProductAutocomplete'
import { formatCurrency } from 'utils/currency'
import { calcInvoiceTotals } from 'utils/invoiceTotals'

interface InvoiceLineItem {
  id: string
  product_id: number
  product: any
  quantity: number
  label: string
  vat_rate: string
  price: string
  tax: string
}

interface CreateInvoiceForm {
  customer_id: number | null
  customer: any
  date: string
  deadline: string
  invoice_lines: InvoiceLineItem[]
}

const InvoiceCreate = () => {
  const api = useApi()
  const navigate = useNavigate()

  const [form, setForm] = useState<CreateInvoiceForm>({
    customer_id: null,
    customer: null,
    date: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    invoice_lines: [],
  })

  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addLineItem = (product: any) => {
    const unitPrice = parseFloat(product.unit_price || '0')
    const vatRate = parseFloat(product.vat_rate || '0')
    const quantity = 1
    const price = (unitPrice * quantity).toFixed(2)
    const tax = ((unitPrice * quantity * vatRate) / 100).toFixed(2)

    const newLine: InvoiceLineItem = {
      id: `temp-${Date.now()}-${Math.random()}`,
      product_id: product.id,
      product: product,
      quantity: quantity,
      label: product.label,
      vat_rate: product.vat_rate,
      price: price,
      tax: tax,
    }

    setForm((prev) => ({
      ...prev,
      invoice_lines: [...prev.invoice_lines, newLine],
    }))
  }

  const updateLineQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeLineItem(lineId)
      return
    }

    setForm((prev) => ({
      ...prev,
      invoice_lines: prev.invoice_lines.map((line) => {
        if (line.id === lineId) {
          const unitPrice = parseFloat(line.product.unit_price || '0')
          const vatRate = parseFloat(line.vat_rate || '0')
          const price = (unitPrice * quantity).toFixed(2)
          const tax = ((unitPrice * quantity * vatRate) / 100).toFixed(2)

          return {
            ...line,
            quantity,
            price,
            tax,
          }
        }
        return line
      }),
    }))
  }

  const removeLineItem = (lineId: string) => {
    setForm((prev) => ({
      ...prev,
      invoice_lines: prev.invoice_lines.filter((line) => line.id !== lineId),
    }))
  }

  const totals = calcInvoiceTotals({
    total: null,
    tax: null,
    invoice_lines: form.invoice_lines,
  } as any)
  const net = totals.total - totals.tax

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!form.customer_id) {
        setError('Please select a customer')
        return
      }

      if (form.invoice_lines.length === 0) {
        setError('Please add at least one product')
        return
      }

      setCreating(true)
      setError(null)

      try {
        const invoiceData = {
          customer_id: form.customer_id,
          date: form.date,
          deadline: form.deadline,
          finalized: false,
          paid: false,
          invoice_lines_attributes: form.invoice_lines.map((line) => ({
            product_id: line.product_id,
            quantity: line.quantity,
            label: line.label,
            unit: line.product.unit as 'hour' | 'day' | 'piece' | undefined,
            vat_rate: line.vat_rate as '0' | '5.5' | '10' | '20' | undefined,
            price: line.price,
          })),
        }

        const { data } = await api.postInvoices(null, { invoice: invoiceData })
        navigate(`/invoice/${data.id}`)
      } catch (e: any) {
        setError(e?.message || 'Failed to create invoice')
      } finally {
        setCreating(false)
      }
    },
    [api, form, navigate]
  )

  return (
    <div className="py-3 py-md-4">
      <div className="row mb-3 mb-md-4">
        <div className="col">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
            <div>
              <h1 className="h3 h2-md mb-1">Create New Invoice</h1>
              <p className="text-muted mb-0 small">
                Build a new invoice with customer details and products
              </p>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Invoice Details</h5>

                <div className="mb-3">
                  <label className="form-label">Customer *</label>
                  <CustomerAutocomplete
                    value={form.customer}
                    onChange={(customer) =>
                      setForm((prev) => ({
                        ...prev,
                        customer_id: customer?.id || null,
                        customer: customer,
                      }))
                    }
                  />
                  {form.customer && (
                    <div className="mt-2 p-2 bg-light rounded small">
                      <strong>
                        {form.customer.first_name} {form.customer.last_name}
                      </strong>
                      <br />
                      {form.customer.address}, {form.customer.zip_code}{' '}
                      {form.customer.city}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Invoice Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.date}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, date: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Due Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.deadline}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          deadline: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body">
                <h5 className="card-title mb-3">Add Products</h5>

                <div className="mb-3">
                  <label className="form-label">Search Products</label>
                  <ProductAutocomplete
                    value={null}
                    onChange={(product) => product && addLineItem(product)}
                  />
                </div>

                {form.invoice_lines.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead className="bg-light">
                        <tr>
                          <th>Product</th>
                          <th className="text-center">Qty</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-end">VAT %</th>
                          <th className="text-end">Total</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.invoice_lines.map((line) => (
                          <tr key={line.id}>
                            <td>{line.label}</td>
                            <td className="text-center">
                              <input
                                type="number"
                                className="form-control form-control-sm text-center"
                                style={{ width: '80px' }}
                                value={line.quantity}
                                min="1"
                                onChange={(e) =>
                                  updateLineQuantity(
                                    line.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                              />
                            </td>
                            <td className="text-end">
                              {formatCurrency(line.product.unit_price)}
                            </td>
                            <td className="text-end">{line.vat_rate}%</td>
                            <td className="text-end fw-medium">
                              {formatCurrency(line.price)}
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeLineItem(line.id)}
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {form.invoice_lines.length === 0 && (
                  <div className="text-center text-muted py-4">
                    <p>
                      No products added yet. Use the search above to add
                      products to your invoice.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0 rounded-3 position-sticky"
              style={{ top: '1rem' }}
            >
              <div className="card-body">
                <h5 className="card-title mb-3">Invoice Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span>Net (Excl Tax):</span>
                  <span>{formatCurrency(net)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (VAT):</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total (Incl):</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={
                      creating ||
                      !form.customer_id ||
                      form.invoice_lines.length === 0
                    }
                  >
                    {creating ? 'Creating Invoice...' : 'Create Invoice'}
                  </button>
                </div>

                {error && <div className="text-danger small mt-2">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default InvoiceCreate
