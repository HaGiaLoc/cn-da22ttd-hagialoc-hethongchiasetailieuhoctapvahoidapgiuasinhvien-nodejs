import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-graduation-cap"></i>
          <h2>EduShare Admin</h2>
        </div>
      </div>

      <div className="sidebar-user">
        <img src={user?.avatar} alt={user?.name} className="user-avatar" />
        <div className="user-info">
          <h3>{user?.name}</h3>
          <p>{user?.maQuanTriVien}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/admin" 
          className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
        >
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/admin/documents" 
          className={`nav-item ${isActive('/admin/documents') ? 'active' : ''}`}
        >
          <i className="fas fa-file-alt"></i>
          <span>Quản lý tài liệu</span>
        </Link>

        <Link 
          to="/admin/reports" 
          className={`nav-item ${isActive('/admin/reports') ? 'active' : ''}`}
        >
          <i className="fas fa-flag"></i>
          <span>Báo cáo vi phạm</span>
        </Link>

        <Link 
          to="/admin/users" 
          className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
        >
          <i className="fas fa-users"></i>
          <span>Người dùng</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="nav-item">
          <i className="fas fa-home"></i>
          <span>Về trang chủ</span>
        </Link>
        
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
