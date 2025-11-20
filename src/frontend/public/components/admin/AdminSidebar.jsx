import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useRef, useEffect } from 'react'

export default function AdminSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navRef = useRef(null)
  const scrollPositionRef = useRef(0)

  const isActive = (path) => location.pathname === path

  // Lưu vị trí cuộn khi component unmount hoặc route thay đổi
  useEffect(() => {
    const navElement = navRef.current
    if (!navElement) return

    const handleScroll = () => {
      scrollPositionRef.current = navElement.scrollTop
    }

    navElement.addEventListener('scroll', handleScroll)
    
    // Khôi phục vị trí cuộn
    if (scrollPositionRef.current > 0) {
      navElement.scrollTop = scrollPositionRef.current
    }

    return () => {
      navElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Cuộn đến item active khi lần đầu load
  useEffect(() => {
    const navElement = navRef.current
    if (!navElement) return

    const activeItem = navElement.querySelector('.nav-item.active')
    if (activeItem && scrollPositionRef.current === 0) {
      const navRect = navElement.getBoundingClientRect()
      const activeRect = activeItem.getBoundingClientRect()
      const offset = activeRect.top - navRect.top - (navRect.height / 2) + (activeRect.height / 2)
      
      if (offset > 0 || offset < -activeRect.height) {
        navElement.scrollTo({
          top: navElement.scrollTop + offset,
          behavior: 'smooth'
        })
      }
    }
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-graduation-cap"></i>
          <h2>KEF Admin</h2>
        </div>
      </div>

      <div className="sidebar-user">
        <img src={user?.avatar} alt={user?.name} className="user-avatar" />
        <div className="user-info">
          <h3>{user?.name}</h3>
          <p>{user?.maQuanTriVien}</p>
        </div>
      </div>

      <nav className="sidebar-nav" ref={navRef}>
        <Link 
          to="/admin" 
          className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
        >
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>

        <div className="nav-section-title">
          <span>CHỨC NĂNG CƠ BẢN</span>
        </div>

        <Link 
          to="/admin/documents" 
          className={`nav-item ${isActive('/admin/documents') ? 'active' : ''}`}
        >
          <i className="fas fa-file-alt"></i>
          <span>Quản lý tài liệu</span>
        </Link>

        <Link 
          to="/admin/questions" 
          className={`nav-item ${isActive('/admin/questions') ? 'active' : ''}`}
        >
          <i className="fas fa-question-circle"></i>
          <span>Quản lý câu hỏi</span>
        </Link>

        <Link 
          to="/admin/answers" 
          className={`nav-item ${isActive('/admin/answers') ? 'active' : ''}`}
        >
          <i className="fas fa-comments"></i>
          <span>Quản lý câu trả lời</span>
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

        <div className="nav-section-title">
          <span>DANH MỤC</span>
        </div>

        <Link 
          to="/admin/categories/subjects" 
          className={`nav-item ${isActive('/admin/categories/subjects') ? 'active' : ''}`}
        >
          <i className="fas fa-book"></i>
          <span>Môn học</span>
        </Link>

        <Link 
          to="/admin/categories/majors" 
          className={`nav-item ${isActive('/admin/categories/majors') ? 'active' : ''}`}
        >
          <i className="fas fa-graduation-cap"></i>
          <span>Ngành</span>
        </Link>

        <Link 
          to="/admin/categories/tags" 
          className={`nav-item ${isActive('/admin/categories/tags') ? 'active' : ''}`}
        >
          <i className="fas fa-tags"></i>
          <span>Tags</span>
        </Link>

        <Link 
          to="/admin/categories/document-types" 
          className={`nav-item ${isActive('/admin/categories/document-types') ? 'active' : ''}`}
        >
          <i className="fas fa-folder"></i>
          <span>Loại tài liệu</span>
        </Link>

        <Link 
          to="/admin/categories/formats" 
          className={`nav-item ${isActive('/admin/categories/formats') ? 'active' : ''}`}
        >
          <i className="fas fa-file-code"></i>
          <span>Định dạng</span>
        </Link>

        <div className="nav-section-title">
          <span>HỆ THỐNG</span>
        </div>

        <Link 
          to="/admin/admins" 
          className={`nav-item ${isActive('/admin/admins') ? 'active' : ''}`}
        >
          <i className="fas fa-user-shield"></i>
          <span>Quản trị viên</span>
        </Link>

        <Link 
          to="/admin/statistics" 
          className={`nav-item ${isActive('/admin/statistics') ? 'active' : ''}`}
        >
          <i className="fas fa-chart-bar"></i>
          <span>Thống kê</span>
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
