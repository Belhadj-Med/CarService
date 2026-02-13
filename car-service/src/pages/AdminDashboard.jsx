import { useState, useEffect } from 'react'
import { BACKEND_URL } from '../config'
import { safeParseResponse, getErrorMessage } from '../utils/api'
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
      
      // Safely parse response (handles both JSON and HTML error pages)
      const { data, isJson } = await safeParseResponse(res)

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('adminToken')
          setToken(null)
          return
        }
        if (res.status === 404) {
          throw new Error('Endpoint not found (404). Please check backend configuration.')
        }
        if (isJson && data?.error) {
          throw new Error(data.error)
        }
        throw new Error(`Server error (${res.status})`)
      }

      if (isJson && Array.isArray(data)) {
        setRequests(data)
        setError('')
      } else {
        throw new Error('Server returned invalid response format')
      }
    } catch (err) {
      console.error('Fetch requests error:', err)
      setError(getErrorMessage(err))
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
      
      // For DELETE, 200/204 without body is OK
      if (res.ok || res.status === 200 || res.status === 204) {
        setRequests(requests.filter((r) => r._id !== id))
        setSuccess('تم حذف الطلب بنجاح')
        setTimeout(() => setSuccess(''), 3000)
        return
      }

      // If not OK, parse response to get error message
      const { data, isJson } = await safeParseResponse(res)
      
      if (res.status === 404) {
        throw new Error('Endpoint not found (404). Please check backend configuration.')
      }
      if (isJson && data?.error) {
        throw new Error(data.error)
      }
      throw new Error(`Server error (${res.status})`)
    } catch (err) {
      console.error('Delete request error:', err)
      setError(getErrorMessage(err))
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

      if (isJson && data?.message) {
        setPasscodeMsg('تم تغيير كلمة المرور بنجاح')
        setNewPasscode('')
        setTimeout(() => setPasscodeMsg(''), 3000)
      } else {
        throw new Error('Server returned invalid response format')
      }
    } catch (err) {
      console.error('Change passcode error:', err)
      setPasscodeMsg(getErrorMessage(err))
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
