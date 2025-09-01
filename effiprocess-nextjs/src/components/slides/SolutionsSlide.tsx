'use client'

export default function SolutionsSlide() {
  return (
    <section className="slide solutions" style={{ 
      background: '#ffffff', 
      zIndex: 10,
      position: 'relative',
      width: '100%',
      height: '100vh'
    }}>
      {/* Left side: Vertical effiprocess text */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 300,
          color: '#666',
          transform: 'rotate(-90deg)',
          whiteSpace: 'nowrap',
          fontFamily: "'SF Mono', Monaco, monospace",
          letterSpacing: '0.02em'
        }}>effiprocess</div>
      </div>
      
      {/* Bottom center: Smaller number */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 300,
          color: '#a078c8',
          fontFamily: "'SF Mono', Monaco, monospace"
        }}>05/06</div>
      </div>
      
      {/* Multiple Icons Row at Top */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: 0,
        right: 0,
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: '0 60px',
        zIndex: 1
      }}>
        
        {/* Icon 1: Website */}
        <div style={{
          opacity: 0.15,
          filter: 'drop-shadow(0 10px 30px rgba(160, 120, 200, 0.3))'
        }}>
          <svg viewBox="0 0 160 120" style={{ width: '180px', height: '135px' }}>
            <g fill="none" stroke="#a078c8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="10" y="10" width="140" height="90" rx="8"/>
              <rect x="10" y="10" width="140" height="25" rx="8"/>
              <rect x="15" y="90" width="130" height="5" rx="2" fill="#a078c8"/>
              <circle cx="25" cy="22" r="3" fill="#a078c8"/>
              <circle cx="35" cy="22" r="3" fill="#a078c8"/>
              <circle cx="45" cy="22" r="3" fill="#a078c8"/>
              <rect x="20" y="50" width="60" height="4" rx="2" fill="#a078c8"/>
              <rect x="20" y="60" width="40" height="4" rx="2" fill="#a078c8"/>
              <rect x="90" y="45" width="50" height="25" rx="4" fill="#a078c8" opacity="0.3"/>
            </g>
          </svg>
        </div>
        
        {/* Icon 2: AI Brain (Realistic) */}
        <div style={{
          opacity: 0.15,
          filter: 'drop-shadow(0 10px 30px rgba(160, 120, 200, 0.3))'
        }}>
          <svg viewBox="0 0 160 120" style={{ width: '150px', height: '125px' }}>
            <g fill="none" stroke="#a078c8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {/* Left hemisphere with realistic curves */}
              <path d="M20 60 C15 45, 18 30, 25 22 C32 15, 42 12, 52 16 C58 12, 65 14, 70 20 C75 28, 78 38, 75 50 C78 62, 75 72, 70 80 C65 86, 58 88, 52 84 C42 88, 32 85, 25 78 C18 70, 15 75, 20 60"/>
              
              {/* Right hemisphere with realistic curves */}
              <path d="M140 60 C145 45, 142 30, 135 22 C128 15, 118 12, 108 16 C102 12, 95 14, 90 20 C85 28, 82 38, 85 50 C82 62, 85 72, 90 80 C95 86, 102 88, 108 84 C118 88, 128 85, 135 78 C142 70, 145 75, 140 60"/>
              
              {/* Brain folds and wrinkles (left side) */}
              <path d="M25 35 C35 32, 45 35, 55 40 C50 45, 40 48, 30 45"/>
              <path d="M22 50 C32 48, 42 50, 52 55 C47 60, 37 58, 27 55"/>
              <path d="M25 65 C35 68, 45 65, 55 60 C50 55, 40 52, 30 55"/>
              
              {/* Brain folds and wrinkles (right side) */}
              <path d="M135 35 C125 32, 115 35, 105 40 C110 45, 120 48, 130 45"/>
              <path d="M138 50 C128 48, 118 50, 108 55 C113 60, 123 58, 133 55"/>
              <path d="M135 65 C125 68, 115 65, 105 60 C110 55, 120 52, 130 55"/>
              
              {/* Central division */}
              <path d="M80 18 C80 30, 80 42, 80 60 C80 72, 80 84, 80 92"/>
              
              {/* Frontal lobe details */}
              <path d="M45 25 C50 22, 55 25, 60 30"/>
              <path d="M100 30 C105 25, 110 22, 115 25"/>
              
              {/* Temporal lobe curves */}
              <path d="M35 75 C40 78, 45 82, 50 85"/>
              <path d="M125 75 C120 78, 115 82, 110 85"/>
              
              {/* Occipital lobe */}
              <path d="M75 85 C78 88, 82 88, 85 85"/>
            </g>
          </svg>
        </div>
        
        {/* Icon 3: Interface/Mobile */}
        <div style={{
          opacity: 0.15,
          filter: 'drop-shadow(0 10px 30px rgba(160, 120, 200, 0.3))'
        }}>
          <svg viewBox="0 0 80 120" style={{ width: '100px', height: '150px' }}>
            <g fill="none" stroke="#a078c8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="10" y="10" width="60" height="100" rx="12"/>
              <rect x="15" y="20" width="50" height="70" rx="4" fill="#a078c8" opacity="0.1"/>
              <circle cx="40" cy="100" r="4" fill="#a078c8"/>
              <rect x="25" y="25" width="30" height="3" rx="1" fill="#a078c8"/>
              <rect x="25" y="35" width="20" height="3" rx="1" fill="#a078c8"/>
              <rect x="25" y="45" width="25" height="3" rx="1" fill="#a078c8"/>
              <rect x="25" y="65" width="15" height="10" rx="2" fill="#a078c8" opacity="0.3"/>
              <rect x="45" y="65" width="15" height="10" rx="2" fill="#a078c8" opacity="0.3"/>
            </g>
          </svg>
        </div>
        
        {/* Icon 4: Gear/Solutions */}
        <div style={{
          opacity: 0.15,
          filter: 'drop-shadow(0 10px 30px rgba(160, 120, 200, 0.3))'
        }}>
          <svg viewBox="0 0 120 120" style={{ width: '150px', height: '150px' }}>
            <g fill="none" stroke="#a078c8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="60" cy="60" r="30"/>
              <circle cx="60" cy="60" r="10" fill="#a078c8"/>
              {/* Gear teeth */}
              <path d="M60 20 L65 30 L55 30 Z"/>
              <path d="M100 60 L90 65 L90 55 Z"/>
              <path d="M60 100 L55 90 L65 90 Z"/>
              <path d="M20 60 L30 55 L30 65 Z"/>
              <path d="M85 35 L80 45 L75 40 Z"/>
              <path d="M85 85 L75 80 L80 75 Z"/>
              <path d="M35 85 L45 75 L40 80 Z"/>
              <path d="M35 35 L40 40 L45 45 Z"/>
            </g>
          </svg>
        </div>
        
      </div>
      
      {/* Text content moved to bottom */}
      <div style={{
        position: 'absolute',
        bottom: '120px',
        left: '40px',
        right: '40px',
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#a078c8',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginBottom: '25px'
          }}>Solutions</div>
          <h2 style={{
            fontSize: '2.8rem',
            fontWeight: 300,
            color: '#333333',
            lineHeight: 1.2,
            marginBottom: '30px',
            letterSpacing: '-0.02em'
          }}>
            Comprehensive solutions tailored to your business needs.
          </h2>
          
          <div style={{
            fontSize: '1rem',
            color: '#666666',
            lineHeight: 1.6,
            marginBottom: '40px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <p>
              We provide end-to-end solutions that combine cutting-edge technology 
              with strategic thinking. From initial concept to final deployment, 
              our integrated approach ensures your digital transformation drives 
              measurable results and sustainable growth.
            </p>
          </div>
          
          <div>
            <div style={{
              fontSize: '0.8rem',
              color: '#a078c8',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              EXPLORE OUR COMPLETE SOLUTION SUITE
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}