import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { adminService } from '../../services'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/helpers'

export default function QuanTriBaoCao() {
  const { showNotification } = useNotification()
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    loadReports()
  }, [filterStatus, filterType])

  const loadReports = async () => {
    try {
      setIsLoading(true)
      const res = await adminService.getAllReports(
        filterStatus === 'all' ? null : filterStatus,
        filterType === 'all' ? null : filterType
      )
      
      console.log('Full response:', res)
      console.log('res.data:', res.data)
      console.log('res.data.reports:', res.data?.reports)
      
      // Backend trả về: { success: true, data: { reports: [...], pagination: {...} } }
      // Sau khi qua interceptor: { success: true, data: { reports: [...], pagination: {...} } }
      setReports(res.data?.reports || [])
    } catch (error) {
      console.error('Error loading reports:', error)
      showNotification(error.message || 'Không thể tải danh sách báo cáo', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (reportId) => {
    try {
      await adminService.approveReport(reportId)
      await loadReports()
      showNotification('Đã duyệt báo cáo', 'success', 2000)
    } catch (error) {
      showNotification('Duyệt báo cáo thất bại', 'error', 3000)
    }
  }

  const handleReject = async (reportId) => {
    try {
      await adminService.rejectReport(reportId)
      await loadReports()
      showNotification('Đã từ chối báo cáo', 'success', 2000)
    } catch (error) {
      showNotification('Từ chối báo cáo thất bại', 'error', 3000)
    }
  }

  const handleDelete = async (reportId) => {
    if (window.confirm('Bạn có chắc muốn xóa báo cáo này?')) {
      try {
        await adminService.deleteReport(reportId)
        setReports(reports.filter(r => r.maBaoCao !== reportId))
        showNotification('Đã xóa báo cáo', 'success', 2000)
      } catch (error) {
        showNotification('Xóa báo cáo thất bại', 'error', 3000)
      }
    }
  }

  const getReasonText = (reason) => {
    const reasons = {
      'invalid_content': 'Nội dung không phù hợp',
      'spam': 'Spam',
      'copyrigth_violation': 'Vi phạm bản quyền',
      'misinformation': 'Thông tin sai lệch',
      'inapproriate_language': 'Ngôn ngữ không phù hợp',
      'other': 'Khác'
    }
    return reasons[reason] || reason
  }

  const filteredReports = reports.filter(r => {
    const typeMatch = filterType === 'all' || r.loaiBaoCao === filterType
    return typeMatch
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
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Loại báo cáo:</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="document">Tài liệu</option>
                <option value="question">Câu hỏi</option>
                <option value="answer">Câu trả lời</option>
              </select>
            </div>

            <div className="filter-stats">
              <span>Tổng: <strong>{filteredReports.length}</strong> báo cáo</span>
            </div>
          </div>

          {/* Reports Table */}
          <div className="admin-card">
            {isLoading && (
              <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#666', marginBottom: '20px' }}></i>
                <p>Đang tải danh sách báo cáo...</p>
              </div>
            )}
            
            {!isLoading && filteredReports.length === 0 && (
              <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
                <h3>Không có báo cáo nào</h3>
                <p>Chưa có báo cáo vi phạm nào được gửi lên hệ thống.</p>
              </div>
            )}
            
            {!isLoading && filteredReports.length > 0 && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Đối tượng báo cáo</th>
                    <th>Loại</th>
                    <th>Lý do</th>
                    <th>Người báo cáo</th>
                    <th>Thời gian báo cáo</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <tr key={report.maBaoCao}>
                      <td>
                        <div className="report-target-cell">
                          <strong>
                            {report.loaiBaoCao === 'document' ? 'Tài liệu' :
                             report.loaiBaoCao === 'question' ? 'Câu hỏi' :
                             report.loaiBaoCao === 'answer' ? 'Câu trả lời' : 'Khác'}
                          </strong>
                          <div className="report-target-id">#{report.maBaoCao}</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">
                          {report.loaiBaoCao === 'document' ? 'Tài liệu' :
                           report.loaiBaoCao === 'question' ? 'Câu hỏi' :
                           report.loaiBaoCao === 'answer' ? 'Câu trả lời' : 'Khác'}
                        </span>
                      </td>
                      <td>
                        <div className="report-reason-cell">
                          {getReasonText(report.lyDo)}
                        </div>
                      </td>
                      <td>{report.hoTenSV || 'N/A'}</td>
                      <td>{formatDate(report.ngayBC)}</td>
                      <td>
                        <span className={`badge badge-${
                          report.trangThaiBC === 'pending' ? 'warning' :
                          report.trangThaiBC === 'approved' ? 'success' : 'danger'
                        }`}>
                          {report.trangThaiBC === 'pending' ? 'Chờ xử lý' :
                           report.trangThaiBC === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {report.trangThaiBC === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(report.maBaoCao)}
                                title="Chấp nhận báo cáo"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(report.maBaoCao)}
                                title="Từ chối báo cáo"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleDelete(report.maBaoCao)}
                            title="Xóa báo cáo"
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
    </BoTriQuanTri>
  )
}
