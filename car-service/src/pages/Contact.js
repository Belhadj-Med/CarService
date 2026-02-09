import React, { useState } from "react";
import "./Contact.css";
import { BACKEND_URL } from "../config";
const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email.trim() || !message.trim()) {
    alert("الرجاء إدخال البريد الإلكتروني وكتابة الرسالة");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      setEmail("");
      setMessage("");
    } else {
      alert(data.error || "حدث خطأ");
    }
  } catch (err) {
    alert("حدث خطأ في الاتصال بالخادم");
    console.error(err);
  }
};

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">اتصل بنا</h1>
        <p className="contact-subtitle">
          الرجاء كتابة بريدك الإلكتروني ورسالتك وسنقوم بالرد عليك في أقرب وقت
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
            />
          </div>

          {/* Message textarea */}
          <div className="form-group">
            <label>رسالتك</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              rows={6}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            إرسال الرسالة
          </button>

          {/* Social media links at the bottom */}
          <div className="contact-socials">
        <a href="https://wa.me/21626374252" target="_blank" rel="noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>
        <a href="https://instagram.com/" target="_blank" rel="noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.facebook.com/belhadj.med.amin/" target="_blank" rel="noreferrer">
          <i className="fab fa-facebook"></i>
        </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
