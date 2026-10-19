import React from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext.jsx'

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme()

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
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </Button>
  )
}

export default ThemeToggle
