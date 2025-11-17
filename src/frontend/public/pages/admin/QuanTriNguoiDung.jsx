import { useState } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { mockStudents, generateAvatar } from '../../data/mockData'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/helpers'

export default function QuanTriNguoiDung() {
  const { showNotification } = useNotification()
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState('')

  const handleToggleStatus = (studentId) => {
    const updated = students.map(s =>
      s.id === studentId ? { ...s, isActive: !s.isActive } : s
    )
    setStudents(updated)
    showNotification('Đã cập nhật trạng thái người dùng', 'success', 1000)
  }

  const handleDelete = (studentId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setStudents(students.filter(s => s.id !== studentId))
      showNotification('Đã xóa người dùng', 'success', 1000)
    }
  }

  const filteredStudents = students.filter(s =>
    s.hoTenSinhVien.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.maSinhVien.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                placeholder="Tìm theo tên, email hoặc mã sinh viên..."
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
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Trường</th>
                    <th>Ngành</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <img
                          src={student.avatar || generateAvatar(student.hoTenSinhVien)}
                          alt={student.hoTenSinhVien}
                          className="user-avatar-small"
                        />
                      </td>
                      <td><strong>{student.maSinhVien}</strong></td>
                      <td>{student.hoTenSinhVien}</td>
                      <td>{student.email}</td>
                      <td>{student.truongHoc || 'Chưa cập nhật'}</td>
                      <td>{student.nganh || 'Chưa cập nhật'}</td>
                      <td>{formatDate(student.ngayTao)}</td>
                      <td>
                        <span className={`badge badge-${student.isActive !== false ? 'success' : 'danger'}`}>
                          {student.isActive !== false ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className={`btn btn-sm ${student.isActive !== false ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggleStatus(student.id)}
                            title={student.isActive !== false ? 'Khóa tài khoản' : 'Mở khóa'}
                          >
                            <i className={`fas fa-${student.isActive !== false ? 'lock' : 'unlock'}`}></i>
                          </button>
                          <Link
                            to={`/profile/${student.id}`}
                            className="btn btn-sm btn-outline"
                            target="_blank"
                            title="Xem hồ sơ"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleDelete(student.id)}
                            title="Xóa"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="9" className="empty-state">
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
      </section>
    </BoTriQuanTri>
  )
}
