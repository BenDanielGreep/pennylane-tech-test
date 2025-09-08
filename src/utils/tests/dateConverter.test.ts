import { convertDate } from 'utils/dateConverter'

describe('convertDate', () => {
  it('should return formatted date for valid date string', () => {
    expect(convertDate('2023-10-05')).toBe('Oct 5, 2023')
    expect(convertDate('2000-01-01')).toBe('Jan 1, 2000')
  })

  it('should return "-" for null or undefined input', () => {
    expect(convertDate(null)).toBe('-')
    expect(convertDate(undefined)).toBe('-')
  })

  it('should return "-" for invalid date strings', () => {
    expect(convertDate('invalid-date')).toBe('-')
    expect(convertDate('2023-13-01')).toBe('-') // Invalid month
    expect(convertDate('2023-00-10')).toBe('-') // Invalid month
    expect(convertDate('2023-02-30')).toBe('-') // Invalid day
  })
})
