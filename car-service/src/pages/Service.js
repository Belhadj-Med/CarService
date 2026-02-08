import React, { useState } from "react";
import "./Service.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIconImg from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: markerIconImg,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Service = () => {
  const [position, setPosition] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const phone = e.target[1].value;
    const writtenAddress = e.target[2].value; // العنوان المكتوب

    // إذا اختار نقطة على الخريطة نضيفها للنص
    const address = position
      ? `${writtenAddress} (📍 ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)})`
      : writtenAddress;

    const carType = e.target[3].value;
    const carModel = e.target[4].value;
    const engine = e.target[5].value;
    const oilType = e.target[6].value;

    try {
      const res = await fetch("http://localhost:5000/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          carType,
          carModel,
          engine,
          oilType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        e.target.reset();
        setPosition(null);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="service-page">
      <h1 className="service-title">Service</h1>
      <p className="service-subtitle">الرجاء تعبئة الاستمارة</p>

      <form className="service-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>الاسم و اللقب</label>
          <input type="text" placeholder="اكتب اسمك الكامل" required />
        </div>

        <div className="form-group">
          <label>رقم الهاتف</label>
          <input type="tel" placeholder="الرجاء ادخال رقم الهاتف" required />
        </div>

        {/* ✅ عنوان مكتوب (إجباري) */}
        <div className="form-group">
          <label>العنوان</label>
          <input
            type="text"
            placeholder="اكتب عنوانك (المدينة، الحي، الشارع...)"
            required
          />
        </div>

        {/* ✅ خريطة اختيارية */}
        <div className="form-group">
          <label>حدد على الخريطة (اختياري)</label>

          <div className="map-container">
            <MapContainer
              center={[36.8065, 10.1815]}
              zoom={10}
              style={{ height: "250px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationPicker setPosition={setPosition} />

              {position && (
                <Marker position={position} icon={markerIcon} />
              )}
            </MapContainer>
          </div>

          {position && (
            <p className="selected-coords">
              الموقع المختار: {position.lat.toFixed(5)},{" "}
              {position.lng.toFixed(5)}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>نوع السيارة</label>
          <input type="text" placeholder="مثال: Toyota, BMW, Kia..." required />
        </div>

        <div className="form-group">
          <label>مودال السيارة</label>
          <input type="text" placeholder="مثال: Corolla 2018" required />
        </div>

        <div className="form-group">
          <label>المحرك</label>
          <input type="text" placeholder="مثال: 1.6 / 2.0 / Diesel" required />
        </div>

        <div className="form-group">
          <label>نوع الزيت المعتاد</label>
          <input type="text" placeholder="مثال: 5W-30 / 10W-40" required />
        </div>

        <button type="submit" className="submit-btn">
          إرسال الطلب
        </button>
      </form>

      <p className="service-subtitle">زورونا على مواقع التواصل الاجتماعي</p>
      <div className="service-icons">
        <a href="https://wa.me/" target="_blank" rel="noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>
        <a href="https://instagram.com/" target="_blank" rel="noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://facebook.com/" target="_blank" rel="noreferrer">
          <i className="fab fa-facebook"></i>
        </a>
      </div>
    </div>
  );
};

const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

export default Service;
