import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import EditQuestionModal from '../../components/admin/EditQuestionModal'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate, formatNumber } from '../../utils/helpers'
import { adminService } from '../../api'

export default function QuanTriCauHoi() {
  const { showNotification } = useNotification()
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [editingQuestion, setEditingQuestion] = useState(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getAllQuestions()
      setQuestions(res.data?.questions || [])
    } catch (error) {
      showNotification('Không thể tải danh sách câu hỏi', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
  }

  const handleSaveEdit = async (formData) => {
    try {
      await adminService.updateQuestion(editingQuestion.maCauHoi, formData)
      await loadQuestions()
      setEditingQuestion(null)
      showNotification('Cập nhật câu hỏi thành công', 'success', 2000)
    } catch (error) {
      showNotification('Cập nhật câu hỏi thất bại', 'error', 3000)
    }
  }

  const handleDelete = async (maCauHoi) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn câu hỏi này?')) return
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
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.ngayDang) - new Date(a.ngayDang)
      case 'oldest':
        return new Date(a.ngayDang) - new Date(b.ngayDang)
      case 'highest-rating':
        return (b.votes || 0) - (a.votes || 0)
      case 'lowest-rating':
        return (a.votes || 0) - (b.votes || 0)
      default:
        return 0
    }
  })

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
          <div className="filter-group">
            <label>Sắp xếp:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest-rating">Đánh giá cao nhất</option>
              <option value="lowest-rating">Đánh giá thấp nhất</option>
            </select>
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
                    <th>Trả lời</th>
                    <th>Đánh giá</th>
                    <th>Lượt xem</th>
                    <th>Ngày đăng</th>
                    <th>Trạng thái</th>
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
                        <td>{formatNumber(q.soLuongTraLoi || 0)}</td>
                        <td>
                          <strong style={{ color: q.votes > 0 ? '#4caf50' : q.votes < 0 ? '#f44336' : '#666' }}>
                            {q.votes > 0 ? '+' : ''}{q.votes || 0}
                          </strong>
                        </td>
                        <td>{formatNumber(q.luotXem || 0)}</td>
                        <td>{formatDate(q.ngayDang)}</td>
                        <td>
                          <span className={`badge badge-${
                            q.trangThaiCauHoi === 'show' ? 'success' : 'danger'
                          }`}>
                            {q.trangThaiCauHoi === 'show' ? 'Hiện' : 'Ẩn'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleEdit(q)}
                              title="Sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
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

      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={handleSaveEdit}
        />
      )}
    </BoTriQuanTri>
  )
}
