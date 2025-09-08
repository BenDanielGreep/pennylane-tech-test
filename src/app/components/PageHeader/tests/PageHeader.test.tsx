import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import PageHeader from '../index'

describe('PageHeader', () => {
  it('renders title correctly', () => {
    render(<PageHeader title="Test Title" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Test Title'
    )
  })

  it('renders actions when provided', () => {
    const actions = <button>Test Action</button>
    render(<PageHeader title="Test Title" actions={actions} />)
    expect(
      screen.getByRole('button', { name: 'Test Action' })
    ).toBeInTheDocument()
  })

  it('renders actions with multiple elements', () => {
    const actions = (
      <>
        <button>Primary Action</button>
        <button>Secondary Action</button>
      </>
    )
    render(<PageHeader title="Test Title" actions={actions} />)
    expect(
      screen.getByRole('button', { name: 'Primary Action' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Secondary Action' })
    ).toBeInTheDocument()
  })

  it('renders with empty title', () => {
    const actions = <span data-testid="back-link">← Back</span>
    render(<PageHeader title="" actions={actions} />)
    expect(screen.getByTestId('back-link')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('')
  })

  // accessibility test with axe
  it('should have no accessibility violations', async () => {
    const { container } = render(<PageHeader title="Accessible Title" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
