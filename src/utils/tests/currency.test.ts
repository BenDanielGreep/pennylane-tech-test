import { formatCurrency } from 'utils/currency'

describe('Currency formatting', () => {
  it('formats valid numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
    expect(formatCurrency('1234.56')).toBe('$1,234.56')
  })
  it('handles large numbers correctly', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    expect(formatCurrency(1000000000)).toBe('$1,000,000,000.00')
  })
  it('handles invalid properties', () => {
    expect(formatCurrency(null)).toBe('-')
    expect(formatCurrency(undefined)).toBe('-')
    expect(formatCurrency('invalid')).toBe('-')
  })
})
