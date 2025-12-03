import { useState, useEffect } from 'react'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { formatNumber } from '../../utils/helpers'
import { adminService } from '../../api'

export default function QuanTriThongKe() {
  const { showNotification } = useNotification()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalDocuments: 0,
    totalQuestions: 0,
    visibleQuestions: 0,
    hiddenQuestions: 0,
    totalAnswers: 0,
    visibleAnswers: 0,
    hiddenAnswers: 0,
    pendingDocuments: 0,
    approvedDocuments: 0,
    rejectedDocuments: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalReports: 0,
    pendingReports: 0,
    approvedReports: 0,
    rejectedReports: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getStatistics()
      const data = res.data || {
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        totalDocuments: 0,
        totalQuestions: 0,
        visibleQuestions: 0,
        hiddenQuestions: 0,
        totalAnswers: 0,
        visibleAnswers: 0,
        hiddenAnswers: 0,
        pendingDocuments: 0,
        approvedDocuments: 0,
        rejectedDocuments: 0,
        totalViews: 0,
        totalDownloads: 0,
        totalReports: 0,
        pendingReports: 0,
        approvedReports: 0,
        rejectedReports: 0
      }
      
      setStats(data)
    } catch (error) {
      showNotification('Không thể tải thống kê', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-chart-bar"></i> Thống kê hệ thống</h1>
            <p>Tổng quan về hoạt động của hệ thống</p>
          </div>
        </div>

        {isLoading ? (
          <div className="empty-state" style={{ padding: '60px', textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px' }}></i>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div className="admin-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Tổng người dùng</p>
                    <h2 style={{ fontSize: '32px', margin: 0 }}>{formatNumber(stats.totalUsers)}</h2>
                  </div>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-users" style={{ fontSize: '28px', color: '#1976d2' }}></i>
                  </div>
                </div>
              </div>

              <div className="admin-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Tổng tài liệu</p>
                    <h2 style={{ fontSize: '32px', margin: 0 }}>{formatNumber(stats.totalDocuments)}</h2>
                  </div>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-file-alt" style={{ fontSize: '28px', color: '#388e3c' }}></i>
                  </div>
                </div>
              </div>

              <div className="admin-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Tổng câu hỏi</p>
                    <h2 style={{ fontSize: '32px', margin: 0 }}>{formatNumber(stats.totalQuestions)}</h2>
                  </div>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-question-circle" style={{ fontSize: '28px', color: '#f57c00' }}></i>
                  </div>
                </div>
              </div>

              <div className="admin-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Tổng câu trả lời</p>
                    <h2 style={{ fontSize: '32px', margin: 0 }}>{formatNumber(stats.totalAnswers)}</h2>
                  </div>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-comments" style={{ fontSize: '28px', color: '#7b1fa2' }}></i>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="admin-card">
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Trạng thái tài liệu</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Tổng tài liệu</span>
                      <strong style={{ color: '#1976d2' }}>{formatNumber(stats.totalDocuments)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#1976d2' }}></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Tài liệu đang hiện</span>
                      <strong style={{ color: '#4caf50' }}>{formatNumber(stats.approvedDocuments)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalDocuments ? (stats.approvedDocuments / stats.totalDocuments * 100) : 0}%`, height: '100%', background: '#4caf50' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Tài liệu đã ẩn</span>
                      <strong style={{ color: '#ff9800' }}>{formatNumber(stats.pendingDocuments)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalDocuments ? (stats.pendingDocuments / stats.totalDocuments * 100) : 0}%`, height: '100%', background: '#ff9800' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Trạng thái câu hỏi</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Tổng câu hỏi</span>
                      <strong style={{ color: '#f57c00' }}>{formatNumber(stats.totalQuestions)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#f57c00' }}></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Câu hỏi đang hiện</span>
                      <strong style={{ color: '#4caf50' }}>{formatNumber(stats.visibleQuestions || 0)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalQuestions ? ((stats.visibleQuestions || 0) / stats.totalQuestions * 100) : 0}%`, height: '100%', background: '#4caf50' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Câu hỏi đã ẩn</span>
                      <strong style={{ color: '#ff9800' }}>{formatNumber(stats.hiddenQuestions || 0)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalQuestions ? ((stats.hiddenQuestions || 0) / stats.totalQuestions * 100) : 0}%`, height: '100%', background: '#ff9800' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Trạng thái câu trả lời</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Tổng câu trả lời</span>
                      <strong style={{ color: '#7b1fa2' }}>{formatNumber(stats.totalAnswers)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#7b1fa2' }}></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Câu trả lời đang hiện</span>
                      <strong style={{ color: '#4caf50' }}>{formatNumber(stats.visibleAnswers || 0)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalAnswers ? ((stats.visibleAnswers || 0) / stats.totalAnswers * 100) : 0}%`, height: '100%', background: '#4caf50' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Câu trả lời đã ẩn</span>
                      <strong style={{ color: '#ff9800' }}>{formatNumber(stats.hiddenAnswers || 0)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalAnswers ? ((stats.hiddenAnswers || 0) / stats.totalAnswers * 100) : 0}%`, height: '100%', background: '#ff9800' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Trạng thái người dùng</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Tổng người dùng</span>
                      <strong style={{ color: '#1976d2' }}>{formatNumber(stats.totalUsers)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#1976d2' }}></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Tài khoản hoạt động</span>
                      <strong style={{ color: '#4caf50' }}>{formatNumber(stats.activeUsers || 0)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalUsers ? ((stats.activeUsers || 0) / stats.totalUsers * 100) : 0}%`, height: '100%', background: '#4caf50' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Tài khoản bị khóa</span>
                      <strong style={{ color: '#f44336' }}>{formatNumber(stats.blockedUsers || 0)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalUsers ? ((stats.blockedUsers || 0) / stats.totalUsers * 100) : 0}%`, height: '100%', background: '#f44336' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Trạng thái báo cáo</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Chờ xử lý</span>
                      <strong style={{ color: '#ff9800' }}>{formatNumber(stats.pendingReports)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalReports ? (stats.pendingReports / stats.totalReports * 100) : 0}%`, height: '100%', background: '#ff9800' }}></div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Đã xử lý</span>
                      <strong style={{ color: '#4caf50' }}>{formatNumber(stats.approvedReports)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalReports ? (stats.approvedReports / stats.totalReports * 100) : 0}%`, height: '100%', background: '#4caf50' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Từ chối</span>
                      <strong style={{ color: '#f44336' }}>{formatNumber(stats.rejectedReports)}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalReports ? (stats.rejectedReports / stats.totalReports * 100) : 0}%`, height: '100%', background: '#f44336' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Hoạt động</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-eye" style={{ color: '#1976d2' }}></i>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Tổng lượt xem</p>
                        <strong style={{ fontSize: '20px' }}>{formatNumber(stats.totalViews)}</strong>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-download" style={{ color: '#388e3c' }}></i>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Tổng lượt tải</p>
                        <strong style={{ fontSize: '20px' }}>{formatNumber(stats.totalDownloads)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </BoTriQuanTri>
  )
}
