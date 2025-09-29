import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '..'

function Boom({ label = 'Boom' }: { label?: string }): JSX.Element {
  throw new Error(label)
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('shows fallback when child throws', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Boom label="Exploded" />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/Exploded/)).toBeInTheDocument()

    spy.mockRestore()
  })

  it('can recover by remounting after user clicks Try again', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { unmount } = render(
      <ErrorBoundary>
        <Boom label="Kaboom" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Kaboom')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    // simulate app-level remount with safe content
    unmount()
    render(
      <ErrorBoundary>
        <div>Recovered</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Recovered')).toBeInTheDocument()

    spy.mockRestore()
  })

  it('supports custom fallback renderer', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <p>Custom: {error.message}</p>
            <button onClick={reset}>Reset</button>
          </div>
        )}
      >
        <Boom label="CustomFail" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom: CustomFail')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))

    spy.mockRestore()
  })

  it('auto resets when resetKey changes', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { rerender } = render(
      <ErrorBoundary resetKey={0}>
        <Boom label="Keyed" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Keyed')).toBeInTheDocument()

    rerender(
      <ErrorBoundary resetKey={1}>
        <div>Key Reset Content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Key Reset Content')).toBeInTheDocument()

    spy.mockRestore()
  })
})
