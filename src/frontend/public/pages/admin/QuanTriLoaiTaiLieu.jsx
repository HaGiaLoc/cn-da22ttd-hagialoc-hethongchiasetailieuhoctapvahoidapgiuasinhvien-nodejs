import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { adminService } from '../../services'

export default function QuanTriLoaiTaiLieu() {
  const { showNotification } = useNotification()
  const [types, setTypes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [formData, setFormData] = useState({ loaiTaiLieu: '' })

  useEffect(() => {
    loadTypes()
  }, [])

  const loadTypes = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getAllDocumentTypes()
      setTypes((res.data || []).sort((a, b) => a.maLoai - b.maLoai))
    } catch (error) {
      showNotification('Không thể tải danh sách loại tài liệu', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (type) => {
    setEditingType(type)
    setFormData({ loaiTaiLieu: type.loaiTaiLieu })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingType) {
        await adminService.updateDocumentType(editingType.maLoai, formData.loaiTaiLieu)
      } else {
        await adminService.createDocumentType(formData.loaiTaiLieu)
      }
      showNotification(editingType ? 'Đã cập nhật loại tài liệu' : 'Đã thêm loại tài liệu mới', 'success', 2000)
      setShowModal(false)
      setEditingType(null)
      setFormData({ loaiTaiLieu: '' })
      loadTypes()
    } catch (error) {
      showNotification('Thao tác thất bại', 'error', 3000)
    }
  }

  const handleDelete = async (maLoai) => {
    if (!confirm('Bạn có chắc chắn muốn xóa loại tài liệu này?')) return
    try {
      await adminService.deleteDocumentType(maLoai)
      showNotification('Đã xóa loại tài liệu', 'success', 2000)
      loadTypes()
    } catch (error) {
      showNotification('Không thể xóa loại tài liệu', 'error', 3000)
    }
  }

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-folder"></i> Quản lý loại tài liệu</h1>
            <p>Quản lý các loại tài liệu trong hệ thống</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Thêm loại
          </button>
        </div>

        <div className="admin-card">
          {isLoading ? (
            <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px' }}></i>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên loại</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {types.length === 0 ? (
                    <tr><td colSpan="3" className="empty-state">Chưa có loại tài liệu nào</td></tr>
                  ) : (
                    types.map(type => (
                      <tr key={type.maLoai}>
                        <td><strong>#{type.maLoai}</strong></td>
                        <td>{type.loaiTaiLieu}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(type)}><i className="fas fa-edit"></i></button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(type.maLoai)}><i className="fas fa-trash"></i></button>
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
                <h2>{editingType ? 'Chỉnh sửa loại tài liệu' : 'Thêm loại tài liệu mới'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Tên loại tài liệu *</label>
                    <input
                      type="text"
                      value={formData.loaiTaiLieu}
                      onChange={(e) => setFormData({ loaiTaiLieu: e.target.value })}
                      className="form-control"
                      placeholder="VD: Giáo trình, Bài giảng, ..."
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">{editingType ? 'Cập nhật' : 'Thêm mới'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </BoTriQuanTri>
  )
}
