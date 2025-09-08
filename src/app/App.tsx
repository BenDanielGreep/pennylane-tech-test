import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import InvoicesList from './components/InvoicesList'
import InvoiceShow from './components/InvoiceShow'
import InvoiceCreate from './components/InvoiceCreate'

function App() {
  console.log('🎯 App component rendering...')
  
  // Get the basename from package.json homepage or default to root
  const basename = process.env.PUBLIC_URL || ''
  console.log('🏠 Router basename:', basename)
  
  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid container-xl mx-auto px-3 px-md-4">
        <Router basename={basename}>
          <Routes>
            <Route path="/invoice/create" Component={InvoiceCreate} />
            <Route path="/invoice/:id" Component={InvoiceShow} />
            <Route path="/" Component={InvoicesList} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
