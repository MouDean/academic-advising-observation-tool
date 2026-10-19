import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Load theme from localStorage on mount
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // Default to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark ? 'dark' : 'light')
      }
    }
  }, [])

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Apply theme to document
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      
      // Save to localStorage
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
