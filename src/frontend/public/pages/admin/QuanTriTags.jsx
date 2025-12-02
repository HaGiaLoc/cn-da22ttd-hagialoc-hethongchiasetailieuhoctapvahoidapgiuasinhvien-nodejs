import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { adminService } from '../../api'

export default function QuanTriTags() {
  const { showNotification } = useNotification()
  const [tags, setTags] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [formData, setFormData] = useState({ tenTag: '' })

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getAllTags()
      setTags((res.data || []).sort((a, b) => a.maTag - b.maTag))
    } catch (error) {
      showNotification('Không thể tải danh sách tags', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (tag) => {
    setEditingTag(tag)
    setFormData({ tenTag: tag.tenTag })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTag) {
        await adminService.updateTag(editingTag.maTag, formData.tenTag)
      } else {
        await adminService.createTag(formData.tenTag)
      }
      showNotification(editingTag ? 'Đã cập nhật tag' : 'Đã thêm tag mới', 'success', 2000)
      setShowModal(false)
      setEditingTag(null)
      setFormData({ tenTag: '' })
      loadTags()
    } catch (error) {
      showNotification('Thao tác thất bại', 'error', 3000)
    }
  }

  const handleDelete = async (maTag) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tag này?')) return
    try {
      await adminService.deleteTag(maTag)
      showNotification('Đã xóa tag', 'success', 2000)
      loadTags()
    } catch (error) {
      showNotification('Không thể xóa tag', 'error', 3000)
    }
  }

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-tags"></i> Quản lý Tags</h1>
            <p>Quản lý danh sách tags cho câu hỏi</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Thêm tag
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
                    <th>Tên tag</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.length === 0 ? (
                    <tr><td colSpan="3" className="empty-state">Chưa có tag nào</td></tr>
                  ) : (
                    tags.map(tag => (
                      <tr key={tag.maTag}>
                        <td><strong>#{tag.maTag}</strong></td>
                        <td><span className="badge badge-info">{tag.tenTag}</span></td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(tag)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tag.maTag)}>
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
                <h2>{editingTag ? 'Chỉnh sửa tag' : 'Thêm tag mới'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Tên tag *</label>
                    <input
                      type="text"
                      value={formData.tenTag}
                      onChange={(e) => setFormData({ tenTag: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">
                    {editingTag ? 'Cập nhật' : 'Thêm mới'}
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
