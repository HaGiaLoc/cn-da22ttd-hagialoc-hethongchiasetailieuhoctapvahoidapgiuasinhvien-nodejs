import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { generateAvatar } from '../data/mockData'

export default function ThanhDieuHuong() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const profileRef = useRef(null)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileDropdownOpen])

  return (
    <nav className={`navbar ${isAuthenticated ? 'navbar-logged' : ''}`}>
      <div className="container">
        <div className="nav-brand">
          <Link to="/">
            <i className="fas fa-graduation-cap"></i>
            <span>EduShare</span>
          </Link>
        </div>
        
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`} id="navMenu">
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/documents">Tài liệu</Link></li>
          <li><Link to="/qa">Hỏi đáp</Link></li>
        </ul>
        
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="btn btn-primary">
                <i className="fas fa-upload"></i> Upload
              </Link>
              <div 
                ref={profileRef}
                className={`nav-profile ${profileDropdownOpen ? 'active' : ''}`} 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <img src={user?.avatar || generateAvatar(user?.name)} alt={user?.name} />
                <div className="profile-dropdown">
                  <Link to="/profile">
                    <i className="fas fa-user"></i> Hồ sơ
                  </Link>
                  <Link to="/my-documents">
                    <i className="fas fa-file-alt"></i> Tài liệu của tôi
                  </Link>
                  <Link to="/my-questions">
                    <i className="fas fa-question-circle"></i> Câu hỏi của tôi
                  </Link>
                  <Link to="/change-password">
                    <i className="fas fa-key"></i> Đổi mật khẩu
                  </Link>
                  <hr />
                  <a href="#" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng ký</Link>
            </>
          )}
        </div>
        
        <div className="hamburger" id="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}
