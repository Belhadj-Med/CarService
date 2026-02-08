import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div className="home">
      <h1>  اعمل vidange في دارك وبأرخص الأسعار.
</h1>
      <p>
       في دارك وبأرخص الأسعار اعمل vidange بكل راحة وأمان. نوصلولك أين ما تكون، بخدمة سريعة ومحترفة، وبزيوت ذات جودة عالية تناسب سيارتك. ما عادش تتعب روحك في الطوابير ولا تضيع وقتك في الورشات — فريقنا يجيك لباب الدار، يشخص السيارة، ويقوم بالخدمة بأفضل المعايير وبأسعار تنافسية.
      </p>

      <div className="buttons">
        <Link to="/service">
          <button>réservation de Service</button>
        </Link>
      </div>
      <div className="social-icons">
  <a href="https://wa.me/yourNumber" target="_blank" rel="noreferrer">
    <i className="fab fa-whatsapp"></i>
  </a>

  <a href="https://instagram.com/yourPage" target="_blank" rel="noreferrer">
    <i className="fab fa-instagram"></i>
  </a>

  <a href="https://facebook.com/yourPage" target="_blank" rel="noreferrer">
    <i className="fab fa-facebook"></i>
  </a>
</div>

    </div>
  );
}

export default Home;
