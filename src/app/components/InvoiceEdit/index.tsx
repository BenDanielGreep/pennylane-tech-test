import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../PageHeader'
import CustomerAutocomplete from '../InvoiceCreate/CustomerAutocomplete'
import ProductAutocomplete from '../InvoiceCreate/ProductAutocomplete'
import { useApi } from 'api'
import { formatCurrency } from 'utils/currency'
import { calcInvoiceTotals } from 'utils/invoiceTotals'
import { Invoice } from 'types'

type InvoiceLineItem = {
  id: string | number
  invoice_line_id?: number
  product_id: number
  product: any
  quantity: number
  label: string
  vat_rate: string
  price: string
  tax: string
  _destroy?: boolean
}

const InvoiceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [customer, setCustomer] = useState<any>(null)
  const [date, setDate] = useState<string>('')
  const [deadline, setDeadline] = useState<string>('')
  const [lines, setLines] = useState<InvoiceLineItem[]>([])

  useEffect(() => {
    const fetch = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.getInvoice(id)
        const inv = data as unknown as Invoice
        setCustomer(inv.customer || null)
        setDate(inv.date || new Date().toISOString().split('T')[0])
        setDeadline(
          inv.deadline ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0]
        )
        setLines(
          (inv.invoice_lines || []).map((l) => ({
            id: l.id,
            invoice_line_id: l.id,
            product_id: l.product_id,
            product: l.product,
            quantity: l.quantity,
            label: l.label,
            vat_rate: String(l.vat_rate ?? '0'),
            price: String(l.price ?? '0'),
            tax: String(l.tax ?? '0'),
          }))
        )
      } catch (e: any) {
        setError(e?.message || 'Failed to load invoice')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [api, id])

  const addLineItem = useCallback((product: any) => {
    const unitPrice = parseFloat(product.unit_price || '0')
    const vatRate = parseFloat(product.vat_rate || '0')
    const quantity = 1
    const price = (unitPrice * quantity).toFixed(2)
    const tax = ((unitPrice * quantity * vatRate) / 100).toFixed(2)
    const newLine: InvoiceLineItem = {
      id: `temp-${Date.now()}-${Math.random()}`,
      product_id: product.id,
      product,
      quantity,
      label: product.label,
      vat_rate: product.vat_rate,
      price,
      tax,
    }
    setLines((prev) => [...prev, newLine])
  }, [])

  const updateLineQuantity = useCallback(
    (lineId: string | number, quantity: number) => {
      setLines((prev) =>
        prev.map((line) => {
          if (line.id === lineId) {
            if (quantity <= 0) {
              return {
                ...line,
                _destroy: true,
                quantity: 0,
                price: '0',
                tax: '0',
              }
            }
            const unitPrice = parseFloat(line.product.unit_price || '0')
            const vatRate = parseFloat(line.vat_rate || '0')
            const price = (unitPrice * quantity).toFixed(2)
            const tax = ((unitPrice * quantity * vatRate) / 100).toFixed(2)
            return { ...line, quantity, price, tax }
          }
          return line
        })
      )
    },
    []
  )

  const removeLineItem = useCallback((lineId: string | number) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === lineId
          ? { ...line, _destroy: true, quantity: 0, price: '0', tax: '0' }
          : line
      )
    )
  }, [])

  const activeLines = useMemo(() => lines.filter((l) => !l._destroy), [lines])

  const totals = useMemo(() => {
    const calcInput: any = { invoice_lines: activeLines }
    return calcInvoiceTotals(calcInput) || { total: 0, tax: 0 }
  }, [activeLines])

  const net = totals.total - totals.tax

  const onSave = useCallback(async () => {
    if (!id) return
    if (!customer?.id) {
      setError('Please select a customer')
      return
    }
    if (activeLines.length === 0) {
      setError('Please add at least one product')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        id: Number(id),
        customer_id: customer.id,
        date,
        deadline,
        invoice_lines_attributes: lines.map((line) => {
          const base: any = {
            product_id: line.product_id,
            quantity: line.quantity,
            label: line.label,
            unit: line.product.unit as 'hour' | 'day' | 'piece' | undefined,
            vat_rate: line.vat_rate as '0' | '5.5' | '10' | '20' | undefined,
            price: line.price,
            tax: line.tax,
          }
          if (line.invoice_line_id) base.id = line.invoice_line_id
          if (line._destroy) base._destroy = true
          return base
        }),
      }
      const { data } = await api.putInvoice(
        { id: Number(id) },
        { invoice: payload }
      )
      navigate(`/invoice/${data.id}`)
    } catch (e: any) {
      setError(e?.message || 'Failed to save invoice')
    } finally {
      setSaving(false)
    }
  }, [
    activeLines.length,
    api,
    customer?.id,
    date,
    deadline,
    id,
    lines,
    navigate,
  ])

  const onCancel = useCallback(() => {
    if (id) navigate(`/invoice/${id}`)
  }, [id, navigate])

  return (
    <div className="py-3 py-md-4">
      <PageHeader
        title={id ? `Edit Invoice #${id}` : 'Edit Invoice'}
        actions={
          <>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </>
        }
      />

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-muted">Loading …</div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Invoice Details</h5>
                <div className="mb-3">
                  <label className="form-label">Customer *</label>
                  <CustomerAutocomplete
                    value={customer}
                    onChange={setCustomer}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Invoice Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Due Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body">
                <h5 className="card-title mb-3">Edit Products</h5>
                <div className="mb-3">
                  <label className="form-label">Search Products</label>
                  <ProductAutocomplete
                    value={null}
                    onChange={(product) => product && addLineItem(product)}
                  />
                </div>

                {activeLines.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead className="bg-light">
                        <tr>
                          <th>Product</th>
                          <th className="text-center">Qty</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-end">VAT %</th>
                          <th className="text-end">Total</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeLines.map((line) => {
                          const unitPrice = parseFloat(
                            line.product.unit_price || '0'
                          )
                          return (
                            <tr key={line.id}>
                              <td>{line.label}</td>
                              <td className="text-center">
                                <input
                                  type="number"
                                  className="form-control form-control-sm text-center"
                                  style={{ width: '80px' }}
                                  value={line.quantity}
                                  min="1"
                                  onChange={(e) =>
                                    updateLineQuantity(
                                      line.id,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                />
                              </td>
                              <td className="text-end">
                                {formatCurrency(unitPrice)}
                              </td>
                              <td className="text-end">{line.vat_rate}%</td>
                              <td className="text-end fw-medium">
                                {formatCurrency(line.price)}
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeLineItem(line.id)}
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-muted">
                    No products — add some above.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0 rounded-3 position-sticky"
              style={{ top: '1rem' }}
            >
              <div className="card-body">
                <h5 className="card-title mb-3">Invoice Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Net (Excl Tax):</span>
                  <span>{formatCurrency(net)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (VAT):</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total (Incl):</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceEdit
