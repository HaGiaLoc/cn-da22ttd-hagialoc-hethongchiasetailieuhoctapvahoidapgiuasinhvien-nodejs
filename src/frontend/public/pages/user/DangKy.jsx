import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

export default function DangKy() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    hoTenSV: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validation
    let newErrors = {}
    if (!formData.hoTenSV) newErrors.hoTenSV = 'Vui lòng nhập họ tên'
    if (!formData.email) newErrors.email = 'Vui lòng nhập email'
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu'
    if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await register(formData)
      showNotification('Đăng ký thành công!', 'success', 1000)
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      showNotification(error.message || 'Đăng ký thất bại', 'error', 3000)
    }
  }

  return (
    <BoTri>
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-image">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800" alt="Students" />
              <div className="auth-image-overlay">
                <h2>Tham gia cộng đồng!</h2>
                <p>Đăng ký để chia sẻ tài liệu và kết nối với hàng ngàn sinh viên</p>
              </div>
            </div>
            
            <div className="auth-form-container">
              <div className="auth-form">
                <h1>Đăng ký tài khoản</h1>
                <p className="auth-subtitle">
                  Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-group">
                    <label>Họ tên *</label>
                    <input
                      type="text"
                      value={formData.hoTenSV}
                      onChange={(e) => setFormData({ ...formData, hoTenSV: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      autoComplete="on"
                    />
                    {errors.hoTenSV && <span className="error-text">{errors.hoTenSV}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
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
                    <label>Mật khẩu *</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                      </button>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label>Xác nhận mật khẩu *</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    Đăng ký
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
