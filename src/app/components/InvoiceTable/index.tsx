import { Invoice } from 'types'
import { calcInvoiceTotals } from 'utils/invoiceTotals'
import { formatCurrency } from 'utils/currency'
import { Link } from 'react-router-dom'
import { convertDate } from 'utils/dateConverter'

interface InvoiceTableProps {
  invoices: Invoice[]
}

const InvoiceTable = ({ invoices }: InvoiceTableProps) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-secondary">
              <tr>
                <th className="border-0 py-2 py-md-3 px-3 small d-none d-md-table-cell">
                  Date
                </th>
                <th className="border-0 py-2 py-md-3 px-3 small d-none d-md-table-cell">
                  Deadline
                </th>
                <th className="border-0 py-2 py-md-3 px-3 small w-25">
                  Customer
                </th>
                <th className="border-0 py-2 py-md-3 px-3 small">ID</th>
                <th className="border-0 py-2 py-md-3 px-3 text-end small">
                  Total
                </th>
                <th className="border-0 py-2 py-md-3 px-3 text-center small d-none d-sm-table-cell">
                  Status
                </th>
                <th className="border-0 py-2 py-md-3 px-3 small">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => {
                const computed = calcInvoiceTotals(invoice) || {
                  total: 0,
                  tax: 0,
                }
                const { total } = computed
                const isPaid = invoice.paid
                const sanitisedDate = convertDate(invoice.date)
                const effectiveTotal = Number(invoice.total ?? total)
                return (
                  <tr key={invoice.id} className="border-bottom">
                    <td className="py-2 py-md-3 px-3 small d-none d-md-table-cell">
                      {sanitisedDate}
                    </td>
                    <td className="py-2 py-md-3 px-3 small d-none d-md-table-cell">
                      {convertDate(invoice.deadline)}
                    </td>
                    <td className="py-2 py-md-3 px-3">
                      <div className="small fw-medium">
                        {invoice.customer?.first_name}{' '}
                        {invoice.customer?.last_name}
                      </div>
                      <div
                        className="d-lg-none text-muted"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {invoice.customer?.city}
                      </div>
                    </td>
                    <td className="py-2 py-md-3 px-3 fw-medium small">
                      {invoice.id}
                    </td>
                    <td className="py-2 py-md-3 px-3 text-end fw-bold small">
                      {formatCurrency(effectiveTotal)}
                    </td>
                    <td className="py-2 py-md-3 px-3 text-center d-none d-sm-table-cell">
                      <div className="d-flex flex-column gap-1 align-items-center">
                        {invoice.finalized && !invoice.paid && (
                          <span className="badge badge-sm bg-secondary">
                            Finalized
                          </span>
                        )}
                        {isPaid && (
                          <span className="badge badge-sm bg-primary">
                            Paid
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 py-md-3 px-3 small">
                      <div className="d-flex gap-1">
                        <Link
                          to={`/invoice/${invoice.id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-muted text-center py-4">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InvoiceTable
