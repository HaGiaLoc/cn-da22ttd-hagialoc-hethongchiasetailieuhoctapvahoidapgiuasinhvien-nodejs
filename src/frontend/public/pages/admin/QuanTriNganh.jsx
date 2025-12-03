import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { adminService } from '../../api'
import { searchMatch } from '../../utils/helpers'

export default function QuanTriNganh() {
  const { showNotification } = useNotification()
  const [majors, setMajors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMajor, setEditingMajor] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ tenNganh: '' })

  useEffect(() => {
    loadMajors()
  }, [])

  const loadMajors = async () => {
    try {
      setIsLoading(true)
      const res = await adminService.getAllMajors()
      setMajors((res.data || []).sort((a, b) => a.maNganh - b.maNganh))
    } catch (error) {
      showNotification('Không thể tải danh sách ngành', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingMajor) {
        await adminService.updateMajor(editingMajor.maNganh, formData.tenNganh)
      } else {
        await adminService.createMajor(formData.tenNganh)
      }
      showNotification(editingMajor ? 'Đã cập nhật ngành' : 'Đã thêm ngành mới', 'success', 2000)
      setShowModal(false)
      setEditingMajor(null)
      setFormData({ tenNganh: '' })
      loadMajors()
    } catch (error) {
      showNotification('Thao tác thất bại', 'error', 3000)
    }
  }

  const handleEdit = (major) => {
    setEditingMajor(major)
    setFormData({ tenNganh: major.tenNganh })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa ngành này?')) {
      try {
        await adminService.deleteMajor(id)
        showNotification('Đã xóa ngành', 'success', 2000)
        loadMajors()
      } catch (error) {
        showNotification('Xóa ngành thất bại', 'error', 3000)
      }
    }
  }

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-graduation-cap"></i> Quản lý ngành</h1>
            <p>Quản lý danh sách ngành học trong hệ thống</p>
          </div>
          <button className="btn btn-primary" onClick={() => {
            setEditingMajor(null)
            setFormData({ tenNganh: '' })
            setShowModal(true)
          }}>
            <i className="fas fa-plus"></i> Thêm ngành
          </button>
        </div>

        {/* Search Bar */}
        <div className="admin-filters">
          <div className="filter-group search-group">
            <label>Tìm kiếm thông minh:</label>
            <input
              type="text"
              placeholder="Tìm kiếm ngành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-stats">
            <span>Tổng: <strong>{majors.filter(m => 
              searchMatch(m.tenNganh, searchTerm) ||
              String(m.maNganh).includes(searchTerm.trim())
            ).length}</strong> ngành</span>
          </div>
        </div>

        <div className="admin-card">
          {isLoading ? (
            <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px' }}></i>
              <p>Đang tải...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên ngành</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {majors.filter(m => 
                    searchMatch(m.tenNganh, searchTerm) ||
                    String(m.maNganh).includes(searchTerm.trim())
                  ).length === 0 ? (
                    <tr><td colSpan="3" className="empty-state">
                      {searchTerm ? 'Không tìm thấy ngành phù hợp' : 'Chưa có ngành nào'}
                    </td></tr>
                  ) : (
                    majors.filter(m => 
                      searchMatch(m.tenNganh, searchTerm) ||
                      String(m.maNganh).includes(searchTerm.trim())
                    ).map(major => (
                      <tr key={major.maNganh}>
                        <td><strong>#{major.maNganh}</strong></td>
                        <td>{major.tenNganh}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(major)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(major.maNganh)}>
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

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingMajor ? 'Chỉnh sửa ngành' : 'Thêm ngành mới'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Tên ngành *</label>
                    <input
                      type="text"
                      value={formData.tenNganh}
                      onChange={(e) => setFormData({ tenNganh: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">
                    {editingMajor ? 'Cập nhật' : 'Thêm mới'}
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
