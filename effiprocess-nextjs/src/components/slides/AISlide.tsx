'use client'

export default function AISlide() {
  return (
    <section className="slide" style={{
      background: '#f5f5f5',
      position: 'relative',
      width: '100%',
      height: '100vh',
      zIndex: 10
    }}>
      {/* Main container with 50/50 split */}
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center'
      }}>
        {/* Left side - Content */}
        <div style={{
          flex: 1,
          padding: '0 80px 0 120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '50%'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#9a9a9a',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginBottom: '30px'
          }}>AI AGENT SYSTEMS</div>
          
          <h2 style={{
            fontSize: '3.2rem',
            fontWeight: 300,
            color: '#333333',
            lineHeight: 1.15,
            marginBottom: '40px',
            letterSpacing: '-0.02em'
          }}>
            Intelligent automation<br/>
            that thinks and acts<br/>
            like your best employee.
          </h2>
          
          <div style={{
            fontSize: '1rem',
            color: '#666666',
            lineHeight: 1.65,
            marginBottom: '40px'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Our AI agents don&apos;t just follow scripts—they understand context, make decisions, 
              and adapt to your business needs. From customer service to data analysis, 
              they work 24/7 to streamline your operations while maintaining the human touch 
              your customers expect.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Unlike traditional automation tools, our intelligent agents learn from every interaction, 
              continuously improving their performance and decision-making capabilities. They can 
              handle complex workflows, manage customer inquiries, process documents, and 
              integrate seamlessly with your existing systems.
            </p>
            <p>
              Smart automation that grows with your business, scales with your needs, and delivers 
              measurable results from day one. Experience the future of business efficiency with AI 
              agents that truly understand your industry and objectives.
            </p>
          </div>
          
          {/* Key Capabilities Section */}
          <div style={{ marginBottom: '35px' }}>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#333',
              marginBottom: '20px',
              letterSpacing: '-0.01em'
            }}>Key Capabilities</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px 40px'
            }}>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '4px'
                }}>Natural Language Processing</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Advanced communication capabilities</div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '4px'
                }}>Machine Learning</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Continuous improvement algorithms</div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '4px'
                }}>Data Analytics</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Real-time insights and reporting</div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '4px'
                }}>24/7 Availability</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Round-the-clock automation</div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '4px'
                }}>System Integration</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Seamless workflow connection</div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '4px'
                }}>Scalable Solutions</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Grows with your business needs</div>
              </div>
            </div>
          </div>
          
          <div style={{
            fontSize: '0.8rem',
            color: '#9a9a9a',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            DISCOVER OUR AI AGENT SOLUTIONS
          </div>
        </div>
        
        {/* Right side - Icon */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '50%'
        }}>
          <svg width="300" height="400" viewBox="0 0 300 400" style={{ opacity: 0.8 }}>
            {/* AI Brain/Processor Icon */}
            <rect x="75" y="100" width="150" height="200" rx="15" fill="none" stroke="#a078c8" strokeWidth="3"/>
            
            {/* Connection nodes around the brain */}
            <circle cx="100" cy="80" r="6" fill="#a078c8"/>
            <circle cx="150" cy="70" r="8" fill="#a078c8"/>
            <circle cx="200" cy="80" r="6" fill="#a078c8"/>
            
            <circle cx="50" cy="150" r="6" fill="#a078c8"/>
            <circle cx="250" cy="150" r="6" fill="#a078c8"/>
            
            <circle cx="50" cy="250" r="6" fill="#a078c8"/>
            <circle cx="250" cy="250" r="6" fill="#a078c8"/>
            
            <circle cx="100" cy="320" r="6" fill="#a078c8"/>
            <circle cx="150" cy="330" r="8" fill="#a078c8"/>
            <circle cx="200" cy="320" r="6" fill="#a078c8"/>
            
            {/* Connection lines */}
            <line x1="100" y1="86" x2="100" y2="100" stroke="#a078c8" strokeWidth="2"/>
            <line x1="150" y1="78" x2="150" y2="100" stroke="#a078c8" strokeWidth="2"/>
            <line x1="200" y1="86" x2="200" y2="100" stroke="#a078c8" strokeWidth="2"/>
            
            <line x1="56" y1="150" x2="75" y2="150" stroke="#a078c8" strokeWidth="2"/>
            <line x1="244" y1="150" x2="225" y2="150" stroke="#a078c8" strokeWidth="2"/>
            
            <line x1="56" y1="250" x2="75" y2="250" stroke="#a078c8" strokeWidth="2"/>
            <line x1="244" y1="250" x2="225" y2="250" stroke="#a078c8" strokeWidth="2"/>
            
            <line x1="100" y1="314" x2="100" y2="300" stroke="#a078c8" strokeWidth="2"/>
            <line x1="150" y1="322" x2="150" y2="300" stroke="#a078c8" strokeWidth="2"/>
            <line x1="200" y1="314" x2="200" y2="300" stroke="#a078c8" strokeWidth="2"/>
            
            {/* Internal processor elements */}
            <rect x="90" y="130" width="40" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            <rect x="170" y="130" width="40" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            
            <rect x="90" y="160" width="60" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            <rect x="160" y="160" width="40" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            
            <rect x="90" y="190" width="40" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            <rect x="140" y="190" width="70" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            
            <rect x="90" y="220" width="50" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            <rect x="150" y="220" width="50" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            
            <rect x="90" y="250" width="80" height="8" rx="4" fill="#a078c8" opacity="0.6"/>
            
            {/* Central processing unit */}
            <circle cx="150" cy="200" r="15" fill="none" stroke="#a078c8" strokeWidth="3"/>
            <circle cx="150" cy="200" r="8" fill="#a078c8" opacity="0.8"/>
          </svg>
        </div>
      </div>
      
      {/* Page number bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        right: '40px',
        fontSize: '2rem',
        fontWeight: 300,
        color: '#a078c8',
        fontFamily: "'SF Mono', Monaco, monospace"
      }}>03/06</div>
    </section>
  )
}