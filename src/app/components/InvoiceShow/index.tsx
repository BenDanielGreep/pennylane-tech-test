import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApi } from 'api'
import { Invoice } from 'types'
import { calcInvoiceTotals } from 'utils/invoiceTotals'
import { formatCurrency } from 'utils/currency'

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const api = useApi()
  const [invoice, setInvoice] = useState<Invoice>()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoice = useCallback(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    api
      .getInvoice(id)
      .then(({ data }) => setInvoice(data))
      .catch((e: any) => setError(e?.message || 'Failed to load invoice'))
      .finally(() => setLoading(false))
  }, [api, id])

  useEffect(() => {
    fetchInvoice()
  }, [fetchInvoice])

  const markPaid = async () => {
    if (!invoice || updating || invoice.paid) return
    setUpdating(true)
    setError(null)
    try {
      const { data } = await api.putInvoice(
        { id: invoice.id },
        { invoice: { id: invoice.id, paid: true } }
      )
      setInvoice(data)
    } catch (e: any) {
      setError(e?.message || 'Failed to mark as paid')
    } finally {
      setUpdating(false)
    }
  }

  const finalizeInvoice = async () => {
    if (!invoice || updating || invoice.finalized) return
    setUpdating(true)
    setError(null)
    try {
      const { data } = await api.putInvoice(
        { id: invoice.id },
        { invoice: { id: invoice.id, finalized: true } }
      )
      setInvoice(data)
    } catch (e: any) {
      setError(e?.message || 'Failed to finalize invoice')
    } finally {
      setUpdating(false)
    }
  }

  const deleteInvoice = async () => {
    if (!invoice || updating) return
    if (
      !window.confirm(
        'Are you sure you want to delete this invoice? This action cannot be undone.'
      )
    ) {
      return
    }
    setUpdating(true)
    setError(null)
    try {
      await api.deleteInvoice(invoice.id)
      window.location.href = '/'
    } catch (e: any) {
      setError(e?.message || 'Failed to delete invoice')
      setUpdating(false)
    }
  }

  const totals = invoice ? calcInvoiceTotals(invoice) : { total: 0, tax: 0 }
  const net = totals.total - totals.tax

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/" className="text-decoration-none">
          &larr; Back to invoices
        </Link>
      </div>
      {loading && <div className="text-muted">Loading invoice</div>}
      {error && !loading && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-light" onClick={fetchInvoice}>
            Retry
          </button>
        </div>
      )}
      {invoice && !loading && (
        <div className="row g-4">
          <div className="col-lg-4 d-flex flex-column gap-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Invoice #{invoice.id}</h5>
                <div className="mb-2 small">
                  <div>
                    <strong>Status:</strong>{' '}
                    {invoice.finalized
                      ? invoice.paid
                        ? 'Paid'
                        : 'Finalized'
                      : 'Draft'}
                  </div>
                  <div>
                    <strong>Date:</strong> {invoice.date || '—'}
                  </div>
                  <div>
                    <strong>Deadline:</strong> {invoice.deadline || '—'}
                  </div>
                </div>
                <div className="mb-3 small">
                  <div>
                    <strong>Net (Excl Tax):</strong> {formatCurrency(net)}
                  </div>
                  <div>
                    <strong>Tax (VAT):</strong> {formatCurrency(totals.tax)}
                  </div>
                  <div>
                    <strong>Total (Incl):</strong>{' '}
                    {formatCurrency(totals.total)}
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    disabled={invoice.paid || updating}
                    onClick={markPaid}
                  >
                    {invoice.paid
                      ? 'Paid'
                      : updating
                      ? 'Marking'
                      : 'Mark as Paid'}
                  </button>

                  <button
                    className="btn btn-warning btn-sm"
                    disabled={invoice.finalized || updating}
                    onClick={finalizeInvoice}
                  >
                    {invoice.finalized
                      ? 'Finalized'
                      : updating
                      ? 'Finalizing'
                      : 'Finalize Invoice'}
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    disabled={updating}
                    onClick={deleteInvoice}
                  >
                    {updating ? 'Deleting' : 'Delete Invoice'}
                  </button>
                </div>
                {updating && (
                  <span className="ms-2 spinner-border spinner-border-sm" />
                )}
                {error && !loading && !updating && (
                  <div className="text-danger small mt-2">{error}</div>
                )}
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="card-subtitle text-uppercase text-muted mb-3">
                  Customer
                </h6>
                {invoice.customer ? (
                  <div className="small">
                    <div className="fw-semibold">
                      {invoice.customer.first_name} {invoice.customer.last_name}
                    </div>
                    <div>{invoice.customer.address}</div>
                    <div>
                      {invoice.customer.zip_code} {invoice.customer.city}
                    </div>
                    <div>{invoice.customer.country}</div>
                    <div className="text-muted mt-2">
                      ID: {invoice.customer.id}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted small">No customer</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h6 className="card-subtitle text-uppercase text-muted mb-3">
                  Line Items
                </h6>
                {invoice.invoice_lines.length === 0 && (
                  <div className="text-muted small">No items</div>
                )}
                {invoice.invoice_lines.length > 0 && (
                  <div className="table-responsive mb-3">
                    <table className="table table-sm align-middle">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '40%' }}>Label</th>
                          <th className="text-end">Qty</th>
                          <th className="text-end">VAT%</th>
                          <th className="text-end">Price (Incl)</th>
                          <th className="text-end">Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.invoice_lines.map((line) => {
                          const price = Number(line.price ?? 0)
                          const tax = Number(line.tax ?? 0)
                          return (
                            <tr key={line.id}>
                              <td>{line.label}</td>
                              <td className="text-end">{line.quantity}</td>
                              <td className="text-end">{line.vat_rate}</td>
                              <td className="text-end">
                                {formatCurrency(price)}
                              </td>
                              <td className="text-end">
                                {formatCurrency(tax)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-auto small border-top pt-3">
                  <div className="d-flex justify-content-between">
                    <span>Net (Excl Tax)</span>
                    <span>{formatCurrency(net)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Tax (VAT)</span>
                    <span>{formatCurrency(totals.tax)}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-semibold">
                    <span>Total (Incl)</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceShow
