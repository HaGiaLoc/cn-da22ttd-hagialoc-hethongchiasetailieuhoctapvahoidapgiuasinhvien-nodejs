import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { adminService } from '../../services'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate, formatNumber } from '../../utils/helpers'

export default function QuanTriTaiLieu() {
  const { showNotification } = useNotification()
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleApprove = async (docId) => {
    try {
      await adminService.approveDocument(docId)
      await loadDocuments()
      showNotification('Đã duyệt tài liệu', 'success', 2000)
    } catch (error) {
      showNotification('Duyệt tài liệu thất bại', 'error', 3000)
    }
  }

  const handleReject = async (docId) => {
    try {
      await adminService.rejectDocument(docId)
      await loadDocuments()
      showNotification('Đã từ chối tài liệu', 'success', 2000)
    } catch (error) {
      showNotification('Từ chối tài liệu thất bại', 'error', 3000)
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
              <p>Duyệt và quản lý tài liệu từ người dùng</p>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="filter-group">
              <label>Trạng thái:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
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
                          doc.trangThaiTL === 'approved' ? 'success' :
                          doc.trangThaiTL === 'pending' ? 'warning' : 'danger'
                        }`}>
                          {doc.trangThaiTL === 'approved' ? 'Đã duyệt' :
                           doc.trangThaiTL === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {doc.trangThaiTL === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(doc.maTaiLieu)}
                                title="Duyệt"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(doc.maTaiLieu)}
                                title="Từ chối"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                          {doc.trangThaiTL !== 'pending' && (
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleDelete(doc.maTaiLieu)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
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
    </BoTriQuanTri>
  )
}
