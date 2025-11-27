import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTriQuanTri from '../../components/admin/BoTriQuanTri'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/helpers'
import { adminService } from '../../services'

export default function QuanTriCauTraLoi() {
  const { showNotification } = useNotification()
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAnswers()
  }, [])

  const loadAnswers = async () => {
    setIsLoading(true)
    try {
      const res = await adminService.getAllAnswers()
      setAnswers((res.data?.answers || []).sort((a, b) => a.maTraLoi - b.maTraLoi))
    } catch (error) {
      showNotification('Không thể tải danh sách câu trả lời', 'error', 3000)
    } finally {
      setIsLoading(false)
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
  )

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
                    <th>Trạng thái</th>
                    <th>Đánh giá</th>
                    <th>Ngày trả lời</th>
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
                          {/* Determine status using DB fields: trangThaiCTL and question status trangThaiCauHoi */}
                          <span className={`badge ${
                            (a.trangThaiCauHoi === 'answered' && a.trangThaiCTL === 'show') ? 'badge-success' :
                            a.trangThaiCTL === 'show' ? 'badge-info' : 'badge-secondary'
                          }`}>
                            {(a.trangThaiCauHoi === 'answered' && a.trangThaiCTL === 'show') ? 'Được chấp nhận' :
                             a.trangThaiCTL === 'show' ? 'Hiển thị' : 'Đã ẩn'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: a.danhGia > 0 ? '#4caf50' : a.danhGia < 0 ? '#f44336' : '#666' }}>
                            {a.danhGia > 0 ? '+' : ''}{a.danhGia || 0}
                          </strong>
                        </td>
                        <td>{formatDate(a.ngayTraLoi)}</td>
                        <td>
                          <div className="action-buttons">
                            {/* Approve (accept) if not currently accepted */}
                            {!(a.trangThaiCauHoi === 'answered' && a.trangThaiCTL === 'show') && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={async () => {
                                  if (!confirm('Chấp nhận câu trả lời này?')) return;
                                  try {
                                    await adminService.approveAnswer(a.maTraLoi)
                                    await loadAnswers()
                                    showNotification('Đã chấp nhận câu trả lời', 'success', 2000)
                                  } catch (err) {
                                    showNotification('Chấp nhận thất bại', 'error', 3000)
                                  }
                                }}
                                title="Chấp nhận"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}

                            {/* Hide / reject */}
                            {a.trangThaiCTL === 'show' && (
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={async () => {
                                  if (!confirm('Ẩn câu trả lời này?')) return;
                                  try {
                                    await adminService.rejectAnswer(a.maTraLoi)
                                    await loadAnswers()
                                    showNotification('Đã ẩn câu trả lời', 'success', 2000)
                                  } catch (err) {
                                    showNotification('Ẩn thất bại', 'error', 3000)
                                  }
                                }}
                                title="Ẩn"
                              >
                                <i className="fas fa-eye-slash"></i>
                              </button>
                            )}

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
    </BoTriQuanTri>
  )
}
