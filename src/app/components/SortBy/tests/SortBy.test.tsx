import { render, screen, fireEvent } from '@testing-library/react'
import SortBy from '../SortBy'

describe('SortBy', () => {
  it('renders correctly', () => {
    render(<SortBy toggleSort={jest.fn()} />)
    expect(screen.getByTestId('sortby-component')).toBeInTheDocument()
  })
  it('calls toggleSort with correct value on selection change', () => {
    const mockToggleSort = jest.fn()
    render(<SortBy toggleSort={mockToggleSort} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'date' } })
    expect(mockToggleSort).toHaveBeenCalledWith('date')
  })
})
