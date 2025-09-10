import { useEffect, useCallback, useState } from 'react'
import { useApi } from 'api'
import { Invoice } from 'types'
import { filterInvoices, InvoiceFilter } from 'utils/invoiceFilters'

export const useInvoicesList = () => {
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

  return {
    invoicesList,
    activeTab,
    setActiveTab,
    fetchInvoices,
    filteredInvoices,
  }
}
