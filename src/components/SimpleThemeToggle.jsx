import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Sun, Moon } from 'lucide-react'

const SimpleThemeToggle = ({ className = '', onThemeChange }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(prefersDark)
    applyTheme(prefersDark)
    
    // Notify parent component of initial theme
    if (onThemeChange) {
      onThemeChange(prefersDark)
    }
  }, [onThemeChange])

  const applyTheme = (dark) => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    
    // Notify parent component of theme change
    if (onThemeChange) {
      onThemeChange(newTheme)
    }
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className={`gap-2 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </Button>
  )
}

export default SimpleThemeToggle
