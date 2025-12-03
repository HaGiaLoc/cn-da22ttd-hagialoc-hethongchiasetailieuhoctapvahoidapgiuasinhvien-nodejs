import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { adminService } from '../../api'
import { searchMatch } from '../../utils/helpers'

export default function QuanTriMonHoc() {
  const { showNotification } = useNotification()
  const [subjects, setSubjects] = useState([])
  const [majors, setMajors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    tenMon: '',
    maNganh: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [subjectsRes, majorsRes] = await Promise.all([
        adminService.getAllSubjects(),
        adminService.getAllMajors()
      ])
      setSubjects((subjectsRes.data || []).sort((a, b) => a.maMon - b.maMon))
      setMajors(majorsRes.data || [])
    } catch (error) {
      console.error('Error loading subjects:', error)
      showNotification('Không thể tải danh sách môn học', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSubject) {
        await adminService.updateSubject(editingSubject.maMon, formData)
        showNotification('Đã cập nhật môn học', 'success', 2000)
      } else {
        await adminService.createSubject(formData)
        showNotification('Đã thêm môn học mới', 'success', 2000)
      }
      setShowModal(false)
      setEditingSubject(null)
      setFormData({ tenMon: '', maNganh: '' })
      loadData()
    } catch (error) {
      showNotification('Thao tác thất bại', 'error', 3000)
    }
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({
      tenMon: subject.tenMon,
      maNganh: subject.maNganh
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa môn học này?')) {
      try {
        await adminService.deleteSubject(id)
        showNotification('Đã xóa môn học', 'success', 2000)
        loadData()
      } catch (error) {
        showNotification('Xóa môn học thất bại', 'error', 3000)
      }
    }
  }

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-book"></i> Quản lý môn học</h1>
            <p>Quản lý danh sách môn học trong hệ thống</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Thêm môn học
          </button>
        </div>

        {/* Search Bar */}
        <div className="admin-filters">
          <div className="filter-group search-group">
            <label>Tìm kiếm thông minh:</label>
            <input
              type="text"
              placeholder="Tìm kiếm môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-stats">
            <span>Tổng: <strong>{subjects.filter(s => 
              searchMatch(s.tenMon, searchTerm) || 
              searchMatch(s.tenNganh, searchTerm) ||
              String(s.maMon).includes(searchTerm.trim())
            ).length}</strong> môn học</span>
          </div>
        </div>

        <div className="admin-card">
          {isLoading ? (
            <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#666' }}></i>
              <p>Đang tải...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên môn</th>
                    <th>Ngành</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.filter(s => 
                    searchMatch(s.tenMon, searchTerm) || 
                    searchMatch(s.tenNganh, searchTerm) ||
                    String(s.maMon).includes(searchTerm.trim())
                  ).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        {searchTerm ? 'Không tìm thấy môn học phù hợp' : 'Chưa có môn học nào'}
                      </td>
                    </tr>
                  ) : (
                    subjects.filter(s => 
                      searchMatch(s.tenMon, searchTerm) || 
                      searchMatch(s.tenNganh, searchTerm) ||
                      String(s.maMon).includes(searchTerm.trim())
                    ).map(subject => (
                      <tr key={subject.maMon}>
                        <td><strong>#{subject.maMon}</strong></td>
                        <td>{subject.tenMon}</td>
                        <td>{subject.tenNganh}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleEdit(subject)}
                              title="Sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(subject.maMon)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingSubject ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Tên môn học *</label>
                    <input
                      type="text"
                      value={formData.tenMon}
                      onChange={(e) => setFormData({ ...formData, tenMon: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngành *</label>
                    <select
                      value={formData.maNganh}
                      onChange={(e) => setFormData({ ...formData, maNganh: e.target.value })}
                      className="form-control"
                      required
                    >
                      <option value="">Chọn ngành</option>
                      {majors.map(major => (
                        <option key={major.maNganh} value={major.maNganh}>
                          {major.tenNganh}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSubject ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </BoTriQuanTri>
  )
}
