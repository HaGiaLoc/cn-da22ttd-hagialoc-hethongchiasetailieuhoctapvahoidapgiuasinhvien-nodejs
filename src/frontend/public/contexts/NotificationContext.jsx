import { createContext, useContext, useState, useCallback } from 'react'
import ThongBao from '../components/ThongBao'

const NotificationContext = createContext()

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null)

  const showNotification = useCallback((message, type = 'info', duration = 3000, onClose = null) => {
    setNotification({ message, type, duration, onClose })
  }, [])

  const hideNotification = useCallback(() => {
    const currentOnClose = notification?.onClose
    setNotification(null)
    
    // Gọi callback sau khi đã đóng modal
    if (currentOnClose) {
      setTimeout(() => {
        currentOnClose()
      }, 100)
    }
  }, [notification])

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <ThongBao
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={hideNotification}
          hasCallback={!!notification.onClose}
        />
      )}
    </NotificationContext.Provider>
  )
}
