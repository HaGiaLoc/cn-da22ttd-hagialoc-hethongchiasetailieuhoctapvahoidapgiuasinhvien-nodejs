import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function StudentRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Đang tải...</div>
      </div>
    )
  }

  // Chỉ cho phép sinh viên truy cập
  if (!user || user.role !== 'student') {
    return <Navigate to="/" replace />
  }

  return children
}
