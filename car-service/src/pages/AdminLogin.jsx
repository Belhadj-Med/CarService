import { useState } from 'react'
import { BACKEND_URL } from '../config'
import { safeParseResponse, getErrorMessage } from '../utils/api'
import './AdminLogin.css'

const AdminLogin = ({ setToken }) => {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!passcode.trim()) {
      setError('الرجاء إدخال كلمة المرور')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${BACKEND_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })

      // Safely parse response (handles both JSON and HTML error pages)
      const { data, isJson } = await safeParseResponse(res)

      if (!res.ok) {
        // Server returned an error
        if (res.status === 404) {
          throw new Error('Endpoint not found (404). Please check backend configuration.')
        }
        if (isJson && data?.error) {
          throw new Error(data.error)
        }
        throw new Error(`Server error (${res.status})`)
      }

      if (isJson && data?.token) {
        localStorage.setItem('adminToken', data.token)
        setToken(data.token)
      } else {
        throw new Error('Server returned invalid response format')
      }
    } catch (err) {
      console.error('Admin login error:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <div className="login-container">
        <div className="login-card card">
          <div className="login-header">
            <h1>تسجيل الدخول</h1>
            <p>لوحة تحكم الإدارة</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="passcode">كلمة المرور</label>
              <input
                type="password"
                id="passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                autoFocus
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading"></span>
                  جاري التحقق...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin
