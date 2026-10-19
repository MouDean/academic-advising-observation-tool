import React from 'react'
import { Toaster, toast } from 'sonner'

export const showNotification = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message)
}

const NotificationProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </>
  )
}

export default NotificationProvider
