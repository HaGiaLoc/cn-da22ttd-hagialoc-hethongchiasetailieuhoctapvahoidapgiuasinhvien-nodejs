import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import BaoCaoModal from '../../components/user/BaoCaoModal'
import { mockDocuments, mockComments, mockStudents, generateAvatar } from '../../data/mockData'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { formatDate, formatNumber } from '../../utils/helpers'

export default function ChiTietTaiLieu() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [document, setDocument] = useState(null)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [isSaved, setIsSaved] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => {
    const doc = mockDocuments.find(d => d.id === parseInt(id))
    setDocument(doc || mockDocuments[0])
    
    // Lấy các bình luận cho tài liệu này
    const docComments = mockComments.filter(c => c.maTaiLieu === parseInt(id))
    setComments(docComments)
    
    // Kiểm tra xem tài liệu đã được lưu chưa
    if (user) {
      const savedDocs = JSON.parse(localStorage.getItem(`savedDocs_${user.id}`) || '[]')
      setIsSaved(savedDocs.includes(parseInt(id)))
    }
  }, [id, user])

  if (!document) return <BoTri><div>Loading...</div></BoTri>

  const handleDownload = () => {
    showNotification('Đang tải xuống tài liệu...', 'success', 1000)
  }

  const handleSave = () => {
    if (!user) {
      showNotification('Vui lòng đăng nhập để lưu tài liệu', 'error', 2000)
      return
    }

    const savedDocs = JSON.parse(localStorage.getItem(`savedDocs_${user.id}`) || '[]')
    const docId = parseInt(id)
    
    if (isSaved) {
      // Bỏ lưu
      const newSavedDocs = savedDocs.filter(id => id !== docId)
      localStorage.setItem(`savedDocs_${user.id}`, JSON.stringify(newSavedDocs))
      setIsSaved(false)
      showNotification('Đã bỏ lưu tài liệu', 'success', 1000)
    } else {
      // Lưu tài liệu
      savedDocs.push(docId)
      localStorage.setItem(`savedDocs_${user.id}`, JSON.stringify(savedDocs))
      setIsSaved(true)
      showNotification('Đã lưu tài liệu', 'success', 1000)
    }
  }

  const submitComment = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      showNotification('Đã gửi bình luận', 'success', 1000)
      setComment('')
    }
  }

  const handleCommentFocus = () => {
    if (!user) {
      showNotification('Vui lòng đăng nhập để bình luận', 'warning')
    }
  }

  return (
    <BoTri>
      <section className="document-detail-section">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <i className="fas fa-chevron-right"></i>
            <Link to="/documents">Tài liệu</Link>
            <i className="fas fa-chevron-right"></i>
            <span>{document.tieuDeTaiLieu}</span>
          </div>

          <div className="document-detail-container">
            <div className="document-main">
              <div className="document-header">
                <span className="document-type">
                  <i className="fas fa-file-pdf"></i> {document.type}
                </span>
                <h1>{document.tieuDeTaiLieu}</h1>
                <div className="document-author-info">
                  <img
                    src={generateAvatar(document.author)}
                    alt={document.author}
                  />
                  <div>
                    <p className="author-name">{document.author}</p>
                    <p className="upload-date">{formatDate(document.date)}</p>
                  </div>
                </div>
                <div className="document-stats">
                  <span>
                    <i className="fas fa-eye"></i> {formatNumber(document.views)} lượt xem
                  </span>
                  <span>
                    <i className="fas fa-download"></i> {formatNumber(document.downloads)} lượt tải
                  </span>
                </div>
              </div>

              <div className="document-actions">
                <button className="btn btn-primary" onClick={handleDownload}>
                  <i className="fas fa-download"></i> Tải xuống
                </button>
                <button className={`btn ${isSaved ? 'btn-primary' : 'btn-outline'}`} onClick={handleSave}>
                  <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i> {isSaved ? 'Đã lưu' : 'Lưu'}
                </button>
                <button className="btn btn-outline">
                  <i className="fas fa-share"></i> Chia sẻ
                </button>
                <button className="btn btn-outline" onClick={() => setShowReportModal(true)}>
                  <i className="fas fa-flag"></i> Báo cáo
                </button>
              </div>

              <div className="document-preview">
                <div className="preview-placeholder">
                  <i className="fas fa-file-pdf"></i>
                  <p>Xem trước tài liệu</p>
                </div>
              </div>

              {/* Rating */}
              <div className="rating-section">
                <h3>Đánh giá tài liệu</h3>
                <div className="user-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <i
                      key={star}
                      className={`fas fa-star ${star <= (hoverRating || userRating) ? 'active' : ''}`}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    ></i>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="comments-section">
                <h3>Bình luận ({comments.length})</h3>
                
                {comments.map(cmt => {
                  const student = mockStudents.find(s => s.id === cmt.maSinhVien)
                  return (
                    <div key={cmt.id} className="comment-item">
                      <img
                        src={student?.avatar || generateAvatar(student?.hoTenSinhVien || 'User')}
                        alt={student?.hoTenSinhVien}
                      />
                      <div className="comment-content">
                        <div className="comment-header">
                          <strong>{student?.hoTenSinhVien}</strong>
                          <span>{formatDate(cmt.ngayBinhLuan)}</span>
                        </div>
                        <p>{cmt.noiDungBinhLuan}</p>
                      </div>
                    </div>
                  )
                })}
                
                <form onSubmit={submitComment} className="comment-form">
                  <textarea
                    placeholder="Viết bình luận..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onFocus={handleCommentFocus}
                    rows="4"
                  ></textarea>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!comment.trim()}
                  >
                    Gửi bình luận
                  </button>
                </form>
              </div>
            </div>

            <div className="document-sidebar">
              <div className="sidebar-card">
                <h3>Thông tin</h3>
                <div className="info-list">
                  <div className="info-item">
                    <strong>Môn học:</strong>
                    <span>{document.subject}</span>
                  </div>
                  <div className="info-item">
                    <strong>Định dạng:</strong>
                    <span>{document.format}</span>
                  </div>
                  <div className="info-item">
                    <strong>Đánh giá:</strong>
                    <span>
                      <i className="fas fa-star"></i> {document.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal báo cáo */}
      <BaoCaoModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="document"
        reportedId={document.id}
        reportedTitle={document.tieuDeTaiLieu}
      />
    </BoTri>
  )
}
