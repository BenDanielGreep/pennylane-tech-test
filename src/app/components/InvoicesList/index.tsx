import { Link } from 'react-router-dom'
import PageHeader from '../PageHeader'
import Tabs from '../Tabs'
import InvoiceTable from '../InvoiceTable'
import { getInvoiceCount, type InvoiceFilter } from 'utils/invoiceFilters'
import { useInvoicesList } from 'hooks/useInvoicesList'
import CustomerAutocomplete from 'app/components/InvoiceCreate/CustomerAutocomplete'
import { useState } from 'react'
import { type Customer } from 'types'
import SortBy from '../SortBy/SortBy'
import DateRangeFilter from '../DateRangeFilter/DateRangeFilter'

const InvoicesList = (): React.ReactElement => {
  const {
    invoicesList,
    activeTab,
    setActiveTab,
    filteredInvoices,
    page,
    setPage,
    pagination,
    setCustomerId,
    toggleSort,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useInvoicesList()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  )

  const tabs = [
    {
      id: 'all',
      label: 'All Invoices',
      count: getInvoiceCount(invoicesList, 'all'),
      content: <InvoiceTable invoices={filteredInvoices} />,
    },
    {
      id: 'open',
      label: 'Open Invoices',
      count: getInvoiceCount(invoicesList, 'open'),
      content: <InvoiceTable invoices={filteredInvoices} />,
    },
    {
      id: 'past',
      label: 'Past Invoices',
      count: getInvoiceCount(invoicesList, 'past'),
      content: <InvoiceTable invoices={filteredInvoices} />,
    },
  ]

  return (
    <div className="py-3 py-md-4">
      <PageHeader
        title="Invoices Dashboard"
        actions={
          <Link to="/invoice/create" className="btn btn-primary">
            <span className="d-none d-sm-inline">New Invoice</span>
          </Link>
        }
      />

      <div className="d-flex col">
        <div className="row">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-4 gap-4">
            <div className="d-flex row justify-content-start flex-nowrap align-items-center">
              <div className="w-auto mb-2">
                <p className="small text-muted mb-1">Filter by customer:</p>
                <CustomerAutocomplete
                  value={selectedCustomer}
                  onChange={(customer) => {
                    setSelectedCustomer(customer)
                    setCustomerId(customer ? customer.id : null)
                  }}
                />
              </div>
              {selectedCustomer && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setSelectedCustomer(null)
                    setCustomerId(null)
                  }}
                >
                  Clear
                </button>
              )}
              <DateRangeFilter
                start={startDate}
                end={endDate}
                onChange={(s, e) => {
                  setStartDate(s)
                  setEndDate(e)
                  setPage(1)
                }}
              />
            </div>
            <SortBy toggleSort={toggleSort} />
          </div>

          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as InvoiceFilter)}
          />
          {pagination && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">
                Page {pagination.page} of {pagination.total_pages} •{' '}
                {pagination.total_entries} total
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                >
                  ‹ Prev
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setPage(
                      pagination.page < pagination.total_pages ? page + 1 : page
                    )
                  }
                  disabled={pagination.page >= pagination.total_pages}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoicesList
