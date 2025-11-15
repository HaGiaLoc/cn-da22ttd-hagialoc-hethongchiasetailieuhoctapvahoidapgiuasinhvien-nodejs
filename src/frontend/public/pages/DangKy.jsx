import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BoTri from '../components/BoTri'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'

export default function DangKy() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validation
    let newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'Vui lòng nhập họ'
    if (!formData.lastName) newErrors.lastName = 'Vui lòng nhập tên'
    if (!formData.email) newErrors.email = 'Vui lòng nhập email'
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await register(formData)
      showNotification('Đăng ký thành công!', 'success', 2000)
      
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
                  <div className="form-row">
                    <div className="form-group">
                      <label>Họ *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Nguyễn"
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label>Tên *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Văn A"
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Mật khẩu *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label>Xác nhận mật khẩu *</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    Đăng ký
                  </button>
                </form>

                <div className="divider">
                  <span>hoặc đăng ký với</span>
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
