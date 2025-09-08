import { ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  count?: number
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

const Tabs = ({ tabs, activeTab, onTabChange, className = '' }: TabsProps) => {
  return (
    <div className={className}>
      <ul className="nav border-bottom mb-4">
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-link px-3 py-2 border-0 bg-transparent ${
                activeTab === tab.id
                  ? 'active border-bottom border-primary border-2 text-primary'
                  : 'text-muted'
              }`}
              onClick={() => onTabChange(tab.id)}
              type="button"
              style={{
                borderRadius: '0',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
              }}
            >
              {tab.label}
              {typeof tab.count === 'number' && (
                <span
                  className={`ms-2 badge ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'bg-light text-muted'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane ${activeTab === tab.id ? 'active show' : ''}`}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabs
