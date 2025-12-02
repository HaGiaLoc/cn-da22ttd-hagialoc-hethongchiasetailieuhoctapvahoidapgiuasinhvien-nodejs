import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { adminService } from '../../api'

export default function QuanTriDinhDang() {
  const { showNotification } = useNotification()
  const [formats, setFormats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFormat, setEditingFormat] = useState(null)
  const [formData, setFormData] = useState({ tenDinhDang: '' })

  useEffect(() => {
    loadFormats()
  }, [])

  const loadFormats = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getAllFormats()
      setFormats((res.data || []).sort((a, b) => a.maDinhDang - b.maDinhDang))
    } catch (error) {
      showNotification('Không thể tải danh sách định dạng', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (format) => {
    setEditingFormat(format)
    setFormData({ tenDinhDang: format.tenDinhDang })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingFormat) {
        await adminService.updateFormat(editingFormat.maDinhDang, formData.tenDinhDang)
      } else {
        await adminService.createFormat(formData.tenDinhDang)
      }
      showNotification(editingFormat ? 'Đã cập nhật định dạng' : 'Đã thêm định dạng mới', 'success', 2000)
      setShowModal(false)
      setEditingFormat(null)
      setFormData({ tenDinhDang: '' })
      loadFormats()
    } catch (error) {
      showNotification('Thao tác thất bại', 'error', 3000)
    }
  }

  const handleDelete = async (maDinhDang) => {
    if (!confirm('Bạn có chắc chắn muốn xóa định dạng này?')) return
    try {
      await adminService.deleteFormat(maDinhDang)
      showNotification('Đã xóa định dạng', 'success', 2000)
      loadFormats()
    } catch (error) {
      showNotification('Không thể xóa định dạng', 'error', 3000)
    }
  }

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-file-code"></i> Quản lý định dạng</h1>
            <p>Quản lý các định dạng file tài liệu</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Thêm định dạng
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
                    <th>Tên định dạng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {formats.length === 0 ? (
                    <tr><td colSpan="3" className="empty-state">Chưa có định dạng nào</td></tr>
                  ) : (
                    formats.map(format => (
                      <tr key={format.maDinhDang}>
                        <td><strong>#{format.maDinhDang}</strong></td>
                        <td><span className="badge badge-secondary">{format.tenDinhDang}</span></td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(format)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(format.maDinhDang)}>
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
                <h2>{editingFormat ? 'Chỉnh sửa định dạng' : 'Thêm định dạng mới'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Tên định dạng *</label>
                    <input
                      type="text"
                      value={formData.tenDinhDang}
                      onChange={(e) => setFormData({ tenDinhDang: e.target.value })}
                      className="form-control"
                      placeholder="VD: PDF, DOCX, PPT, ..."
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">{editingFormat ? 'Cập nhật' : 'Thêm mới'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </BoTriQuanTri>
  )
}
