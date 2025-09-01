'use client'

import { useState, useEffect } from 'react'

interface LogoData {
  data_uri: string
  alt?: string
}

export default function Header() {
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  
  useEffect(() => {
    // Load the header logo from ep_logo.json
    const loadHeaderLogo = async () => {
      try {
        const response = await fetch('/ep_logo.json')
        const logoData: LogoData = await response.json()
        
        if (logoData.data_uri) {
          setLogoSrc(logoData.data_uri)
        }
      } catch (error) {
        console.log('Logo could not be loaded:', error)
      }
    }

    loadHeaderLogo()
  }, [])

  const handleLogoClick = () => {
    // Force go to slide 0
    window.dispatchEvent(new CustomEvent('goToSlide', { detail: 0 }))
  }

  return (
    <header className="header">
      <div className="header-logo-container" onClick={handleLogoClick}>
        {logoSrc ? (
          <img
            src={logoSrc}
            alt="Effiprocess Logo"
            className="header-logo-image"
            width={56}
            height={56}
          />
        ) : (
          <div className="header-logo">EP</div>
        )}
      </div>
    </header>
  )
}