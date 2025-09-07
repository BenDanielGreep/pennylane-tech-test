import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

const PageHeader = ({
  title,
  subtitle,
  actions,
  className = '',
}: PageHeaderProps) => {
  return (
    <div className={`row mb-4 mb-md-3 py-4 py-md-5 ${className}`}>
      <div className="col">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-4 gap-md-5">
          <div>
            <h1 className="h2 h1-md mb-2 mb-md-3">{title}</h1>
            {subtitle && <p className="text-muted mb-3 fs-6">{subtitle}</p>}
            {actions && <div className="mt-4 mt-sm-0">{actions}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
