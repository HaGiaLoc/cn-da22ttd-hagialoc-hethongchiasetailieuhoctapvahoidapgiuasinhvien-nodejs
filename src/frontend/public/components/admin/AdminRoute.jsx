import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  // Đợi AuthContext load xong từ localStorage
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#4F46E5' }}></i>
    </div>
  }

  // Nếu chưa đăng nhập hoặc không phải admin, chuyển đến trang đăng nhập
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}
