import { Link } from 'react-router-dom'
import './About.css'

const About = () => {
  const features = [
    {
      icon: '🚚',
      title: 'خدمة متنقلة',
      description: 'نأتي إليك أينما كنت، لا حاجة للذهاب إلى الورشة',
    },
    {
      icon: '⚡',
      title: 'سريعة ومحترفة',
      description: 'خدمة سريعة وجودة عالية من فريق محترف',
    },
    {
      icon: '💰',
      title: 'أسعار تنافسية',
      description: 'أفضل الأسعار في السوق مع ضمان الجودة',
    },
    {
      icon: '✨',
      title: 'جودة عالية',
      description: 'استخدام أفضل أنواع الزيوت والمواد',
    },
    {
      icon: '🛠️',
      title: 'فحص شامل',
      description: 'فحص شامل للسيارة قبل وبعد الخدمة',
    },
    {
      icon: '📞',
      title: 'دعم 24/7',
      description: 'خدمة عملاء متاحة على مدار الساعة',
    },
  ]

  const stats = [
    { number: '500+', label: 'عميل راضٍ' },
    { number: '1000+', label: 'خدمة مكتملة' },
    { number: '5', label: 'سنوات خبرة' },
    { number: '98%', label: 'معدل الرضا' },
  ]

  return (
    <main className="about-page">
      <div className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">من نحن</h1>
            <p className="hero-description">
              نحن فريق محترف متخصص في تقديم خدمات صيانة السيارات المتنقلة. 
              هدفنا هو توفير راحة وأمان لعملائنا من خلال خدمة عالية الجودة 
              تأتي إليهم مباشرة.
            </p>
          </div>
        </div>
      </div>

      <section className="about-section">
        <div className="container">
          <h2 className="section-title">مميزاتنا</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content card">
            <h2>جاهز لطلب الخدمة؟</h2>
            <p>احجز خدمتك الآن واستمتع بخدمة متنقلة محترفة</p>
            <Link to="/service" className="btn btn-primary">
              احجز الآن
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
