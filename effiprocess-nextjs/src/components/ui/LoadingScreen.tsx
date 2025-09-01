'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 15 + 5
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      className="loading-screen"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <div className="loading-content">
        <div className="loading-logo">
          {/* Logo wird durch Animation ersetzt */}
        </div>
        <div className="loading-progress">
          <div className="progress-label">LOADING</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-number">{Math.floor(progress)}</div>
          <div className="quality-text">QUALITY IS OUR STANDARD</div>
        </div>
      </div>
    </motion.div>
  )
}