import { useEffect, useCallback, useState } from 'react'
import { useApi } from 'api'
import { Invoice } from 'types'
import { filterInvoices, InvoiceFilter } from 'utils/invoiceFilters'

interface PaginationInfo {
  page: number
  page_size: number
  total_pages: number
  total_entries: number
}

export const useInvoicesList = () => {
  const api = useApi()
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const [activeTab, setActiveTabState] = useState<InvoiceFilter>('all')
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [customerId, setCustomerIdState] = useState<number | null>(null)

  const fetchInvoices = useCallback(async () => {
    const params: any = { page, per_page: pageSize }
    if (customerId) {
      params.filter = JSON.stringify([
        { field: 'customer_id', operator: 'eq', value: customerId },
      ])
    }
    const { data } = await api.getInvoices(params)
    setInvoicesList(data.invoices)
    setPagination(data.pagination)
  }, [api, page, pageSize, customerId])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const setActiveTab = useCallback((tab: InvoiceFilter) => {
    setActiveTabState(tab)
    setPage(1)
  }, [])

  const setCustomerId = useCallback((id: number | null) => {
    setCustomerIdState(id)
    setPage(1)
  }, [])

  const filteredInvoices = filterInvoices(invoicesList, activeTab)

  return {
    invoicesList,
    activeTab,
    setActiveTab,
    fetchInvoices,
    filteredInvoices,
    page,
    setPage,
    pagination,
    pageSize,
    customerId,
    setCustomerId,
  }
}
