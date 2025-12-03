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
    pendingReports: 0
  })
  const [recentReports, setRecentReports] = useState([])
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
          pendingReports: data.data.pendingReports || 0
        })
      }

      // Lấy báo cáo mới nhất (chờ xử lý)
      const reportsResponse = await adminService.getAllReports('pending', null, 1, 5)
      if (reportsResponse.data && reportsResponse.data.reports) {
        setRecentReports(reportsResponse.data.reports)
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

          {/* Báo cáo vi phạm mới nhất */}
          <div className="admin-card">
            <div className="card-header">
              <h2><i className="fas fa-flag"></i> Báo cáo vi phạm mới nhất</h2>
              <Link to="/admin/reports" className="btn btn-sm btn-outline">
                Xem tất cả
              </Link>
            </div>
            <div className="card-body">
              {recentReports.length > 0 ? (
                <div className="reports-grid">
                  {recentReports.map(report => (
                    <Link 
                      key={report.maBaoCao} 
                      to={`/admin/reports?highlight=${report.maBaoCao}`}
                      className="report-card"
                    >
                      <div className="report-card-header">
                        <span className="report-type">
                          {report.loaiBaoCao === 'document' ? 'Tài liệu' :
                           report.loaiBaoCao === 'question' ? 'Câu hỏi' : 'Câu trả lời'}
                        </span>
                        <span className={`badge badge-${
                          report.trangThaiBC === 'pending' ? 'warning' :
                          report.trangThaiBC === 'approved' ? 'success' : 'danger'
                        }`}>
                          {report.trangThaiBC === 'pending' ? 'Chờ xử lý' :
                           report.trangThaiBC === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                        </span>
                      </div>
                      <div className="report-card-body">
                        <div className="report-target">
                          {report.loaiBaoCao === 'document' && (
                            report.tieuDeTL || `Tài liệu #${report.maTaiLieu || 'N/A'}`
                          )}
                          {report.loaiBaoCao === 'question' && (
                            report.tieuDeCH || `Câu hỏi #${report.maCauHoi || 'N/A'}`
                          )}
                          {report.loaiBaoCao === 'answer' && (
                            report.noiDungTraLoi 
                              ? `${String(report.noiDungTraLoi).slice(0, 60)}${String(report.noiDungTraLoi).length > 60 ? '...' : ''}`
                              : `Câu trả lời #${report.maCauTraLoi || 'N/A'}`
                          )}
                        </div>
                        <p className="report-reason">
                          <i className="fas fa-exclamation-circle"></i> {report.lyDo}
                        </p>
                        <div className="report-meta">
                          <span><i className="fas fa-user"></i> {report.hoTenSV}</span>
                          <span><i className="fas fa-calendar"></i> {new Date(report.ngayBC).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="empty-state">Không có báo cáo nào</p>
              )}
            </div>
          </div>
      </section>
    </BoTriQuanTri>
  )
}
