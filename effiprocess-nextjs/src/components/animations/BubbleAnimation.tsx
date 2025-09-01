'use client'

import { useEffect, useRef } from 'react'

interface BubbleAnimationProps {
  show: boolean
}

interface Dot {
  x: number
  y: number
  targetX: number
  targetY: number
  phi: number
  theta: number
  baseRadius: number
  size: number
  targetSize: number
  opacity: number
  targetOpacity: number
}

export default function BubbleAnimation({ show }: BubbleAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  console.log('BubbleAnimation show prop:', show)

  useEffect(() => {
    console.log('BubbleAnimation useEffect triggered, canvas:', canvasRef.current)
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    const COLOR = { r: 160, g: 120, b: 200 }
    const dots: Dot[] = []

    // Setup canvas
    const setupCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setupCanvas()

    const createOrganicBubble = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.55

      dots.length = 0
      const numPoints = 2200 // deutlich smoother & stabiler

      for (let i = 0; i < numPoints; i++) {
        const phi = Math.acos(1 - 2 * i / numPoints)
        const theta = Math.PI * (1 + Math.sqrt(5)) * i

        const distortion = 1 + Math.sin(phi*4)*0.20 + Math.cos(theta*3)*0.15
        const organic = 0.7 + Math.random()*0.6
        const radius = baseRadius * distortion * organic

        const x = centerX + radius * Math.sin(phi) * Math.cos(theta)
        const y = centerY + radius * Math.sin(phi) * Math.sin(theta)

        const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
        if (distanceFromCenter < 160) continue

        const maxDistance = baseRadius * 1.2
        const size = 1 + (distanceFromCenter / maxDistance) * 2
        const opacity = Math.min(0.9, Math.max(0, (distanceFromCenter - 120) / maxDistance) * 2)

        dots.push({
          x, y, targetX: x, targetY: y,
          phi, theta, baseRadius: radius,
          size, targetSize: size, opacity,
          targetOpacity: opacity
        })
      }
    }

    const updateBubbleBreathing = () => {
      const t = time * 0.0002
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (const dot of dots) {
        const sx = Math.sin(dot.phi) * Math.cos(dot.theta)
        const sy = Math.sin(dot.phi) * Math.sin(dot.theta)

        const main = Math.sin(sx*3 + sy*2 + t*2) * 0.25
        const sec  = Math.sin(sy*4 - sx*1.5 + t*1.2) * 0.15
        const pul  = Math.sin(t*0.8) * 0.12

        const distortion = 1 + main + sec + pul
        const radius = dot.baseRadius * distortion

        dot.targetX = centerX + radius * Math.sin(dot.phi) * Math.cos(dot.theta)
        dot.targetY = centerY + radius * Math.sin(dot.phi) * Math.sin(dot.theta)

        // Check for hero text container collision
        const heroContainer = document.querySelector('.hero-text-container')
        if (heroContainer) {
          const rect = heroContainer.getBoundingClientRect()
          const hx = rect.left + rect.width / 2
          const hy = rect.top + rect.height / 2
          const hrx = Math.max(150, rect.width * 0.60)
          const hry = Math.max(100, rect.height * 0.60)

          const dx = dot.targetX - hx
          const dy = dot.targetY - hy
          const d  = Math.sqrt((dx*dx)/(hrx*hrx) + (dy*dy)/(hry*hry))

          if (d < 0.85) {
            dot.targetOpacity = 0
          } else if (d < 1.10) {
            const p = (d-0.85)/(1.10-0.85)
            dot.targetOpacity = dot.opacity * 0.6 * Math.sin(p*Math.PI*0.5)
          } else {
            dot.targetOpacity = dot.opacity
          }
        }
      }
    }

    let animationId: number

    const animate = () => {
      try {
        time += 16

        if (show) {
          updateBubbleBreathing()
        } else {
          // Fade out dots when not showing
          for (const dot of dots) {
            dot.targetOpacity = 0
          }
        }

        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

        // Always animate and draw dots for smooth transitions
        for (const dot of dots) {
          dot.x += (dot.targetX - dot.x) * 0.08
          dot.y += (dot.targetY - dot.y) * 0.08
          dot.size += (dot.targetSize - dot.size) * 0.12
          dot.opacity += (dot.targetOpacity - dot.opacity) * 0.06

          // Add subtle jitter for organic feel only when showing
          if (show) {
            const jitter = 0.15
            dot.x += (Math.random() - 0.5) * jitter
            dot.y += (Math.random() - 0.5) * jitter
          }

          if (dot.opacity > 0.01 && ctx) {
            ctx.fillStyle = `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, ${dot.opacity})`
            ctx.beginPath()
            ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      } catch (error) {
        console.warn('Animation error:', error)
      }

      // Always continue animation loop - don't stop it based on show
      animationId = requestAnimationFrame(animate)
    }

    // Initialize animation
    createOrganicBubble()
    
    // Start animation with a small delay
    setTimeout(() => {
      animate()
    }, 100)

    const handleResize = () => {
      setupCanvas()
      createOrganicBubble()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="dotAnimation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        display: 'block',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  )
}