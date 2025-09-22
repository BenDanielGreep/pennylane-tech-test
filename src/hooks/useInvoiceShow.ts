import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from 'api'
import { Invoice } from 'types'
import { calcInvoiceTotals } from 'utils/invoiceTotals'

export const useInvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
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
      navigate('/')
    } catch (e: any) {
      setError(e?.message || 'Failed to delete invoice')
      setUpdating(false)
    }
  }

  const totals = invoice ? calcInvoiceTotals(invoice) : { total: 0, tax: 0 }
  const net = totals.total - totals.tax

  return {
    invoice,
    loading,
    updating,
    error,
    fetchInvoice,
    markPaid,
    finalizeInvoice,
    deleteInvoice,
    totals,
    net,
  }
}
