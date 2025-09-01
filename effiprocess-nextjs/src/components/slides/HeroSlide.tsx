export default function HeroSlide() {
  return (
    <section className="slide hero" style={{
      background: 'transparent',
      position: 'relative',
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    }}>
      <div className="hero-text-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 100,
        width: '100%',
        position: 'relative',
        transform: 'translateY(-60px)'
      }}>
        <h2 className="hero-main-text" style={{
          fontSize: '1.5rem',
          color: '#808080',
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
          maxWidth: '750px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 100,
          margin: '0',
          padding: '20px'
        }}>
          <span style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 300 }}>Modern websites</span><br/>
          <span style={{ fontFamily: "'Georgia', serif", fontWeight: 400 }}>interfaces</span><br/>
          <span style={{ fontFamily: "'SF Mono', Monaco, monospace", fontWeight: 400 }}>artificial intelligence</span><br/>
          <span style={{ fontFamily: "'Times New Roman', serif", fontWeight: 300 }}>for your</span><br/>
          <span style={{ color: '#a078c8', fontFamily: "'Arial', sans-serif", fontWeight: 500 }}>efficient processes</span>
        </h2>
      </div>
    </section>
  )
}