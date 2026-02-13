import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import markerIconImg from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { getApiUrl } from '../config'
import { safeParseResponse, getErrorMessage } from '../utils/api'
import './Service.css'

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIconImg,
  shadowUrl: markerShadow,
})

const markerIcon = new L.Icon({
  iconUrl: markerIconImg,
  shadowUrl: markerShadow,
  iconSize: [32, 41],
  iconAnchor: [16, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })
  return null
}

const Service = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    carType: '',
    carModel: '',
    engine: '',
    oilType: '',
  })
  const [position, setPosition] = useState(null)
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
    if (!formData.name.trim()) {
      setError('الرجاء إدخال الاسم')
      return false
    }
    if (!formData.phone.trim() || !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      setError('الرجاء إدخال رقم هاتف صحيح')
      return false
    }
    if (!formData.address.trim()) {
      setError('الرجاء إدخال العنوان')
      return false
    }
    if (!formData.carType.trim()) {
      setError('الرجاء اختيار نوع السيارة')
      return false
    }
    if (!formData.carModel.trim()) {
      setError('الرجاء إدخال موديل السيارة')
      return false
    }
    if (!formData.engine.trim()) {
      setError('الرجاء إدخال نوع المحرك')
      return false
    }
    if (!formData.oilType.trim()) {
      setError('الرجاء اختيار نوع الزيت')
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
      const address = position
        ? `${formData.address} (📍 ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)})`
        : formData.address

      const res = await fetch(getApiUrl('/service'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          address,
        }),
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

      if (isJson && data) {
        setSuccess(data.message || 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً')
        setFormData({
          name: '',
          phone: '',
          address: '',
          carType: '',
          carModel: '',
          engine: '',
          oilType: '',
        })
        setPosition(null)
      } else {
        throw new Error('Server returned invalid response format')
      }
    } catch (err) {
      console.error('Service form error:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="service-page">
      <div className="container">
        <h1 className="section-title">احجز خدمة</h1>
        <p className="section-subtitle">
          املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
        </p>

        <div className="service-content">
          <form className="service-form card" onSubmit={handleSubmit}>
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

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="name">الاسم واللقب *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">رقم الهاتف *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="مثال: 0551234567"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="address">العنوان *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="أدخل عنوانك الكامل"
                required
              />
            </div>

            <div className="input-group">
              <label>حدد موقعك على الخريطة (اختياري)</label>
              <div className="map-container">
                <MapContainer
                  center={[36.7538, 3.0588]}
                  zoom={13}
                  style={{ height: '300px', width: '100%', borderRadius: '10px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationPicker setPosition={setPosition} />
                  {position && <Marker position={[position.lat, position.lng]} icon={markerIcon} />}
                </MapContainer>
              </div>
              {position && (
                <p className="map-info">
                  الموقع المحدد: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                </p>
              )}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="carType">نوع السيارة *</label>
                <select
                  id="carType"
                  name="carType"
                  value={formData.carType}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="سيارة صغيرة">سيارة صغيرة</option>
                  <option value="سيارة متوسطة">سيارة متوسطة</option>
                  <option value="سيارة كبيرة">سيارة كبيرة</option>
                  <option value="SUV">SUV</option>
                  <option value="شاحنة">شاحنة</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="carModel">موديل السيارة *</label>
                <input
                  type="text"
                  id="carModel"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  placeholder="مثال: تويوتا كورولا 2020"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="engine">نوع المحرك *</label>
                <select
                  id="engine"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="بنزين">بنزين</option>
                  <option value="ديزل">ديزل</option>
                  <option value="هجين">هجين</option>
                  <option value="كهربائي">كهربائي</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="oilType">نوع الزيت المعتاد *</label>
                <select
                  id="oilType"
                  name="oilType"
                  value={formData.oilType}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="5W-30">5W-30</option>
                  <option value="5W-40">5W-40</option>
                  <option value="10W-40">10W-40</option>
                  <option value="15W-40">15W-40</option>
                  <option value="20W-50">20W-50</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading"></span>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  إرسال الطلب
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

export default Service
