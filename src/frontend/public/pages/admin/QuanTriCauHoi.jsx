import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate, formatNumber } from '../../utils/helpers'
import { adminService } from '../../services'

export default function QuanTriCauHoi() {
  const { showNotification } = useNotification()
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getAllQuestions()
      setQuestions((res.data?.questions || []).sort((a, b) => a.maCauHoi - b.maCauHoi))
    } catch (error) {
      showNotification('Không thể tải danh sách câu hỏi', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (maCauHoi) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return
    try {
      await adminService.deleteQuestion(maCauHoi)
      showNotification('Đã xóa câu hỏi', 'success', 2000)
      loadQuestions()
    } catch (error) {
      showNotification('Không thể xóa câu hỏi', 'error', 3000)
    }
  }

  const filteredQuestions = questions.filter(q => 
    q.tieuDeCauHoi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.hoTenSV?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-question-circle"></i> Quản lý câu hỏi</h1>
            <p>Quản lý các câu hỏi từ người dùng</p>
          </div>
        </div>

        <div className="admin-filters">
          <div className="filter-group search-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Tìm theo tiêu đề hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-stats">
            <span>Tổng: <strong>{filteredQuestions.length}</strong> câu hỏi</span>
          </div>
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
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Trạng thái</th>
                    <th>Trả lời</th>
                    <th>Đánh giá</th>
                    <th>Lượt xem</th>
                    <th>Ngày đăng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.length === 0 ? (
                    <tr><td colSpan="9" className="empty-state">Chưa có câu hỏi nào</td></tr>
                  ) : (
                    filteredQuestions.map(q => (
                      <tr key={q.maCauHoi}>
                        <td><strong>{q.maCauHoi}</strong></td>
                        <td>
                          <Link to={`/qa/${q.maCauHoi}`} target="_blank">
                            {q.tieuDeCauHoi}
                          </Link>
                        </td>
                        <td>{q.hoTenSV}</td>
                        <td>
                          <span className={`badge ${
                            q.trangThaiCauHoi === 'open' ? 'badge-warning' : 
                            q.trangThaiCauHoi === 'answered' ? 'badge-success' : 
                            'badge-secondary'
                          }`}>
                            {q.trangThaiCauHoi === 'open' ? 'Đang mở' : 
                             q.trangThaiCauHoi === 'answered' ? 'Đã trả lời' : 
                             'Đã đóng'}
                          </span>
                        </td>
                        <td>{formatNumber(q.soLuongTraLoi || 0)}</td>
                        <td>
                          <strong style={{ color: q.votes > 0 ? '#4caf50' : q.votes < 0 ? '#f44336' : '#666' }}>
                            {q.votes > 0 ? '+' : ''}{q.votes || 0}
                          </strong>
                        </td>
                        <td>{formatNumber(q.luotXem || 0)}</td>
                        <td>{formatDate(q.ngayDang)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(q.maCauHoi)}
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
      </section>
    </BoTriQuanTri>
  )
}
