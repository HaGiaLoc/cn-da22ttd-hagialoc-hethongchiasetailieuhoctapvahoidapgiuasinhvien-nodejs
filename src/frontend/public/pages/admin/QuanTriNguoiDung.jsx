import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { adminService } from '../../services'
import { generateAvatar } from '../../utils/helpers'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/helpers'

export default function QuanTriNguoiDung() {
  const { showNotification } = useNotification()
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setIsLoading(true)
      const res = await adminService.getAllUsers()
      setStudents(res.data?.students || [])
    } catch (error) {
      console.error('Error loading students:', error)
      showNotification('Không thể tải danh sách người dùng', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (student) => {
    setEditingStudent({ ...student })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    try {
      await adminService.updateStudent(editingStudent.maSinhVien, editingStudent)
      await loadStudents()
      setShowEditModal(false)
      setEditingStudent(null)
      showNotification('Đã cập nhật thông tin người dùng', 'success', 2000)
    } catch (error) {
      showNotification('Cập nhật thông tin thất bại', 'error', 3000)
    }
  }

  const handleToggleLock = async (student) => {
    const action = student.trangThaiTK === 'not_banned' ? 'khóa' : 'mở khóa'
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) {
      try {
        const newStatus = student.trangThaiTK === 'not_banned' ? 'banned' : 'not_banned'
        await adminService.updateStudentStatus(student.maSinhVien, newStatus)
        await loadStudents()
        showNotification(`Đã ${action} tài khoản`, 'success', 2000)
      } catch (error) {
        showNotification(`${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản thất bại`, 'error', 3000)
      }
    }
  }

  const handleDelete = async (studentId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await adminService.deleteStudent(studentId)
        setStudents(students.filter(s => s.maSinhVien !== studentId))
        showNotification('Đã xóa người dùng', 'success', 2000)
      } catch (error) {
        showNotification('Xóa người dùng thất bại', 'error', 3000)
      }
    }
  }

  const filteredStudents = students.filter(s =>
    (s.hoTenSV || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.emailSV || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.maSinhVien || '').toString().includes(searchTerm.toLowerCase())
  )
  // sort by numeric student ID ascending
  const sortedStudents = filteredStudents.slice().sort((a, b) => Number(a.maSinhVien) - Number(b.maSinhVien))

  return (
    <BoTriQuanTri>
      <section className="admin-section">
          <div className="admin-header">
            <div>
              <h1><i className="fas fa-users"></i> Quản lý người dùng</h1>
              <p>Quản lý tài khoản sinh viên</p>
            </div>
          </div>

          {/* Search */}
          <div className="admin-filters">
            <div className="filter-group search-group">
              <label>Tìm kiếm:</label>
              <input
                type="text"
                placeholder="Tìm theo tên, email hoặc ID Tài Khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-stats">
              <span>Tổng: <strong>{filteredStudents.length}</strong> người dùng</span>
            </div>
          </div>

          {/* Users Table */}
          <div className="admin-card">
            {isLoading && (
              <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#666', marginBottom: '20px' }}></i>
                <p>Đang tải danh sách người dùng...</p>
              </div>
            )}
            
            {!isLoading && filteredStudents.length === 0 && (
              <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fas fa-users" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
                <h3>Không có người dùng nào</h3>
                <p>{searchTerm ? 'Không tìm thấy người dùng phù hợp với từ khóa tìm kiếm.' : 'Chưa có người dùng nào trong hệ thống.'}</p>
              </div>
            )}
            
            {!isLoading && filteredStudents.length > 0 && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Tài Khoản</th>
                    <th>Avatar</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Trường</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map(student => (
                    <tr key={student.maSinhVien}>
                      <td><strong>{student.maSinhVien}</strong></td>
                      <td>
                        <img
                          src={student.avatarURL || generateAvatar(student.hoTenSV)}
                          alt={student.hoTenSV}
                          className="user-avatar-small"
                        />
                      </td>
                      <td>{student.hoTenSV}</td>
                      <td>{student.emailSV}</td>
                      <td>{student.truongHoc || 'Chưa cập nhật'}</td>
                      <td>{formatDate(student.ngayTao)}</td>
                      <td>
                        <span className={`badge badge-${student.trangThaiTK === 'not_banned' ? 'success' : 'danger'}`}>
                          {student.trangThaiTK === 'not_banned' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(student)}
                            title="Sửa thông tin"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className={`btn btn-sm ${student.trangThaiTK === 'not_banned' ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => handleToggleLock(student)}
                            title={student.trangThaiTK === 'not_banned' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            <i className={`fas fa-${student.trangThaiTK === 'not_banned' ? 'lock' : 'unlock'}`}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>

          {/* Edit Modal */}
          {showEditModal && editingStudent && (
            <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Chỉnh sửa thông tin sinh viên</h2>
                  <button className="modal-close" onClick={() => setShowEditModal(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>ID Tài Khoản</label>
                    <input
                      type="text"
                      value={editingStudent.maSinhVien}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input
                      type="text"
                      value={editingStudent.hoTenSV}
                      onChange={(e) => setEditingStudent({ ...editingStudent, hoTenSV: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editingStudent.emailSV}
                      onChange={(e) => setEditingStudent({ ...editingStudent, emailSV: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Trường học</label>
                    <input
                      type="text"
                      value={editingStudent.truongHoc || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, truongHoc: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={() => setShowEditModal(false)}>
                    Hủy
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveEdit}>
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          )}
      </section>
    </BoTriQuanTri>
  )
}
