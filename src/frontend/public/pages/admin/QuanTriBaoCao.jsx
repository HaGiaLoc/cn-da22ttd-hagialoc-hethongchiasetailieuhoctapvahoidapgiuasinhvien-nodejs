import { useState } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { mockReports, mockDocuments, mockQuestions, mockAnswers } from '../../data/mockData'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/helpers'

export default function QuanTriBaoCao() {
  const { showNotification } = useNotification()
  const [reports, setReports] = useState(mockReports)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const handleResolve = (reportId, action) => {
    const updatedReports = reports.map(r =>
      r.id === reportId ? { ...r, trangThaiBaoCao: 'resolved' } : r
    )
    setReports(updatedReports)
    
    const actionText = action === 'approve' ? 'chấp nhận' : 'từ chối'
    showNotification(`Đã ${actionText} báo cáo #${reportId}`, 'success', 1000)
  }

  const handleDelete = (reportId) => {
    if (window.confirm('Bạn có chắc muốn xóa báo cáo này?')) {
      setReports(reports.filter(r => r.id !== reportId))
      showNotification('Đã xóa báo cáo', 'success', 1000)
    }
  }

  const filteredReports = reports.filter(r => {
    const statusMatch = filterStatus === 'all' || r.trangThaiBaoCao === filterStatus
    const typeMatch = filterType === 'all' || r.reportType === filterType
    return statusMatch && typeMatch
  })

  return (
    <BoTriQuanTri>
      <section className="admin-section">
          <div className="admin-header">
            <div>
              <h1><i className="fas fa-flag"></i> Quản lý báo cáo vi phạm</h1>
              <p>Xử lý các báo cáo từ người dùng</p>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="filter-group">
              <label>Trạng thái:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="reviewing">Đang xem xét</option>
                <option value="resolved">Đã xử lý</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Loại báo cáo:</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="document">Tài liệu</option>
                <option value="question">Câu hỏi</option>
                <option value="answer">Câu trả lời</option>
                <option value="comment">Bình luận</option>
              </select>
            </div>

            <div className="filter-stats">
              <span>Tổng: <strong>{filteredReports.length}</strong> báo cáo</span>
            </div>
          </div>

          {/* Reports Table */}
          <div className="admin-card">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Loại</th>
                    <th>Nội dung bị báo cáo</th>
                    <th>Lý do</th>
                    <th>Người báo cáo</th>
                    <th>Ngày báo cáo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length > 0 ? filteredReports.map(report => (
                    <tr key={report.id}>
                      <td>#{report.id}</td>
                      <td>
                        <span className="badge badge-info">
                          {report.reportType === 'document' ? 'Tài liệu' :
                           report.reportType === 'question' ? 'Câu hỏi' :
                           report.reportType === 'answer' ? 'Câu trả lời' : 'Bình luận'}
                        </span>
                      </td>
                      <td>
                        <div className="reported-item">
                          <strong>
                            {report.reportedItem?.tieuDeTaiLieu || 
                             report.reportedItem?.title || 
                             report.reportedItem?.content?.substring(0, 50) + '...' ||
                             'Đã xóa'}
                          </strong>
                        </div>
                      </td>
                      <td>
                        <div className="report-reason-cell">
                          {report.lyDo}
                        </div>
                      </td>
                      <td>{report.reporter?.hoTenSinhVien || 'N/A'}</td>
                      <td>{formatDate(report.ngayBaoCao)}</td>
                      <td>
                        <span className={`badge badge-${
                          report.trangThaiBaoCao === 'pending' ? 'warning' :
                          report.trangThaiBaoCao === 'reviewing' ? 'info' : 'success'
                        }`}>
                          {report.trangThaiBaoCao === 'pending' ? 'Chờ xử lý' :
                           report.trangThaiBaoCao === 'reviewing' ? 'Đang xem xét' : 'Đã xử lý'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {report.trangThaiBaoCao !== 'resolved' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleResolve(report.id, 'approve')}
                                title="Chấp nhận báo cáo"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleResolve(report.id, 'reject')}
                                title="Từ chối báo cáo"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleDelete(report.id)}
                            title="Xóa báo cáo"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        Không có báo cáo nào
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
