import { useApi } from 'api'
import { Invoice } from 'types'
import { useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../PageHeader'
import Tabs from '../Tabs'
import InvoiceTable from '../InvoiceTable'
import {
  filterInvoices,
  getInvoiceCount,
  type InvoiceFilter,
} from 'utils/invoiceFilters'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const [activeTab, setActiveTab] = useState<InvoiceFilter>('all')

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices()
    setInvoicesList(data.invoices)
  }, [api])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const filteredInvoices = filterInvoices(invoicesList, activeTab)

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

      <div className="row">
        <div className="col">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as InvoiceFilter)}
          />
        </div>
      </div>
    </div>
  )
}

export default InvoicesList
