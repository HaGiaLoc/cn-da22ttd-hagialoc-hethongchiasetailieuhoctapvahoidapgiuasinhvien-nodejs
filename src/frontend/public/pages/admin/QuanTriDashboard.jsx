import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { mockDocuments, mockQuestions, mockStudents, mockReports } from '../../data/mockData'
import { formatNumber } from '../../utils/helpers'

export default function QuanTriDashboard() {
  // Thống kê
  const stats = {
    totalDocuments: mockDocuments.length,
    totalQuestions: mockQuestions.length,
    totalStudents: mockStudents.length,
    pendingReports: mockReports.filter(r => r.trangThaiBaoCao === 'pending').length,
    pendingDocuments: mockDocuments.filter(d => d.trangThaiTL === 'pending').length || 0
  }

  // Báo cáo mới nhất
  const recentReports = mockReports.slice(0, 5)

  // Tài liệu chờ duyệt
  const pendingDocs = mockDocuments.filter(d => d.trangThaiTL === 'pending').slice(0, 5)

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <h1><i className="fas fa-tachometer-alt"></i> Bảng điều khiển quản trị</h1>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-info">
                <h3>{formatNumber(stats.totalDocuments)}</h3>
                <p>Tài liệu</p>
              </div>
              <Link to="/admin/documents" className="stat-link">
                Xem chi tiết <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="stat-card stat-success">
              <div className="stat-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{formatNumber(stats.totalQuestions)}</h3>
                <p>Câu hỏi</p>
              </div>
              <Link to="/qa" className="stat-link">
                Xem chi tiết <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="stat-card stat-info">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{formatNumber(stats.totalStudents)}</h3>
                <p>Sinh viên</p>
              </div>
              <Link to="/admin/users" className="stat-link">
                Xem chi tiết <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="stat-card stat-warning">
              <div className="stat-icon">
                <i className="fas fa-flag"></i>
              </div>
              <div className="stat-info">
                <h3>{formatNumber(stats.pendingReports)}</h3>
                <p>Báo cáo chờ xử lý</p>
              </div>
              <Link to="/admin/reports" className="stat-link">
                Xử lý ngay <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Content Grid */}
          <div className="admin-content-grid">
            {/* Báo cáo mới */}
            <div className="admin-card">
              <div className="card-header">
                <h2><i className="fas fa-flag"></i> Báo cáo vi phạm mới nhất</h2>
                <Link to="/admin/reports" className="btn btn-sm btn-outline">
                  Xem tất cả
                </Link>
              </div>
              <div className="card-body">
                {recentReports.length > 0 ? (
                  <div className="reports-list">
                    {recentReports.map(report => (
                      <div key={report.id} className="report-item">
                        <div className="report-icon">
                          <i className={`fas fa-${
                            report.reportType === 'document' ? 'file-alt' :
                            report.reportType === 'question' ? 'question-circle' :
                            report.reportType === 'answer' ? 'comment' : 'message'
                          }`}></i>
                        </div>
                        <div className="report-info">
                          <h4>{report.reportedItem?.tieuDeTaiLieu || report.reportedItem?.title || 'Nội dung đã xóa'}</h4>
                          <p className="report-reason">{report.lyDo}</p>
                          <span className="report-meta">
                            Bởi {report.reporter?.hoTenSinhVien} - {new Date(report.ngayBaoCao).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <span className={`badge badge-${
                          report.trangThaiBaoCao === 'pending' ? 'warning' :
                          report.trangThaiBaoCao === 'reviewing' ? 'info' : 'success'
                        }`}>
                          {report.trangThaiBaoCao === 'pending' ? 'Chờ xử lý' :
                           report.trangThaiBaoCao === 'reviewing' ? 'Đang xem xét' : 'Đã xử lý'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">Không có báo cáo nào</p>
                )}
              </div>
            </div>

            {/* Tài liệu chờ duyệt */}
            <div className="admin-card">
              <div className="card-header">
                <h2><i className="fas fa-clock"></i> Tài liệu chờ duyệt</h2>
                <Link to="/admin/documents" className="btn btn-sm btn-outline">
                  Xem tất cả
                </Link>
              </div>
              <div className="card-body">
                {stats.pendingDocuments > 0 ? (
                  <div className="pending-docs-list">
                    {pendingDocs.map(doc => (
                      <div key={doc.id} className="doc-item">
                        <div className="doc-icon">
                          <i className="fas fa-file-pdf"></i>
                        </div>
                        <div className="doc-info">
                          <h4>{doc.tieuDeTaiLieu}</h4>
                          <span className="doc-meta">
                            Tải lên bởi {doc.author} - {new Date(doc.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className="doc-actions">
                          <button className="btn btn-sm btn-success">
                            <i className="fas fa-check"></i> Duyệt
                          </button>
                          <button className="btn btn-sm btn-danger">
                            <i className="fas fa-times"></i> Từ chối
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">Không có tài liệu chờ duyệt</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Thao tác nhanh</h2>
            <div className="actions-grid">
              <Link to="/admin/documents" className="action-card">
                <i className="fas fa-file-alt"></i>
                <span>Quản lý tài liệu</span>
              </Link>
              <Link to="/admin/reports" className="action-card">
                <i className="fas fa-flag"></i>
                <span>Xử lý báo cáo</span>
              </Link>
              <Link to="/admin/users" className="action-card">
                <i className="fas fa-users"></i>
                <span>Quản lý người dùng</span>
              </Link>
              <Link to="/documents" className="action-card">
                <i className="fas fa-chart-bar"></i>
                <span>Thống kê</span>
              </Link>
            </div>
          </div>
      </section>
    </BoTriQuanTri>
  )
}
