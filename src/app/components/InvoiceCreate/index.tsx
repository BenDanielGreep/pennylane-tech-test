import React from 'react'
import CustomerAutocomplete from '../InvoiceFields/CustomerAutocomplete'
import ProductAutocomplete from '../InvoiceFields/ProductAutocomplete'
import PageHeader from '../PageHeader'
import { formatCurrency } from 'utils/currency'
import { useInvoiceCreation } from '../../../hooks/useInvoiceCreation'

const InvoiceCreate = () => {
  const {
    form,
    creating,
    error,
    totals,
    updateCustomer,
    updateDate,
    updateDeadline,
    addLineItem,
    updateLineQuantity,
    removeLineItem,
    submitInvoice,
    cancelCreation,
  } = useInvoiceCreation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitInvoice()
  }

  return (
    <div className="py-3 py-md-4">
      <PageHeader
        title="Create New Invoice"
        actions={
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={cancelCreation}
          >
            Cancel
          </button>
        }
      />

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
                    onChange={updateCustomer}
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
                      onChange={(e) => updateDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Due Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.deadline}
                      onChange={(e) => updateDeadline(e.target.value)}
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
                  <span>{formatCurrency(totals.net)}</span>
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
