import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { formatNumber } from '../../utils/helpers'
import { adminService } from '../../api'

export default function QuanTriDashboard() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalQuestions: 0,
    totalStudents: 0,
    pendingReports: 0,
    pendingDocuments: 0
  })
  const [recentReports, setRecentReports] = useState([])
  const [pendingDocs, setPendingDocs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Lấy thống kê
      const data = await adminService.getDashboardStats()
      
      if (data.data) {
        setStats({
          totalDocuments: data.data.totalDocuments || 0,
          totalQuestions: data.data.totalQuestions || 0,
          totalStudents: data.data.totalStudents || 0,
          pendingReports: data.data.pendingReports || 0,
          pendingDocuments: data.data.pendingDocuments || 0
        })
      }

      // Lấy báo cáo mới nhất (chờ xử lý)
      const reportsResponse = await adminService.getAllReports('pending', null, 1, 5)
      if (reportsResponse.data && reportsResponse.data.reports) {
        setRecentReports(reportsResponse.data.reports)
      }

      // Lấy tài liệu chờ duyệt
      const docsResponse = await adminService.getPendingDocuments(1, 5)
      if (docsResponse.data && docsResponse.data.documents) {
        setPendingDocs(docsResponse.data.documents)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
                      <div key={report.maBaoCao} className="report-item">
                        <div className="report-icon">
                          <i className="fas fa-flag"></i>
                        </div>
                        <div className="report-info">
                          <h4>{report.loaiBaoCao || 'Báo cáo vi phạm'}</h4>
                          <p className="report-reason">{report.lyDo}</p>
                          <span className="report-meta">
                            Bởi {report.hoTenSV} - {new Date(report.ngayBC).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <span className={`badge badge-${
                          report.trangThaiBC === 'pending' ? 'warning' :
                          report.trangThaiBC === 'reviewing' ? 'info' : 'success'
                        }`}>
                          {report.trangThaiBC === 'pending' ? 'Chờ xử lý' :
                           report.trangThaiBC === 'reviewing' ? 'Đang xem xét' : 'Đã xử lý'}
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
                {pendingDocs.length > 0 ? (
                  <div className="pending-docs-list">
                    {pendingDocs.map(doc => (
                      <div key={doc.maTaiLieu} className="doc-item">
                        <div className="doc-icon">
                          <i className="fas fa-file-pdf"></i>
                        </div>
                        <div className="doc-info">
                          <h4>{doc.tieuDeTL}</h4>
                          <span className="doc-meta">
                            Tải lên bởi {doc.hoTenSV} - {new Date(doc.ngayTai).toLocaleDateString('vi-VN')}
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
