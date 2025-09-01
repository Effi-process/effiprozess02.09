'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Header from '@/components/ui/Header'
import Navigation from '@/components/ui/Navigation'
import HeroSlide from '@/components/slides/HeroSlide'
import ServicesSlide from '@/components/slides/ServicesSlide'
import InterfaceSlide from '@/components/slides/InterfaceSlide'
import AISlide from '@/components/slides/AISlide'
import ProblemsSlide from '@/components/slides/ProblemsSlide'
import SolutionsSlide from '@/components/slides/SolutionsSlide'
import CalculatorSlide from '@/components/slides/CalculatorSlide'
import BubbleAnimation from '@/components/animations/BubbleAnimation'

const slides = [
  { id: 'hero', component: HeroSlide, theme: 'light' },
  { id: 'services', component: ServicesSlide, theme: 'light' },
  { id: 'interface', component: InterfaceSlide, theme: 'light' },
  { id: 'ai', component: AISlide, theme: 'light' },
  { id: 'problems', component: ProblemsSlide, theme: 'dark' },
  { id: 'solutions', component: SolutionsSlide, theme: 'light' },
  { id: 'calculator', component: CalculatorSlide, theme: 'light' },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(false) // Kein Loading für Debug
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Loading sequence
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const goToSlide = (nextIndex: number) => {
    if (isTransitioning || nextIndex === currentSlide) return
    
    const clampedIndex = Math.max(0, Math.min(slides.length - 1, nextIndex))
    const dir = clampedIndex > currentSlide ? 1 : -1
    
    // Set CSS direction variable for transitions
    document.documentElement.style.setProperty('--dir', String(dir))
    
    setDirection(dir)
    setIsTransitioning(true)
    
    // Add leaving class to current slide
    const currentSlideEl = document.querySelector('.slide.is-active')
    if (currentSlideEl) {
      currentSlideEl.classList.add('is-leaving')
      currentSlideEl.classList.remove('is-active')
    }
    
    // Update current slide
    setCurrentSlide(clampedIndex)
    
    // Update body class for dark theme
    document.body.classList.toggle('is-dark', clampedIndex === 4)
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false)
      // Clean up transition classes
      const leavingSlide = document.querySelector('.slide.is-leaving')
      if (leavingSlide) {
        leavingSlide.classList.remove('is-leaving')
      }
    }, 520)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || isTransitioning) return
    
    switch (e.key) {
      case 'ArrowUp':
      case 'PageUp':
        goToSlide(currentSlide - 1)
        break
      case 'ArrowDown':
      case 'PageDown':
        goToSlide(currentSlide + 1)
        break
      case 'Home':
        goToSlide(0)
        break
      case 'End':
        goToSlide(slides.length - 1)
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    
    // Logo click handler
    const handleLogoClick = (e: Event) => {
      const customEvent = e as CustomEvent
      goToSlide(customEvent.detail)
    }
    window.addEventListener('goToSlide', handleLogoClick)
    
    // Robust scroll-to-slide navigation system 
    let isScrolling = false
    let lastScrollTime = 0
    const SCROLL_COOLDOWN = 1000
    const SCROLL_DEBOUNCE = 50
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isScrolling || isTransitioning) return
      
      const now = Date.now()
      if (now - lastScrollTime < SCROLL_DEBOUNCE) return
      
      isScrolling = true
      lastScrollTime = now
      
      if (e.deltaY > 0) {
        goToSlide(currentSlide + 1)
      } else if (e.deltaY < 0) {
        goToSlide(currentSlide - 1)
      }
      
      setTimeout(() => {
        isScrolling = false
      }, SCROLL_COOLDOWN)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [currentSlide, isTransitioning])

  if (isLoading) {
    return <LoadingScreen />
  }

  const CurrentSlideComponent = slides[currentSlide].component
  
  // Debug logging entfernt

  return (
    <>
      {/* Canvas für Bubble Animation - always mounted, but only visible on hero */}
      <BubbleAnimation show={currentSlide === 0} />
      
      <Header />
      <Navigation 
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNavigate={goToSlide}
        disabled={isTransitioning}
      />
      
      {/* Vollbild-Slides */}
      <main id="slides" className="loaded" style={{position: 'relative', zIndex: 10, height: '100vh', overflow: 'hidden'}}>
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`slide ${slide.id} ${index === currentSlide ? 'is-active' : ''}`}
            style={{
              zIndex: index === currentSlide ? 2 : 1
            }}
          >
            {index === currentSlide && <slide.component />}
          </div>
        ))}
      </main>
    </>
  )
}
