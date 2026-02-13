import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <main className="home">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text fade-in-up">
          <h1 className="hero-title">
            <span className="hero-greeting">اعمل vidange في دارك</span>
            <span className="hero-main">وبأرخص الأسعار</span>
          </h1>
          
          <p className="hero-description">
            في دارك وبأرخص الأسعار اعمل vidange بكل راحة وأمان. نوصلولك أين ما تكون، 
            بخدمة سريعة ومحترفة، وبزيوت ذات جودة عالية تناسب سيارتك. ما عادش تتعب روحك 
            في الطوابير ولا تضيع وقتك في الورشات — فريقنا يجيك لباب الدار، يشخص السيارة، 
            ويقوم بالخدمة بأفضل المعايير وبأسعار تنافسية.
          </p>

          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span>خدمة متنقلة</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>سريعة ومحترفة</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span>أسعار تنافسية</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>جودة عالية</span>
            </div>
          </div>

          <div className="hero-buttons">
            <Link to="/service" className="btn btn-primary">
              احجز خدمة الآن
              <span>→</span>
            </Link>
            <Link to="/about" className="btn btn-secondary">
              تعرف علينا
            </Link>
          </div>
        </div>

        <div className="hero-image fade-in">
          <div className="floating-card">
            <div className="service-card">
              <div className="card-icon">🔧</div>
              <h3>خدماتنا</h3>
              <ul className="service-list">
                <li>تغيير الزيت</li>
                <li>فحص السيارة</li>
                <li>صيانة دورية</li>
                <li>خدمة متنقلة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
    </main>
  )
}

export default Home
