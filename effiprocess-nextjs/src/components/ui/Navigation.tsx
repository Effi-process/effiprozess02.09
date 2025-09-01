'use client'

interface NavigationProps {
  currentSlide: number
  totalSlides: number
  onNavigate: (index: number) => void
  disabled: boolean
}

export default function Navigation({ currentSlide, totalSlides, onNavigate, disabled }: NavigationProps) {
  return (
    <div className="nav-vertical">
      <button
        className="arrow up"
        onClick={() => onNavigate(currentSlide - 1)}
        disabled={disabled || currentSlide === 0}
        style={{ 
          display: currentSlide === 0 ? 'none' : 'flex',
          opacity: disabled ? 0.5 : 1 
        }}
      >
        ▲
      </button>
      
      <button
        className="arrow down"
        onClick={() => onNavigate(currentSlide + 1)}
        disabled={disabled || currentSlide === totalSlides - 1}
        style={{ 
          display: currentSlide === totalSlides - 1 ? 'none' : 'flex',
          opacity: disabled ? 0.5 : 1 
        }}
      >
        ▼
      </button>
    </div>
  )
}