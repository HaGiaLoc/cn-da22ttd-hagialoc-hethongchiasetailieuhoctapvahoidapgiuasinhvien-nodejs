import { useEffect } from 'react'

export default function ThongBao({ message, type, onClose, duration = 3000, hasCallback = false }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fa-check-circle'
      case 'error':
        return 'fa-times-circle'
      case 'warning':
        return 'fa-exclamation-triangle'
      case 'loading':
        return 'fa-spinner fa-spin'
      default:
        return 'fa-info-circle'
    }
  }

  return (
    <div className="modal-overlay" onClick={type !== 'loading' ? onClose : undefined}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`notification-content notification-${type}`}>
          <div className="notification-icon">
            <i className={`fas ${getIcon()}`}></i>
          </div>
          <div className="notification-message">
            <p>{message}</p>
          </div>
          {type !== 'loading' && (
            <button className="notification-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        {hasCallback && (
          <div className="notification-actions">
            <button className="btn btn-primary" onClick={onClose}>
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
