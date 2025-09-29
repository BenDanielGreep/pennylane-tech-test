import { Link, useNavigate } from 'react-router-dom'
import { formatCurrency } from 'utils/currency'
import PageHeader from '../PageHeader'
import { useInvoiceShow } from 'hooks/useInvoiceShow'

const InvoiceShow = () => {
  const navigate = useNavigate()
  const {
    invoice,
    loading,
    error,
    updating,
    totals,
    net,
    fetchInvoice,
    markPaid,
    finalizeInvoice,
    deleteInvoice,
  } = useInvoiceShow()

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="container py-4 pb-5 flex-grow-1">
        <PageHeader
          title={
            invoice ? `Viewing Invoice #${invoice.id}` : 'Loading Invoice...'
          }
          actions={
            <Link to="/" className="btn btn-outline-primary">
              View All Invoices
            </Link>
          }
        />
        {loading && <div className="text-muted">Loading invoice</div>}
        {error && !loading && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
          </div>
        )}
        {invoice && !loading && (
          <div
            className="card shadow border-0 mb-5"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <div className="card-body p-4 p-md-5">
              {/* Invoice Header */}
              <div className="row mb-5">
                <div className="col-md-6">
                  <h1 className="h2 fw-bold text-primary mb-1">INVOICE</h1>
                  <div className="text-muted">#{invoice.id}</div>
                </div>
                <div className="col-md-6 text-md-end">
                  <div className="mb-2">
                    <span
                      className={`badge ${
                        invoice.finalized
                          ? invoice.paid
                            ? 'bg-success'
                            : 'bg-transparent border border-success text-success'
                          : 'bg-secondary'
                      } fs-6 px-3 py-2`}
                    >
                      {invoice.finalized
                        ? invoice.paid
                          ? 'PAID'
                          : 'FINALIZED'
                        : 'DRAFT'}
                    </span>
                  </div>
                  <div className="small">
                    <div>
                      <strong>Date:</strong> {invoice.date || '—'}
                    </div>
                    <div>
                      <strong>Due:</strong> {invoice.deadline || '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="row mb-5">
                <div className="col-md-6">
                  <h6 className="text-uppercase text-muted mb-3 fw-semibold">
                    Bill To
                  </h6>
                  {invoice.customer ? (
                    <div>
                      <div className="fw-semibold fs-5 mb-2">
                        {invoice.customer.first_name}{' '}
                        {invoice.customer.last_name}
                      </div>
                      <div className="text-muted">
                        <div>{invoice.customer.address}</div>
                        <div>
                          {invoice.customer.zip_code} {invoice.customer.city}
                        </div>
                        <div>{invoice.customer.country}</div>
                      </div>
                      <div className="text-muted small mt-2">
                        Customer ID: {invoice.customer.id}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted">No customer information</div>
                  )}
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-5">
                <h6 className="text-uppercase text-muted mb-4 fw-semibold">
                  Items
                </h6>
                {invoice.invoice_lines.length === 0 && (
                  <div className="text-muted">No items</div>
                )}
                {invoice.invoice_lines.length > 0 && (
                  <div>
                    {invoice.invoice_lines.map((line) => {
                      const unitPrice =
                        Number(line.price ?? 0) / Number(line.quantity ?? 1)
                      const lineTotal = Number(line.price ?? 0)
                      const tax = Number(line.tax ?? 0)
                      const vatRate = Number(line.vat_rate ?? 0)
                      return (
                        <div
                          key={line.id}
                          className="d-flex justify-content-between align-items-start py-3 border-bottom"
                        >
                          <div className="flex-grow-1">
                            <div className="fw-semibold mb-1 fs-6">
                              {line.label}
                            </div>
                            <div className="text-muted small mb-1">
                              {line.quantity} × {formatCurrency(unitPrice)}{' '}
                              piece
                            </div>
                            <div className="text-muted small">
                              VAT: {vatRate}% • Tax: {formatCurrency(tax)}
                            </div>
                          </div>
                          <div className="fw-bold fs-5 ms-3">
                            {formatCurrency(lineTotal)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Totals Section */}
              <div className="row justify-content-end">
                <div className="col-md-5">
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between py-2">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(net)}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span>Tax:</span>
                      <span>{formatCurrency(totals.tax)}</span>
                    </div>
                    <div className="d-flex justify-content-between py-3 border-top">
                      <span className="fw-bold fs-5">Total:</span>
                      <span className="fw-bold fs-5 text-primary">
                        {formatCurrency(totals.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions - sticky */}
      {invoice && !loading && (
        <div
          className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-sm"
          style={{ zIndex: 1020 }}
        >
          <div className="container py-3">
            <div className="d-flex justify-content-center gap-5 flex-wrap">
              {!!invoice && !invoice.finalized && !invoice.paid && (
                <button
                  className="btn btn-outline-secondary px-5"
                  disabled={updating}
                  onClick={() => navigate(`/invoice/${invoice.id}/edit`)}
                >
                  Edit invoice
                </button>
              )}
              {!!invoice && !invoice.finalized && !invoice.paid && (
                <button
                  className="btn btn-outline-danger px-5"
                  disabled={updating}
                  onClick={deleteInvoice}
                >
                  {updating ? 'Deleting...' : 'Delete Invoice'}
                </button>
              )}
              <button
                className="btn btn-outline-primary px-5"
                disabled={invoice.finalized || updating}
                onClick={finalizeInvoice}
              >
                {invoice.finalized
                  ? 'Finalized'
                  : updating
                  ? 'Finalizing...'
                  : 'Finalize Invoice'}
              </button>
              <button
                className="btn btn-success px-5"
                disabled={invoice.paid || updating || !invoice.finalized}
                onClick={markPaid}
              >
                {invoice.paid
                  ? 'Paid'
                  : updating
                  ? 'Marking...'
                  : 'Mark as Paid'}
              </button>
              {updating && (
                <div className="d-flex align-items-center">
                  <span className="spinner-border spinner-border-sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceShow
