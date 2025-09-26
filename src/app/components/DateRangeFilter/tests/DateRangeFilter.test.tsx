import { render, screen, fireEvent } from '@testing-library/react'
import DateRangeFilter from '../DateRangeFilter'
import { fn } from 'numeral'

describe('DateRangeFilter', () => {
  it('renders inputs and apply button', () => {
    render(<DateRangeFilter start={null} end={null} onChange={jest.fn()} />)
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument()
  })

  it('applies start and end dates', () => {
    const mockOnChange = jest.fn()
    render(<DateRangeFilter start={null} end={null} onChange={mockOnChange} />)
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2025-01-01' },
    })
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2025-02-01' },
    })
    fireEvent.click(screen.getByRole('button', { name: /apply/i }))
    expect(mockOnChange).toHaveBeenCalledWith('2025-01-01', '2025-02-01')
  })

  it('clears dates', () => {
    const mockOnChange = jest.fn()
    render(
      <DateRangeFilter
        start={'2025-01-01'}
        end={'2025-01-15'}
        onChange={mockOnChange}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(mockOnChange).toHaveBeenCalledWith(null, null)
  })

  it('alerts when end < start and does not call onChange', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const mockOnChange = jest.fn()
    render(<DateRangeFilter start={null} end={null} onChange={mockOnChange} />)
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2025-02-10' },
    })
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2025-02-01' },
    })
    fireEvent.click(screen.getByRole('button', { name: /apply/i }))
    expect(alertSpy).toHaveBeenCalled()
    expect(mockOnChange).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })
})
