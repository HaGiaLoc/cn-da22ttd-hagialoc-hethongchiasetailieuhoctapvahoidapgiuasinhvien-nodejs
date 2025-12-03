import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useNotification } from '../../contexts/NotificationContext'
import authService from '../../api/authApi'

export default function QuenMatKhau() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!email) {
      setErrors({ email: 'Vui lòng nhập email' })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Email không hợp lệ' })
      return
    }

    setLoading(true)
    try {
      await authService.verifyEmail(email)
      showNotification('Email hợp lệ! Chuyển đến trang đặt lại mật khẩu', 'success', 2000)
      
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 2000)
    } catch (error) {
      showNotification(error.message || 'Email không tồn tại trong hệ thống', 'error', 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BoTri>
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-image">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800" alt="Forgot Password" />
              <div className="auth-image-overlay">
                <h2>Quên mật khẩu?</h2>
                <p>Đừng lo lắng! Chúng tôi sẽ giúp bạn lấy lại mật khẩu</p>
              </div>
            </div>
            
            <div className="auth-form-container">
              <div className="auth-form">
                <h1>Quên mật khẩu</h1>
                <p className="auth-subtitle">
                  Nhập email của bạn để đặt lại mật khẩu
                </p>

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      disabled={loading}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                  </button>
                </form>

                <div className="form-footer">
                  <Link to="/login" className="back-link">
                    <i className="fas fa-arrow-left"></i> Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
