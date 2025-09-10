import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from 'api'
import { calcInvoiceTotals } from 'utils/invoiceTotals'

interface InvoiceLineItem {
  id: string
  product_id: number
  product: any
  quantity: number
  label: string
  vat_rate: string
  price: string
  tax: string
}

interface CreateInvoiceForm {
  customer_id: number | null
  customer: any
  date: string
  deadline: string
  invoice_lines: InvoiceLineItem[]
}

export const useInvoiceCreation = () => {
  const api = useApi()
  const navigate = useNavigate()

  const [form, setForm] = useState<CreateInvoiceForm>({
    customer_id: null,
    customer: null,
    date: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    invoice_lines: [],
  })

  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const removeLineItem = useCallback((lineId: string) => {
    setForm((prev) => ({
      ...prev,
      invoice_lines: prev.invoice_lines.filter((line) => line.id !== lineId),
    }))
  }, [])

  const addLineItem = useCallback((product: any) => {
    const unitPrice = parseFloat(product.unit_price || '0')
    const vatRate = parseFloat(product.vat_rate || '0')
    const quantity = 1
    const price = (unitPrice * quantity).toFixed(2)
    const tax = ((unitPrice * quantity * vatRate) / 100).toFixed(2)

    const newLine: InvoiceLineItem = {
      id: `temp-${Date.now()}-${Math.random()}`,
      product_id: product.id,
      product: product,
      quantity: quantity,
      label: product.label,
      vat_rate: product.vat_rate,
      price: price,
      tax: tax,
    }

    setForm((prev) => ({
      ...prev,
      invoice_lines: [...prev.invoice_lines, newLine],
    }))
  }, [])

  const updateLineQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        removeLineItem(lineId)
        return
      }

      setForm((prev) => ({
        ...prev,
        invoice_lines: prev.invoice_lines.map((line) => {
          if (line.id === lineId) {
            const unitPrice = parseFloat(line.product.unit_price || '0')
            const vatRate = parseFloat(line.vat_rate || '0')
            const price = (unitPrice * quantity).toFixed(2)
            const tax = ((unitPrice * quantity * vatRate) / 100).toFixed(2)

            return {
              ...line,
              quantity,
              price,
              tax,
            }
          }
          return line
        }),
      }))
    },
    [removeLineItem]
  )

  const updateCustomer = useCallback((customer: any) => {
    setForm((prev) => ({
      ...prev,
      customer_id: customer?.id || null,
      customer: customer,
    }))
  }, [])

  const updateDate = useCallback((date: string) => {
    setForm((prev) => ({ ...prev, date }))
  }, [])

  const updateDeadline = useCallback((deadline: string) => {
    setForm((prev) => ({ ...prev, deadline }))
  }, [])

  const totals = calcInvoiceTotals({
    total: 0,
    tax: 0,
    invoice_lines: form.invoice_lines,
  } as any) || { total: 0, tax: 0 }
  const net = totals.total - totals.tax

  const validateForm = useCallback((): string | null => {
    if (!form.customer_id) {
      return 'Please select a customer'
    }

    if (form.invoice_lines.length === 0) {
      return 'Please add at least one product'
    }

    return null
  }, [form])

  const submitInvoice = useCallback(async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setCreating(true)
    setError(null)

    try {
      const invoiceData = {
        customer_id: form.customer_id!,
        date: form.date,
        deadline: form.deadline,
        finalized: false,
        paid: false,
        invoice_lines_attributes: form.invoice_lines.map((line) => ({
          product_id: line.product_id,
          quantity: line.quantity,
          label: line.label,
          unit: line.product.unit as 'hour' | 'day' | 'piece' | undefined,
          vat_rate: line.vat_rate as '0' | '5.5' | '10' | '20' | undefined,
          price: line.price,
        })),
      }

      const { data } = await api.postInvoices(null, { invoice: invoiceData })

      navigate(`/invoice/${data.id}`)
    } catch (e: any) {
      setError(e?.message || 'Failed to create invoice')
    } finally {
      setCreating(false)
    }
  }, [api, form, navigate, validateForm])

  const cancelCreation = useCallback(() => {
    navigate('/')
  }, [navigate])

  return {
    form,
    creating,
    error,
    totals: { total: totals.total, tax: totals.tax, net },
    updateCustomer,
    updateDate,
    updateDeadline,
    addLineItem,
    updateLineQuantity,
    removeLineItem,
    submitInvoice,
    cancelCreation,
    validateForm,
  }
}
