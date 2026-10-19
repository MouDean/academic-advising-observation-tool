import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Lock, Eye, EyeOff, Mail, Linkedin } from 'lucide-react'
import Logo from '@/assets/Logoo.svg'
import DarkLogo from '@/assets/Dark.svg'
import SimpleThemeToggle from '@/components/SimpleThemeToggle.jsx'

const LockPage = ({ onUnlock }) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    // Load initial theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === 'demo-observe') {
      // Store authentication in localStorage
      localStorage.setItem('isAuthenticated', 'true')
      onUnlock()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
    
    setIsLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleThemeChange = (dark) => {
    setIsDark(dark)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Theme toggle and contact buttons positioned in top-right corner */}
      <div className="absolute top-4 right-4 flex gap-2">
        <SimpleThemeToggle onThemeChange={handleThemeChange} />
        <Button 
          onClick={() => window.open('mailto:maintainer@example.org', '_blank')} 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <Mail className="w-4 h-4" />
          Email
        </Button>
        <Button 
          onClick={() => window.open('https://www.linkedin.com/in/mousa-alhatti', '_blank')} 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-1">
            <img src={isDark ? DarkLogo : Logo} alt="Logo" className="h-80 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Academic Advising Observation Tool
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Research demo — enter demo-observe to explore
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pr-10"
                  required
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading || !password.trim()}
            >
              <Lock className="h-4 h-4" />
              {isLoading ? 'Unlocking...' : 'Unlock Application'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LockPage
