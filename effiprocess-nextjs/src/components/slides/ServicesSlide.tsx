'use client'

export default function ServicesSlide() {
  return (
    <section className="slide services" style={{
      background: '#ffffff',
      position: 'relative',
      width: '100%',
      height: '100vh',
      display: 'block',
      zIndex: 10
    }}>
      <div className="services-container" style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '40px'
      }}>
        {/* Services Page */}
        <div className="services-page" id="services-page-0" style={{ 
          opacity: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          padding: '20px 60px 40px'
        }}>
          <div className="services-content-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            maxWidth: '1200px',
            margin: '0 auto',
            height: '100%',
            alignItems: 'flex-start',
            paddingTop: '60px'
          }}>
            
            {/* Left side: Text content */}
            <div className="services-text-section">
              <div style={{
                fontSize: '0.85rem',
                color: '#666',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 500,
                marginBottom: '20px'
              }}>OUR EXPERTISE</div>
              <h3 style={{
                fontSize: '2.8rem',
                fontWeight: 600,
                color: '#333',
                lineHeight: 1.2,
                marginBottom: '30px',
                letterSpacing: '-0.02em'
              }}>Modern websites that drive<br/>your business forward.</h3>
              <p className="services-description">
                We create responsive, high-performance websites with cutting-edge technologies. 
                From concept to deployment, we ensure your digital presence stands out with 
                seamless user experiences and powerful backend solutions.
              </p>
              
              {/* Enhanced features grid */}
              <div className="services-features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <div className="icon-circle">P</div>
                  </div>
                  <div className="feature-content">
                    <div className="feature-title">Performance First</div>
                    <div className="feature-desc">Lightning-fast loading times and optimized user experiences</div>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <div className="icon-circle">R</div>
                  </div>
                  <div className="feature-content">
                    <div className="feature-title">Responsive Design</div>
                    <div className="feature-desc">Perfect display across all devices and screen sizes</div>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <div className="icon-circle">S</div>
                  </div>
                  <div className="feature-content">
                    <div className="feature-title">SEO Optimized</div>
                    <div className="feature-desc">Built for search engines and maximum visibility</div>
                  </div>
                </div>
              </div>
              
              {/* Technology stack */}
              <div className="tech-stack">
                <div className="tech-label">Technologies we use:</div>
                <div className="tech-tags">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">Next.js</span>
                  <span className="tech-tag">TypeScript</span>
                  <span className="tech-tag">Tailwind</span>
                  <span className="tech-tag">Node.js</span>
                </div>
              </div>
            </div>
            
            {/* Right side: Browser illustration */}
            <div className="services-visual-section">
              {/* Geometric background elements */}
              <div className="geometric-shape shape-1"></div>
              <div className="geometric-shape shape-2"></div>
              <div className="geometric-shape shape-3"></div>
              <div className="geometric-shape shape-4"></div>
              
              {/* Browser illustration */}
              <div className="browser-illustration">
                <svg viewBox="0 0 400 280" className="browser-svg">
                  {/* Browser window */}
                  <rect x="20" y="20" width="360" height="240" rx="16" fill="white" stroke="#a078c8" strokeWidth="3"/>
                  
                  {/* Browser top bar */}
                  <rect x="20" y="20" width="360" height="50" rx="16" fill="#a078c8"/>
                  <rect x="25" y="65" width="350" height="190" rx="8" fill="#f8f9fa"/>
                  
                  {/* Traffic lights */}
                  <circle cx="45" cy="45" r="7" fill="#ff5f5f"/>
                  <circle cx="70" cy="45" r="7" fill="#ffbd2e"/>  
                  <circle cx="95" cy="45" r="7" fill="#27ca3f"/>
                  
                  {/* Search bar */}
                  <rect x="150" y="35" width="180" height="20" rx="10" fill="white" stroke="#8a6fb8" strokeWidth="1"/>
                  <circle cx="320" cy="45" r="8" fill="none" stroke="#8a6fb8" strokeWidth="2"/>
                  
                  {/* Plus button */}
                  <text x="355" y="52" fontSize="18" fill="white" textAnchor="middle">+</text>
                  
                  {/* Content area */}
                  <rect x="45" y="85" width="200" height="8" rx="4" fill="#a078c8"/>
                  <rect x="45" y="105" width="160" height="8" rx="4" fill="#a078c8"/>
                  <rect x="45" y="125" width="180" height="8" rx="4" fill="#c8a0d8"/>
                  
                  {/* Sidebar */}
                  <rect x="280" y="85" width="80" height="80" rx="8" fill="#e8e0f0"/>
                  <rect x="290" y="95" width="60" height="6" rx="3" fill="#a078c8"/>
                  <rect x="290" y="110" width="45" height="6" rx="3" fill="#a078c8"/>
                  <rect x="290" y="125" width="55" height="6" rx="3" fill="#a078c8"/>
                  
                  {/* Bottom elements */}
                  <rect x="45" y="180" width="120" height="50" rx="8" fill="#f0e8ff"/>
                  <rect x="180" y="180" width="120" height="50" rx="8" fill="#f0e8ff"/>
                </svg>
              </div>
              
              {/* Page number */}
              <div className="page-number">02/06</div>
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  )
}