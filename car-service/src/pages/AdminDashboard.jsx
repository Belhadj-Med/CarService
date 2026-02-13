import { useState, useEffect } from 'react'
import { BACKEND_URL } from '../config'
import './AdminDashboard.css'

const AdminDashboard = ({ token, setToken }) => {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [newPasscode, setNewPasscode] = useState('')
  const [passcodeMsg, setPasscodeMsg] = useState('')

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BACKEND_URL}/adm/dashboard`, {
        headers: { 'x-admin-token': token },
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
        setRequests(data)
        setError('')
      } else {
        if (res.status === 401) {
          localStorage.removeItem('adminToken')
          setToken(null)
        } else {
          setError(data?.error || `حدث خطأ في جلب البيانات (${res.status})`)
        }
      }
    } catch (err) {
      console.error('Fetch requests error:', err)
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

  useEffect(() => {
    fetchRequests()
    // Refresh every 30 seconds
    const interval = setInterval(fetchRequests, 30000)
    return () => clearInterval(interval)
  }, [token])

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      return
    }

    try {
      const res = await fetch(`${BACKEND_URL}/service/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      })
      
      // Handle non-JSON responses (like 404 HTML pages)
      const contentType = res.headers.get('content-type') || ''
      let data = null
      
      if (contentType.includes('application/json')) {
        try {
          data = await res.json()
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError)
          // For DELETE, 200/204 without body is OK
          if (res.ok || res.status === 200 || res.status === 204) {
            setRequests(requests.filter((r) => r._id !== id))
            setSuccess('تم حذف الطلب بنجاح')
            setTimeout(() => setSuccess(''), 3000)
            return
          }
          throw new Error(`Server returned invalid JSON (status ${res.status})`)
        }
      } else {
        // Non-JSON response (likely HTML error page)
        const text = await res.text()
        console.error(`Non-JSON response (${res.status}):`, text.substring(0, 200))
        if (res.status === 404) {
          throw new Error('Endpoint not found. Please check backend configuration.')
        }
        // For DELETE, 200/204 without body is OK
        if (res.ok || res.status === 200 || res.status === 204) {
          setRequests(requests.filter((r) => r._id !== id))
          setSuccess('تم حذف الطلب بنجاح')
          setTimeout(() => setSuccess(''), 3000)
          return
        }
        throw new Error(`Server error (${res.status}): ${text.substring(0, 100)}`)
      }
      
      if (res.ok || res.status === 200 || res.status === 204) {
        setRequests(requests.filter((r) => r._id !== id))
        setSuccess('تم حذف الطلب بنجاح')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data?.error || `حدث خطأ أثناء الحذف (${res.status})`)
      }
    } catch (err) {
      console.error('Delete request error:', err)
      if (err.message?.includes('Failed to fetch') || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError('لا يمكن الاتصال بالخادم. يرجى المحاولة لاحقاً')
      } else if (err.message?.includes('404') || err.message?.includes('not found')) {
        setError('الخادم غير متاح حالياً. يرجى المحاولة لاحقاً')
      } else {
        setError(err.message || 'حدث خطأ في الاتصال بالخادم')
      }
    }
  }

  const handleChangePasscode = async (e) => {
    e.preventDefault()
    if (!newPasscode.trim() || newPasscode.length < 4) {
      setPasscodeMsg('كلمة المرور يجب أن تكون 4 أحرف على الأقل')
      return
    }

    try {
      const res = await fetch(`${BACKEND_URL}/admin/change-passcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({ newPasscode }),
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
        setPasscodeMsg('تم تغيير كلمة المرور بنجاح')
        setNewPasscode('')
        setTimeout(() => setPasscodeMsg(''), 3000)
      } else {
        setPasscodeMsg(data?.error || `حدث خطأ (${res.status})`)
      }
    } catch (err) {
      console.error('Change passcode error:', err)
      if (err.message?.includes('Failed to fetch') || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        setPasscodeMsg('لا يمكن الاتصال بالخادم. يرجى المحاولة لاحقاً')
      } else if (err.message?.includes('404') || err.message?.includes('not found')) {
        setPasscodeMsg('الخادم غير متاح حالياً. يرجى المحاولة لاحقاً')
      } else {
        setPasscodeMsg(err.message || 'حدث خطأ في الاتصال بالخادم')
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
  }

  if (loading) {
    return (
      <main className="admin-dashboard-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="section-title">لوحة التحكم</h1>
          <button onClick={handleLogout} className="btn btn-danger">
            تسجيل الخروج
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✓</span>
            {success}
          </div>
        )}

        {/* Passcode Change Section */}
        <div className="passcode-section card">
          <h2>تغيير كلمة المرور</h2>
          <form onSubmit={handleChangePasscode} className="passcode-form">
            <div className="input-group">
              <label htmlFor="newPasscode">كلمة المرور الجديدة</label>
              <input
                type="password"
                id="newPasscode"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة"
                minLength={4}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              تغيير كلمة المرور
            </button>
            {passcodeMsg && (
              <p className={passcodeMsg.includes('نجاح') ? 'success-msg' : 'error-msg'}>
                {passcodeMsg}
              </p>
            )}
          </form>
        </div>

        {/* Requests Section */}
        <div className="requests-section">
          <h2 className="section-title">الطلبات ({requests.length})</h2>
          {requests.length === 0 ? (
            <div className="empty-state card">
              <p>لا توجد طلبات حالياً</p>
            </div>
          ) : (
            <div className="requests-grid">
              {requests.map((request) => (
                <div key={request._id} className="request-card card">
                  <div className="request-header">
                    <h3>{request.name}</h3>
                    <button
                      onClick={() => handleDelete(request._id)}
                      className="btn-delete"
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="request-details">
                    <div className="detail-item">
                      <span className="detail-label">📱 الهاتف:</span>
                      <span className="detail-value">{request.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📍 العنوان:</span>
                      <span className="detail-value">{request.address}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🚗 النوع:</span>
                      <span className="detail-value">{request.carType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🏷️ الموديل:</span>
                      <span className="detail-value">{request.carModel}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">⚙️ المحرك:</span>
                      <span className="detail-value">{request.engine}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🛢️ الزيت:</span>
                      <span className="detail-value">{request.oilType}</span>
                    </div>
                    {request.createdAt && (
                      <div className="detail-item">
                        <span className="detail-label">📅 التاريخ:</span>
                        <span className="detail-value">
                          {new Date(request.createdAt).toLocaleDateString('ar-DZ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default AdminDashboard
