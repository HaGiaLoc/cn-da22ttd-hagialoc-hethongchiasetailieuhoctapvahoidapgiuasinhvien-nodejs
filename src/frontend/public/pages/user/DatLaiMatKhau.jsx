import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useNotification } from '../../contexts/NotificationContext'
import authService from '../../api/authApi'

export default function DatLaiMatKhau() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    matKhauMoi: '',
    xacNhanMatKhau: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const email = location.state?.email

  useEffect(() => {
    // Kiểm tra có email từ trang trước không
    if (!email) {
      showNotification('Vui lòng xác thực email trước', 'error', 2000)
      setTimeout(() => {
        navigate('/forgot-password')
      }, 2000)
    }
  }, [email, navigate, showNotification])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.matKhauMoi) {
      newErrors.matKhauMoi = 'Vui lòng nhập mật khẩu mới'
    } else if (formData.matKhauMoi.length < 6) {
      newErrors.matKhauMoi = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = 'Vui lòng xác nhận mật khẩu mới'
    } else if (formData.matKhauMoi !== formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(email, formData.matKhauMoi)
      
      showNotification('Đặt lại mật khẩu thành công!', 'success', 2000)
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      showNotification(error.message || 'Đặt lại mật khẩu thất bại', 'error', 3000)
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <BoTri>
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-image">
              <img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800" alt="Reset Password" />
              <div className="auth-image-overlay">
                <h2>Đặt lại mật khẩu</h2>
                <p>Tạo mật khẩu mới an toàn cho tài khoản của bạn</p>
              </div>
            </div>
            
            <div className="auth-form-container">
              <div className="auth-form">
                <h1>Đặt lại mật khẩu</h1>
                <p className="auth-subtitle">
                  Email: <strong>{email}</strong>
                </p>

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-group">
                    <label>Mật khẩu mới *</label>
                    <input
                      type="password"
                      value={formData.matKhauMoi}
                      onChange={(e) => setFormData({ ...formData, matKhauMoi: e.target.value })}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    {errors.matKhauMoi && <span className="error-text">{errors.matKhauMoi}</span>}
                    <small>Mật khẩu phải có ít nhất 6 ký tự</small>
                  </div>

                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới *</label>
                    <input
                      type="password"
                      value={formData.xacNhanMatKhau}
                      onChange={(e) => setFormData({ ...formData, xacNhanMatKhau: e.target.value })}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    {errors.xacNhanMatKhau && <span className="error-text">{errors.xacNhanMatKhau}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </button>
                </form>

                <div className="password-tips">
                  <h3><i className="fas fa-info-circle"></i> Mẹo tạo mật khẩu mạnh</h3>
                  <ul>
                    <li>Sử dụng ít nhất 8 ký tự</li>
                    <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                    <li>Không sử dụng thông tin cá nhân dễ đoán</li>
                    <li>Không dùng lại mật khẩu của các tài khoản khác</li>
                  </ul>
                </div>

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
