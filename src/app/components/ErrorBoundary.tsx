import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('🚨 ErrorBoundary caught error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error details:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="text-center">
            <h1 className="text-danger">Something went wrong</h1>
            <p className="text-muted">Check the browser console for details</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
            {this.state.error && (
              <details className="mt-3">
                <summary>Error Details</summary>
                <pre className="text-start mt-2 p-2 bg-dark text-light rounded">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
