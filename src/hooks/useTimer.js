import { useState, useEffect, useCallback } from 'react'

export const useTimer = () => {
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1)
      }, 1000)
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timer])

  const startTimer = useCallback(() => {
    setIsTimerRunning(true)
  }, [])

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    setTimer(0)
    setIsTimerRunning(false)
  }, [])

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    timer,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime
  }
}
