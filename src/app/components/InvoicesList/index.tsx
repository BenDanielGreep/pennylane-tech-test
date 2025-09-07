import { useApi } from 'api'
import { Invoice } from 'types'
import { useEffect, useCallback, useState } from 'react'
import { calcInvoiceTotals } from 'utils/invoiceTotals'
import { formatCurrency } from 'utils/currency'
import { Link } from 'react-router-dom'
import PageHeader from '../PageHeader'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices()
    setInvoicesList(data.invoices)
  }, [api])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  return (
    <div className="py-3 py-md-4">
      <PageHeader
        title="Invoices Dashboard"
        subtitle="Manage and track your invoices"
        actions={
          <Link to="/invoice/create" className="btn btn-primary">
            <span className="d-none d-sm-inline">New Invoice</span>
          </Link>
        }
      />

      <div className="row">
        <div className="col">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-2 py-md-3 px-3 px-md-4 small">
                        Id
                      </th>
                      <th className="border-0 py-2 py-md-3 px-2 small">
                        Customer
                      </th>
                      <th className="border-0 py-2 py-md-3 px-2 small d-none d-lg-table-cell">
                        Address
                      </th>
                      <th className="border-0 py-2 py-md-3 px-2 text-end small">
                        Total
                      </th>
                      <th className="border-0 py-2 py-md-3 px-2 text-end small d-none d-md-table-cell">
                        Tax
                      </th>
                      <th className="border-0 py-2 py-md-3 px-2 text-center small d-none d-sm-table-cell">
                        Status
                      </th>
                      <th className="border-0 py-2 py-md-3 px-2 small d-none d-xl-table-cell">
                        Date
                      </th>
                      <th className="border-0 py-2 py-md-3 px-2 small d-none d-xl-table-cell">
                        Deadline
                      </th>
                      <th className="border-0 py-2 py-md-3 px-2 small">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesList?.map((invoice) => {
                      const { total, tax } = calcInvoiceTotals(invoice)
                      const isPaid = invoice.paid
                      return (
                        <tr key={invoice.id} className="border-bottom">
                          <td className="py-2 py-md-3 px-3 px-md-4 fw-medium small">
                            {invoice.id}
                          </td>
                          <td className="py-2 py-md-3 px-2">
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
                          <td className="py-2 py-md-3 px-2 text-muted small d-none d-lg-table-cell">
                            {invoice.customer?.address},{' '}
                            {invoice.customer?.zip_code}{' '}
                            {invoice.customer?.city}
                          </td>
                          <td className="py-2 py-md-3 px-2 text-end fw-bold small">
                            {formatCurrency(invoice.total ?? total)}
                            <div
                              className="d-md-none text-muted"
                              style={{ fontSize: '0.7rem' }}
                            >
                              Tax: {formatCurrency(invoice.tax ?? tax)}
                            </div>
                          </td>
                          <td className="py-2 py-md-3 px-2 text-end small d-none d-md-table-cell">
                            {formatCurrency(invoice.tax ?? tax)}
                          </td>
                          <td className="py-2 py-md-3 px-2 text-center d-none d-sm-table-cell">
                            <div className="d-flex flex-column gap-1">
                              <span
                                className={`badge badge-sm ${
                                  isPaid ? 'bg-primary' : 'bg-warning'
                                }`}
                              >
                                {isPaid ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 py-md-3 px-2 small d-none d-xl-table-cell">
                            {invoice.date}
                          </td>
                          <td className="py-2 py-md-3 px-2 small d-none d-xl-table-cell">
                            {invoice.deadline}
                          </td>
                          <td className="py-2 py-md-3 px-2 small">
                            <div className="d-flex gap-1">
                              <Link
                                to={`/invoice/${invoice.id}`}
                                className="btn btn-sm btn-secondary"
                              >
                                View invoice
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicesList
