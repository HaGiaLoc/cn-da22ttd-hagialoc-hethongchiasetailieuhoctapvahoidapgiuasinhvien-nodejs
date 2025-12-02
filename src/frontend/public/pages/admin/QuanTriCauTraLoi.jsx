import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import EditAnswerModal from '../../components/admin/EditAnswerModal'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/helpers'
import { adminService } from '../../api'

export default function QuanTriCauTraLoi() {
  const { showNotification } = useNotification()
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [editingAnswer, setEditingAnswer] = useState(null)

  useEffect(() => {
    loadAnswers()
  }, [])

  const loadAnswers = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getAllAnswers()
      setAnswers(res.data?.answers || [])
    } catch (error) {
      showNotification('Không thể tải danh sách câu trả lời', 'error', 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (answer) => {
    setEditingAnswer(answer)
  }

  const handleSaveEdit = async (formData) => {
    try {
      await adminService.updateAnswer(editingAnswer.maTraLoi, formData)
      await loadAnswers()
      setEditingAnswer(null)
      showNotification('Cập nhật câu trả lời thành công', 'success', 2000)
    } catch (error) {
      showNotification('Cập nhật câu trả lời thất bại', 'error', 3000)
    }
  }

  const handleDelete = async (maTraLoi) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu trả lời này?')) return
    try {
      await adminService.deleteAnswer(maTraLoi)
      showNotification('Đã xóa câu trả lời', 'success', 2000)
      loadAnswers()
    } catch (error) {
      showNotification('Không thể xóa câu trả lời', 'error', 3000)
    }
  }

  const filteredAnswers = answers.filter(a => 
    a.hoTenSV?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tieuDeCauHoi?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.ngayTraLoi) - new Date(a.ngayTraLoi)
      case 'oldest':
        return new Date(a.ngayTraLoi) - new Date(b.ngayTraLoi)
      case 'highest-rating':
        return (b.danhGia || 0) - (a.danhGia || 0)
      case 'lowest-rating':
        return (a.danhGia || 0) - (b.danhGia || 0)
      default:
        return 0
    }
  })

  return (
    <BoTriQuanTri>
      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-comments"></i> Quản lý câu trả lời</h1>
            <p>Quản lý các câu trả lời từ người dùng</p>
          </div>
        </div>

        <div className="admin-filters">
          <div className="filter-group search-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Tìm theo tác giả hoặc câu hỏi..."
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
            <span>Tổng: <strong>{filteredAnswers.length}</strong> câu trả lời</span>
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
                    <th>Câu hỏi</th>
                    <th>Nội dung trả lời</th>
                    <th>Tác giả</th>
                    <th>Đánh giá</th>
                    <th>Ngày trả lời</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnswers.length === 0 ? (
                    <tr><td colSpan="8" className="empty-state">Chưa có câu trả lời nào</td></tr>
                  ) : (
                    filteredAnswers.map(a => (
                      <tr key={a.maTraLoi}>
                        <td><strong>{a.maTraLoi}</strong></td>
                        <td>
                          <Link to={`/qa/${a.maCauHoi}`} target="_blank">
                            {a.tieuDeCauHoi}
                          </Link>
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {a.noiDungTraLoi}
                          </div>
                        </td>
                        <td>{a.hoTenSV}</td>
                        <td>
                          <strong style={{ color: a.danhGia > 0 ? '#4caf50' : a.danhGia < 0 ? '#f44336' : '#666' }}>
                            {a.danhGia > 0 ? '+' : ''}{a.danhGia || 0}
                          </strong>
                        </td>
                        <td>{formatDate(a.ngayTraLoi)}</td>
                        <td>
                          <span className={`badge badge-${
                            a.trangThaiCTL === 'show' ? 'success' : 'danger'
                          }`}>
                            {a.trangThaiCTL === 'show' ? 'Hiện' : 'Ẩn'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleEdit(a)}
                              title="Sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(a.maTraLoi)}
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

      {editingAnswer && (
        <EditAnswerModal
          answer={editingAnswer}
          onClose={() => setEditingAnswer(null)}
          onSave={handleSaveEdit}
        />
      )}
    </BoTriQuanTri>
  )
}
