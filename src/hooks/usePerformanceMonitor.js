import { useEffect, useRef } from 'react'

export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0)
  const lastRenderTime = useRef(performance.now())

  useEffect(() => {
    renderCount.current += 1
    const currentTime = performance.now()
    const timeSinceLastRender = currentTime - lastRenderTime.current
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] Render #${renderCount.current} (${timeSinceLastRender.toFixed(2)}ms since last render)`)
    }
    
    lastRenderTime.current = currentTime
  })

  return {
    renderCount: renderCount.current,
    timeSinceLastRender: performance.now() - lastRenderTime.current
  }
}

export default usePerformanceMonitor
