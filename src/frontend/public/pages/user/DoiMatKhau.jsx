import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import authService from '../../api/authApi'


export default function DoiMatKhau() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    matKhauCu: '',
    matKhauMoi: '',
    xacNhanMatKhau: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Đợi loading xong mới kiểm tra user
    if (loading) return
    
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
  }, [user, navigate, loading])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.matKhauCu) {
      newErrors.matKhauCu = 'Vui lòng nhập mật khẩu cũ'
    }

    if (!formData.matKhauMoi) {
      newErrors.matKhauMoi = 'Vui lòng nhập mật khẩu mới'
    } else if (formData.matKhauMoi.length < 6) {
      newErrors.matKhauMoi = 'Mật khẩu phải có ít nhất 6 ký tự'
    } else if (formData.matKhauMoi === formData.matKhauCu) {
      newErrors.matKhauMoi = 'Mật khẩu mới phải khác mật khẩu cũ'
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

    try {
      await authService.changePassword(formData.matKhauCu, formData.matKhauMoi)
      
      showNotification('Đổi mật khẩu thành công!', 'success', 2000)
      
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (error) {
      showNotification(error.message || 'Đổi mật khẩu thất bại', 'error', 3000)
    }
  }

  return (
    <BoTri>
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-key"></i> Đổi mật khẩu</h1>
          <p>Thay đổi mật khẩu để bảo vệ tài khoản của bạn</p>
        </div>
      </section>

      <section className="change-password-section">
        <div className="container">
          <div className="change-password-container">
            <form onSubmit={handleSubmit} className="change-password-form">
              <div className="form-section">
                <div className="form-group">
                  <label>Mật khẩu cũ *</label>
                  <input
                    type="password"
                    value={formData.matKhauCu}
                    onChange={(e) => setFormData({ ...formData, matKhauCu: e.target.value })}
                    placeholder="••••••••"
                  />
                  {errors.matKhauCu && <span className="error-text">{errors.matKhauCu}</span>}
                </div>

                <div className="form-group">
                  <label>Mật khẩu mới *</label>
                  <input
                    type="password"
                    value={formData.matKhauMoi}
                    onChange={(e) => setFormData({ ...formData, matKhauMoi: e.target.value })}
                    placeholder="••••••••"
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
                  />
                  {errors.xacNhanMatKhau && <span className="error-text">{errors.xacNhanMatKhau}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i> Đổi mật khẩu
                </button>
              </div>
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
          </div>
        </div>
      </section>
    </BoTri>
  )
}
