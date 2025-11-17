import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { mockStudents, generateAvatar } from '../../data/mockData'

export default function ChinhSuaHoSo() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser, loading } = useAuth()
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    hoTenSinhVien: '',
    email: '',
    truongHoc: '',
    nganh: ''
  })
  const [avatarPreview, setAvatarPreview] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Đợi loading xong mới kiểm tra user
    if (loading) return
    
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    // Tìm thông tin sinh viên từ mockStudents
    const student = mockStudents.find(s => s.id === user.id)
    if (student) {
      setFormData({
        hoTenSinhVien: student.hoTenSinhVien,
        email: student.email,
        truongHoc: student.truongHoc || '',
        nganh: student.nganh || ''
      })
      setAvatarPreview(student.avatar || generateAvatar(student.hoTenSinhVien))
    }
  }, [user, navigate, loading])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetAvatar = () => {
    if (user) {
      setAvatarPreview(generateAvatar(formData.hoTenSinhVien || user.name))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.hoTenSinhVien.trim()) {
      newErrors.hoTenSinhVien = 'Vui lòng nhập họ tên'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Giả lập cập nhật thông tin
    showNotification('Đang cập nhật hồ sơ...', 'loading', 0)

    setTimeout(() => {
      // Cập nhật thông tin trong mockStudents
      const studentIndex = mockStudents.findIndex(s => s.id === user.id)
      if (studentIndex !== -1) {
        mockStudents[studentIndex] = {
          ...mockStudents[studentIndex],
          hoTenSinhVien: formData.hoTenSinhVien,
          email: formData.email,
          truongHoc: formData.truongHoc,
          nganh: formData.nganh,
          avatar: avatarPreview
        }
      }
      
      // Cập nhật user trong context và localStorage
      const updatedUser = {
        ...user,
        name: formData.hoTenSinhVien,
        email: formData.email,
        truongHoc: formData.truongHoc,
        nganh: formData.nganh,
        avatar: avatarPreview
      }
      
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      showNotification('Cập nhật hồ sơ thành công!', 'success', 1000)
      
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    }, 1500)
  }

  return (
    <BoTri>
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-user-edit"></i> Chỉnh sửa hồ sơ</h1>
          <p>Cập nhật thông tin cá nhân của bạn</p>
        </div>
      </section>

      <section className="edit-profile-section">
        <div className="container">
          <div className="edit-profile-container">
            <form onSubmit={handleSubmit} className="edit-profile-form">
              {/* Avatar Section */}
              <div className="form-section">
                <h3>Ảnh đại diện</h3>
                <div className="avatar-upload">
                  <div className="avatar-preview">
                    <img src={avatarPreview} alt="Avatar" />
                  </div>
                  <div className="avatar-upload-info">
                    <label htmlFor="avatar" className="btn btn-outline">
                      <i className="fas fa-camera"></i> Chọn ảnh
                    </label>
                    <button type="button" className="btn btn-outline" onClick={resetAvatar}>
                      <i className="fas fa-undo"></i> Ảnh mặc định
                    </button>
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <small>JPG, PNG hoặc GIF. Tối đa 2MB.</small>
                  </div>
                </div>
              </div>

              {/* Personal Info Section */}
              <div className="form-section">
                <h3>Thông tin cá nhân</h3>
                
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    value={formData.hoTenSinhVien}
                    onChange={(e) => setFormData({ ...formData, hoTenSinhVien: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.hoTenSinhVien && <span className="error-text">{errors.hoTenSinhVien}</span>}
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

                <div className="form-row">
                  <div className="form-group">
                    <label>Trường học</label>
                    <input
                      type="text"
                      value={formData.truongHoc}
                      onChange={(e) => setFormData({ ...formData, truongHoc: e.target.value })}
                      placeholder="Nhập tên trường học"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngành</label>
                    <input
                      type="text"
                      value={formData.nganh}
                      onChange={(e) => setFormData({ ...formData, nganh: e.target.value })}
                      placeholder="Nhập tên ngành"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
