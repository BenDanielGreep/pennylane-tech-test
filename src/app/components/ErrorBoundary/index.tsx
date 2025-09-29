import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
  resetKey?: unknown
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, fallback } = this.props

    if (error) {
      if (fallback) {
        return fallback(error, this.reset)
      }
      return (
        <div className="alert alert-danger mt-3" role="alert">
          <h4 className="alert-heading">Something went wrong.</h4>
          <p className="mb-2">{error.message}</p>
          <button className="btn btn-sm btn-outline-light" onClick={this.reset}>
            Try again
          </button>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
