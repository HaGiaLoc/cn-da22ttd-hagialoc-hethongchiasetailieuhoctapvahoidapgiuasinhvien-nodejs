import { useState } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { mockDocuments } from '../../data/mockData'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate, formatNumber } from '../../utils/helpers'

export default function QuanTriTaiLieu() {
  const { showNotification } = useNotification()
  const [documents, setDocuments] = useState(mockDocuments)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleApprove = (docId) => {
    const updated = documents.map(d =>
      d.id === docId ? { ...d, trangThaiTL: 'approved' } : d
    )
    setDocuments(updated)
    showNotification('Đã duyệt tài liệu', 'success', 1000)
  }

  const handleReject = (docId) => {
    const updated = documents.map(d =>
      d.id === docId ? { ...d, trangThaiTL: 'rejected' } : d
    )
    setDocuments(updated)
    showNotification('Đã từ chối tài liệu', 'success', 1000)
  }

  const handleDelete = (docId) => {
    if (window.confirm('Bạn có chắc muốn xóa tài liệu này?')) {
      setDocuments(documents.filter(d => d.id !== docId))
      showNotification('Đã xóa tài liệu', 'success', 1000)
    }
  }

  const filteredDocs = documents.filter(d => {
    const statusMatch = filterStatus === 'all' || d.trangThaiTL === filterStatus
    const searchMatch = d.tieuDeTaiLieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.author.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && searchMatch
  })

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
                    <th>Đánh giá</th>
                    <th>Ngày tải</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.length > 0 ? filteredDocs.map(doc => (
                    <tr key={doc.id}>
                      <td>#{doc.id}</td>
                      <td>
                        <div className="doc-title">
                          <Link to={`/documents/${doc.id}`} target="_blank">
                            {doc.tieuDeTaiLieu}
                          </Link>
                        </div>
                      </td>
                      <td>{doc.author}</td>
                      <td>
                        <span className="badge badge-info">{doc.type}</span>
                      </td>
                      <td>{formatNumber(doc.views)}</td>
                      <td>{formatNumber(doc.downloads)}</td>
                      <td>
                        <i className="fas fa-star" style={{ color: '#ffc107' }}></i> {doc.rating}
                      </td>
                      <td>{formatDate(doc.date)}</td>
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
                                onClick={() => handleApprove(doc.id)}
                                title="Duyệt"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(doc.id)}
                                title="Từ chối"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                          <Link
                            to={`/documents/${doc.id}`}
                            className="btn btn-sm btn-outline"
                            target="_blank"
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleDelete(doc.id)}
                            title="Xóa"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="10" className="empty-state">
                        Không tìm thấy tài liệu nào
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
