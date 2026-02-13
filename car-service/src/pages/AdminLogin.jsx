import { useState } from 'react'
import { BACKEND_URL } from '../config'
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

      // Handle non-JSON responses (like 404 HTML pages)
      const contentType = res.headers.get('content-type') || ''
      let data = null
      
      if (contentType.includes('application/json')) {
        try {
          data = await res.json()
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError)
          throw new Error(`Server returned invalid JSON (status ${res.status})`)
        }
      } else {
        // Non-JSON response (likely HTML error page)
        const text = await res.text()
        console.error(`Non-JSON response (${res.status}):`, text.substring(0, 200))
        if (res.status === 404) {
          throw new Error('Endpoint not found. Please check backend configuration.')
        }
        throw new Error(`Server error (${res.status}): ${text.substring(0, 100)}`)
      }

      if (res.ok && data) {
        localStorage.setItem('adminToken', data.token)
        setToken(data.token)
      } else {
        setError(data?.error || `كلمة المرور غير صحيحة (${res.status})`)
      }
    } catch (err) {
      console.error('Admin login error:', err)
      if (err.message?.includes('Failed to fetch') || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError('لا يمكن الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت')
      } else if (err.message?.includes('404') || err.message?.includes('not found')) {
        setError('الخادم غير متاح حالياً. يرجى المحاولة لاحقاً')
      } else {
        setError(err.message || 'حدث خطأ في الاتصال بالخادم')
      }
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
