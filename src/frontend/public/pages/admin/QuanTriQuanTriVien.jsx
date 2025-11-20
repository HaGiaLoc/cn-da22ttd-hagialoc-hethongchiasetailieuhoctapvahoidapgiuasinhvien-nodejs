import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/helpers'
import { adminService } from '../../services'

export default function QuanTriQuanTriVien() {
  const { showNotification } = useNotification()
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingAdmin, setDeletingAdmin] = useState(null)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    matKhau: '',
    hoTen: '',
    vaiTro: 'admin'
  })

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getAllAdmins()
      setAdmins((res.data || []).sort((a, b) => a.maQuanTriVien - b.maQuanTriVien))
    } catch (error) {
      showNotification('Không thể tải danh sách quản trị viên', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setFormData({
      email: admin.emailQTV,
      matKhau: '',
      hoTen: admin.hoTenQTV,
      vaiTro: 'admin'
    })
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingAdmin(null)
    setFormData({
      email: '',
      matKhau: '',
      hoTen: '',
      vaiTro: 'admin'
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAdmin) {
        await adminService.updateAdmin(editingAdmin.maQuanTriVien, formData)
      } else {
        await adminService.createAdmin(formData)
      }
      showNotification(editingAdmin ? 'Đã cập nhật quản trị viên' : 'Đã thêm quản trị viên mới', 'success', 2000)
      setShowModal(false)
      setEditingAdmin(null)
      loadAdmins()
    } catch (error) {
      showNotification('Thao tác thất bại', 'error', 3000)
    }
  }

  const handleDeleteClick = (admin) => {
    setDeletingAdmin(admin)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingAdmin) return
    try {
      await adminService.deleteAdmin(deletingAdmin.maQuanTriVien)
      showNotification('Đã xóa quản trị viên', 'success', 2000)
      setShowDeleteModal(false)
      setDeletingAdmin(null)
      loadAdmins()
    } catch (error) {
      showNotification('Không thể xóa quản trị viên', 'error', 3000)
    }
  }

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-user-shield"></i> Quản lý quản trị viên</h1>
            <p>Quản lý tài khoản quản trị viên hệ thống</p>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Thêm quản trị viên
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
                    <th>Email</th>
                    <th>Họ tên</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr><td colSpan="5" className="empty-state">Chưa có quản trị viên nào</td></tr>
                  ) : (
                    admins.map(admin => (
                      <tr key={admin.maQuanTriVien}>
                        <td><strong>{admin.maQuanTriVien}</strong></td>
                        <td>{admin.emailQTV}</td>
                        <td>{admin.hoTenQTV}</td>
                        <td>
                          <span className="badge badge-primary">Admin</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn btn-sm btn-primary" 
                              onClick={() => handleEdit(admin)}
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleDeleteClick(admin)}
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

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingAdmin ? 'Chỉnh sửa quản trị viên' : 'Thêm quản trị viên mới'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-control"
                      disabled={editingAdmin !== null}
                      autoComplete="off"
                      required
                    />
                    {editingAdmin && <small className="form-text">Email không thể thay đổi</small>}
                  </div>

                  <div className="form-group">
                    <label>Mật khẩu {!editingAdmin && '*'}</label>
                    <input
                      type="password"
                      value={formData.matKhau}
                      onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                      className="form-control"
                      required={!editingAdmin}
                      autoComplete="off"
                      minLength="6"
                    />
                    {editingAdmin && <small className="form-text">Để trống nếu không muốn thay đổi</small>}
                  </div>

                  <div className="form-group">
                    <label>Họ tên *</label>
                    <input
                      type="text"
                      value={formData.hoTen}
                      onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAdmin ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
              <div className="modal-header">
                <h2>Xác nhận xóa</h2>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: 'var(--danger-color)', marginBottom: '16px' }}></i>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>Bạn có chắc chắn muốn xóa quản trị viên này?</p>
                  {deletingAdmin && (
                    <p style={{ color: 'var(--text-muted)' }}>
                      <strong>{deletingAdmin.hoTenQTV}</strong> ({deletingAdmin.emailQTV})
                    </p>
                  )}
                  <p style={{ color: 'var(--danger-color)', fontSize: '14px', marginTop: '12px' }}>Hành động này không thể hoàn tác!</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                  <i className="fas fa-trash"></i> Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </BoTriQuanTri>
  )
}
