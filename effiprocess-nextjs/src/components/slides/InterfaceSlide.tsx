'use client'

export default function InterfaceSlide() {
  return (
    <section className="slide" style={{ 
      background: '#f5f5f5', 
      zIndex: 10,
      position: 'relative',
      width: '100%',
      height: '100vh'
    }}>
      {/* Main container with 50/50 split */}
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center'
      }}>
        {/* Left side - Interface mockup */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '50%',
          padding: '0 40px'
        }}>
          {/* Mobile interface mockup */}
          <div style={{
            width: '300px',
            height: '450px',
            backgroundColor: '#ffffff',
            borderRadius: '25px',
            border: '3px solid #e0e0e0',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            {/* Screen content */}
            <div style={{
              padding: '40px 30px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <div style={{
                  width: '30px',
                  height: '4px',
                  backgroundColor: '#a078c8',
                  borderRadius: '2px'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#ddd',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#ddd',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#ddd',
                  borderRadius: '50%'
                }}></div>
              </div>
              
              {/* Content bars */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  height: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '6px',
                  width: '80%'
                }}></div>
                <div style={{
                  height: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '6px',
                  width: '60%'
                }}></div>
                <div style={{
                  height: '12px',
                  backgroundColor: '#a078c8',
                  borderRadius: '6px',
                  width: '90%',
                  opacity: 0.7
                }}></div>
                <div style={{
                  height: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '6px',
                  width: '70%'
                }}></div>
                <div style={{
                  height: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '6px',
                  width: '85%'
                }}></div>
              </div>
              
              {/* Bottom section */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '30px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#a078c8',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ddd',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ddd',
                  borderRadius: '50%'
                }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Content */}
        <div style={{
          flex: 1,
          padding: '0 40px 0 120px',
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
          }}>MODERN INTERFACES</div>
          
          <h2 style={{
            fontSize: '3.2rem',
            fontWeight: 300,
            color: '#333333',
            lineHeight: 1.15,
            marginBottom: '40px',
            letterSpacing: '-0.02em'
          }}>
            At its heart, interface isn&apos;t<br/>
            about structures.<br/>
            It&apos;s about people.
          </h2>
          
          <div style={{
            fontSize: '1rem',
            color: '#666666',
            lineHeight: 1.65,
            marginBottom: '50px'
          }}>
            We strive to go above and beyond for our clients, fostering a relationship built on 
            trust, confidence and honesty. Maybe it&apos;s our family orientation, but we think the 
            most satisfying part of what we do is that we get to work with so many wonderful 
            people. We&apos;re proud that we&apos;re a 100% women-owned business certified by the 
            Women&apos;s Business Development Center (WBDC). We&apos;re also proud that we put 
            people first, with monthly reward programs and team-building activities throughout 
            the year.
          </div>
          
          <div style={{
            fontSize: '0.8rem',
            color: '#9a9a9a',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            DISCOVER MORE ABOUT OUR PERSONAL COMMITMENT
          </div>
        </div>
      </div>
      
      {/* Left side: Large number */}
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
          color: '#a078c8',
          transform: 'rotate(-90deg)',
          whiteSpace: 'nowrap',
          fontFamily: "'SF Mono', Monaco, monospace"
        }}>02/06</div>
      </div>
    </section>
  )
}