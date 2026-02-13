import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Service from './pages/Service'
import Contact from './pages/Contact'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  const [adminToken, setAdminToken] = useState(null)

  useEffect(() => {
    // Check for existing admin token
    const token = localStorage.getItem('adminToken')
    if (token) {
      setAdminToken(token)
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/admin" 
            element={
              adminToken ? (
                <AdminDashboard token={adminToken} setToken={setAdminToken} />
              ) : (
                <AdminLogin setToken={setAdminToken} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
