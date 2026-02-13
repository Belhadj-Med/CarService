import { useState } from 'react'
import { BACKEND_URL } from '../config'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('الرجاء إدخال البريد الإلكتروني')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('الرجاء إدخال بريد إلكتروني صحيح')
      return false
    }
    if (!formData.message.trim()) {
      setError('الرجاء كتابة الرسالة')
      return false
    }
    if (formData.message.trim().length < 10) {
      setError('الرسالة قصيرة جداً. يرجى كتابة المزيد من التفاصيل')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${BACKEND_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message || 'تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت')
        setFormData({
          email: '',
          message: '',
        })
      } else {
        setError(data.error || 'حدث خطأ أثناء إرسال الرسالة')
      }
    } catch (err) {
      console.error(err)
      setError('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com' },
    { name: 'WhatsApp', icon: '💬', url: 'https://wa.me' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
  ]

  return (
    <main className="contact-page">
      <div className="container">
        <h1 className="section-title">اتصل بنا</h1>
        <p className="section-subtitle">
          نحن هنا لمساعدتك. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن
        </p>

        <div className="contact-content">
          <div className="contact-info card">
            <h2>معلومات التواصل</h2>
            <p className="info-description">
              يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال وسائل التواصل الاجتماعي
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <strong>البريد الإلكتروني</strong>
                  <p>info@carservice.com</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <strong>الهاتف</strong>
                  <p>+213 555 123 456</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>العنوان</strong>
                  <p>الجزائر، الجزائر</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>تابعنا على</h3>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    title={social.name}
                  >
                    <span className="social-icon">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form className="contact-form card" onSubmit={handleSubmit}>
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

            <div className="input-group">
              <label htmlFor="email">البريد الإلكتروني *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="message">رسالتك *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="اكتب رسالتك هنا..."
                rows={6}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading"></span>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  إرسال الرسالة
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Contact
