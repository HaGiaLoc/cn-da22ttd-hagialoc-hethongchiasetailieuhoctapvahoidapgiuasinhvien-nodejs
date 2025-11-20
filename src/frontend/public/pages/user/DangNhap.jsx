import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

export default function DangNhap() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})

  // Lấy trang trước đó từ location state, mặc định là trang chủ
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Vui lòng nhập email' }))
      return
    }

    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Vui lòng nhập mật khẩu' }))
      return
    }

    try {
      await login(formData.email, formData.password, formData.rememberMe)
      showNotification('Đăng nhập thành công!', 'success', 1000)
      
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 2000)
    } catch (error) {
      showNotification(error.message || 'Đăng nhập thất bại', 'error', 3000)
    }
  }

  return (
    <BoTri>
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" alt="Students" />
              <div className="auth-image-overlay">
                <h2>Chào mừng trở lại!</h2>
                <p>Đăng nhập để tiếp tục chia sẻ và học tập cùng cộng đồng sinh viên</p>
              </div>
            </div>
            
            <div className="auth-form-container">
              <div className="auth-form">
                <h1>Đăng nhập</h1>
                <p className="auth-subtitle">
                  Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      autoComplete="on"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      autoComplete="on"
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className="form-options">
                    <label className="checkbox">
                      <input 
                        type="checkbox" 
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" className="forgot-password">Quên mật khẩu?</a>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    Đăng nhập
                  </button>
                </form>

                <div className="divider">
                  <span>hoặc đăng nhập với</span>
                </div>

                <div className="social-login">
                  <button className="btn btn-social btn-google">
                    <i className="fab fa-google"></i> Google
                  </button>
                  <button className="btn btn-social btn-facebook">
                    <i className="fab fa-facebook"></i> Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
