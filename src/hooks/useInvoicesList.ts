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

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices({ page, per_page: pageSize })
    setInvoicesList(data.invoices)
    setPagination(data.pagination)
  }, [api, page, pageSize])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const setActiveTab = useCallback((tab: InvoiceFilter) => {
    setActiveTabState(tab)
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
  }
}
