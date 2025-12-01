import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import EditDocumentModal from '../../components/admin/EditDocumentModal'
import { adminService } from '../../services'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate, formatNumber } from '../../utils/helpers'

export default function QuanTriTaiLieu() {
  const { showNotification } = useNotification()
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingDocument, setEditingDocument] = useState(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const res = await adminService.getAllDocuments(filterStatus === 'all' ? null : filterStatus)
      setDocuments(res.data?.documents || [])
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [filterStatus])

  const handleEdit = (doc) => {
    setEditingDocument(doc)
  }

  const handleSaveEdit = async (formData) => {
    try {
      await adminService.updateDocument(editingDocument.maTaiLieu, formData)
      await loadDocuments()
      setEditingDocument(null)
      showNotification('Cập nhật tài liệu thành công', 'success', 2000)
    } catch (error) {
      showNotification('Cập nhật tài liệu thất bại', 'error', 3000)
    }
  }

  const handleDelete = async (docId) => {
    if (window.confirm('Bạn có chắc muốn xóa tài liệu này?')) {
      try {
        await adminService.deleteDocument(docId)
        setDocuments(documents.filter(d => d.maTaiLieu !== docId))
        showNotification('Đã xóa tài liệu', 'success', 2000)
      } catch (error) {
        showNotification('Xóa tài liệu thất bại', 'error', 3000)
      }
    }
  }

  const filteredDocs = documents.filter(d => {
    const statusMatch = filterStatus === 'all' || d.trangThaiTL === filterStatus
    const searchMatch = d.tieuDeTL.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.author.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && searchMatch
  })
  // sort by numeric document ID ascending
  const sortedDocs = filteredDocs.slice().sort((a, b) => Number(a.maTaiLieu) - Number(b.maTaiLieu))

  return (
    <BoTriQuanTri>
      <section className="admin-section">
          <div className="admin-header">
            <div>
            <h1><i className="fas fa-file-alt"></i> Quản lý tài liệu</h1>
            <p>Sửa và xóa tài liệu từ người dùng</p>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="filter-group">
              <label>Trạng thái:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="show">Hiện</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>

            <div className="filter-group search-group">
              <label>Tìm kiếm:</label>
              <input
                type="text"
                placeholder="Tìm theo tên tài liệu hoặc tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-stats">
              <span>Tổng: <strong>{filteredDocs.length}</strong> tài liệu</span>
            </div>
          </div>

          {/* Documents Table */}
          <div className="admin-card">
            {isLoading && (
              <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#666', marginBottom: '20px' }}></i>
                <p>Đang tải danh sách tài liệu...</p>
              </div>
            )}
            
            {!isLoading && filteredDocs.length === 0 && (
              <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fas fa-file-alt" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
                <h3>Không có tài liệu nào</h3>
                <p>{searchTerm ? 'Không tìm thấy tài liệu phù hợp với từ khóa tìm kiếm.' : 'Chưa có tài liệu nào trong hệ thống.'}</p>
              </div>
            )}
            
            {!isLoading && filteredDocs.length > 0 && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Loại</th>
                    <th>Lượt xem</th>
                    <th>Tải xuống</th>
                    <th>Ngày đăng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDocs.map(doc => (
                    <tr key={doc.maTaiLieu}>
                      <td><strong>{doc.maTaiLieu}</strong></td>
                      <td>
                        <div className="doc-title">
                          <a href={doc.URL} target="_blank" rel="noopener noreferrer">
                            {doc.tieuDeTL}
                          </a>
                        </div>
                      </td>
                      <td>{doc.hoTenSV}</td>
                      <td>
                        <span className="badge badge-info">{doc.tenLoai}</span>
                      </td>
                      <td>{formatNumber(doc.luotXem || 0)}</td>
                      <td>{formatNumber(doc.luotTai || 0)}</td>
                      <td>{formatDate(doc.ngayTai)}</td>
                      <td>
                        <span className={`badge badge-${
                          doc.trangThaiTL === 'show' ? 'success' : 'danger'
                        }`}>
                          {doc.trangThaiTL === 'show' ? 'Hiện' : 'Ẩn'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(doc)}
                            title="Sửa"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(doc.maTaiLieu)}
                            title="Xóa"
                          >
                            <i className="fas fa-trash"></i>
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
      </section>

      {editingDocument && (
        <EditDocumentModal
          document={editingDocument}
          onClose={() => setEditingDocument(null)}
          onSave={handleSaveEdit}
        />
      )}
    </BoTriQuanTri>
  )
}
