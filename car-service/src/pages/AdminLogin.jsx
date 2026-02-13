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

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('adminToken', data.token)
        setToken(data.token)
      } else {
        setError(data.error || 'كلمة المرور غير صحيحة')
      }
    } catch (err) {
      console.error(err)
      setError('حدث خطأ في الاتصال بالخادم')
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
