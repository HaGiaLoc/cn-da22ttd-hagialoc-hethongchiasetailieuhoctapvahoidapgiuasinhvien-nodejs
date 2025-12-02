import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import BaoCaoModal from '../../components/user/BaoCaoModal'
import EditQuestionModal from '../../components/user/EditQuestionModal'
import { cauHoiService } from '../../api'
import { useNotification } from '../../contexts/NotificationContext'
import { useAuth } from '../../contexts/AuthContext'
import { formatDate, generateAvatar } from '../../utils/helpers'

export default function ChiTietCauHoi() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [question, setQuestion] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [answers, setAnswers] = useState([])
  const [answer, setAnswer] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    loadQuestion()
  }, [id])

  const loadQuestion = async () => {
    try {
      setIsLoading(true)
      const q = await cauHoiService.getById(id)
      setQuestion(q)
      setAnswers(q.answers || [])
    } catch (error) {
      console.error('Error loading question:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  if (!question) return <BoTri><div>Loading...</div></BoTri>

  const handleVote = async (direction, type = 'question', targetId = null) => {
    if (!user) {
      showNotification('Vui lòng đăng nhập để vote', 'warning')
      return
    }

    try {
      const isUpvote = direction === 'up'
      if (type === 'question') {
        await cauHoiService.voteQuestion(id, isUpvote)
        await loadQuestion()
      } else {
        await cauHoiService.voteAnswer(targetId, isUpvote)
        await loadQuestion()
      }
      showNotification(`Đã ${direction === 'up' ? 'upvote' : 'downvote'}`, 'success', 1000)
    } catch (error) {
      showNotification(error.message || 'Không thể vote', 'error')
    }
  }

  const handleTextareaFocus = () => {
    if (!user) {
      showNotification('Vui lòng đăng nhập để trả lời câu hỏi', 'warning')
    }
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!user) {
      showNotification('Vui lòng đăng nhập để trả lời câu hỏi', 'warning')
      return
    }
    
    if (answer.trim()) {
      try {
        await cauHoiService.answer(id, answer.trim())
        showNotification('Đã gửi câu trả lời', 'success', 1000)
        setAnswer('')
        await loadQuestion()
      } catch (error) {
        showNotification(error.message || 'Không thể gửi câu trả lời', 'error')
      }
    }
  }

  const handleEditQuestion = () => {
    setShowEditModal(true)
    setShowDropdown(false)
  }

  const handleSaveEdit = async (formData) => {
    try {
      await cauHoiService.update(id, formData)
      showNotification('Cập nhật câu hỏi thành công', 'success', 2000)
      setShowEditModal(false)
      await loadQuestion()
    } catch (error) {
      showNotification(error.message || 'Không thể cập nhật câu hỏi', 'error')
    }
  }

  const handleToggleStatus = async () => {
    try {
      const newStatus = question.trangThaiCH === 'show' ? 'hidden' : 'show'
      await cauHoiService.updateStatus(id, newStatus)
      showNotification(
        `Đã ${newStatus === 'show' ? 'hiển thị' : 'ẩn'} câu hỏi`,
        'success',
        2000
      )
      setShowDropdown(false)
      await loadQuestion()
    } catch (error) {
      showNotification(error.message || 'Không thể thay đổi trạng thái', 'error')
    }
  }

  return (
    <BoTri>
      <section className="question-detail-section">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <i className="fas fa-chevron-right"></i>
            <Link to="/qa">Hỏi đáp</Link>
            <i className="fas fa-chevron-right"></i>
            <span>{question.tieuDeCH}</span>
          </div>

          <div className="question-detail">
            <div className="question-main">
              <div className="question-header">
                <div className="question-header-top">
                  <div className="question-meta">
                    <img 
                      src={generateAvatar(question.hoTenSV)} 
                      alt={question.hoTenSV}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <span className="author-name">{question.hoTenSV}</span>
                      <div className="question-date-views">
                        <span>Ngày đăng: {formatDate(question.ngayDatCH)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="question-actions" ref={dropdownRef}>
                    <button 
                      className="btn-icon-only"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {showDropdown && (
                      <div className="dropdown-menu">
                        {user && user.id === question.maSinhVien && (
                          <>
                            <button onClick={handleEditQuestion}>
                              <i className="fas fa-edit"></i>
                              Chỉnh sửa câu hỏi
                            </button>
                            <button onClick={handleToggleStatus}>
                              <i className={`fas fa-${question.trangThaiCH === 'show' ? 'eye-slash' : 'eye'}`}></i>
                              {question.trangThaiCH === 'show' ? 'Ẩn câu hỏi' : 'Hiển thị câu hỏi'}
                            </button>
                          </>
                        )}
                        <button onClick={() => {
                          setShowReportModal(true)
                          setShowDropdown(false)
                        }}>
                          <i className="fas fa-flag"></i>
                          Báo cáo vi phạm
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h1>{question.tieuDeCH}</h1>
                <div className="question-subject-tags">
                  <span className="subject-tag"><i className="fas fa-book"></i> {question.tenMon}</span>
                  <span className="major-tag"><i className="fas fa-graduation-cap"></i> {question.tenNganh}</span>
                </div>
              </div>

              <div className="question-body">
                <div className="question-voting">
                  <button 
                    onClick={() => user?.role === 'student' && handleVote('up', 'question')}
                    className={user && question.userVote?.Upvote ? 'active' : ''}
                    title={!user ? 'Đăng nhập để vote' : user?.role === 'admin' ? 'Quản trị viên không thể đánh giá' : 'Upvote'}
                    disabled={!user || user?.role === 'admin'}
                    style={user?.role === 'admin' ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <span className="vote-count">{question.votes || 0}</span>
                  <button 
                    onClick={() => user?.role === 'student' && handleVote('down', 'question')}
                    className={user && question.userVote?.Downvote ? 'active' : ''}
                    title={!user ? 'Đăng nhập để vote' : user?.role === 'admin' ? 'Quản trị viên không thể đánh giá' : 'Downvote'}
                    disabled={!user || user?.role === 'admin'}
                    style={user?.role === 'admin' ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                  >
                    <i className="fas fa-arrow-down"></i>
                  </button>
                </div>

                <div className="question-content">
                  <p>{question.noiDungCH}</p>
                  <div className="question-tags">
                    {question.tags && (Array.isArray(question.tags) 
                      ? question.tags 
                      : (typeof question.tags === 'string' ? question.tags.split(',').filter(t => t.trim()) : [])
                    ).map((tag, index) => (
                      <span key={index} className="tag">{typeof tag === 'string' ? tag : tag.tenTag || tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="answers-section">
                <h3>{answers.length} Câu trả lời</h3>
                <div className="answers-list">
                  {answers.map(ans => (
                    <div key={ans.maCauTraLoi} className="answer-item">
                      <div className="answer-voting">
                        <button 
                          onClick={() => user?.role === 'student' && handleVote('up', 'answer', ans.maCauTraLoi)}
                          title={!user ? 'Đăng nhập để vote' : user?.role === 'admin' ? 'Quản trị viên không thể đánh giá' : 'Upvote'}
                          disabled={!user || user?.role === 'admin'}
                          style={user?.role === 'admin' ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                        >
                          <i className="fas fa-arrow-up"></i>
                        </button>
                        <span className="vote-count">{ans.votes || 0}</span>
                        <button 
                          onClick={() => user?.role === 'student' && handleVote('down', 'answer', ans.maCauTraLoi)}
                          title={!user ? 'Đăng nhập để vote' : user?.role === 'admin' ? 'Quản trị viên không thể đánh giá' : 'Downvote'}
                          disabled={!user || user?.role === 'admin'}
                          style={user?.role === 'admin' ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
                        >
                          <i className="fas fa-arrow-down"></i>
                        </button>
                      </div>
                      <div className="answer-content">
                        <p>{ans.noiDungCTL}</p>
                        <div className="answer-meta">
                          <span>Trả lời bởi {ans.hoTenSV}</span>
                          <span>{formatDate(ans.ngayTraLoi)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {user?.role !== 'admin' && (
                <div className="answer-form-section">
                  <h3>Câu trả lời của bạn</h3>
                  {user ? (
                    <form onSubmit={handleSubmitAnswer} className="answer-form">
                      <textarea
                        rows="6"
                        placeholder="Viết câu trả lời của bạn..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                      ></textarea>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={!answer.trim()}
                      >
                        Gửi câu trả lời
                      </button>
                    </form>
                  ) : (
                    <div className="login-prompt">
                      <p>Vui lòng <Link to="/dang-nhap">đăng nhập</Link> để trả lời câu hỏi</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BaoCaoModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="question"
        reportedId={question?.maCauHoi}
        reportedTitle={question?.tieuDeCH}
      />

      {showEditModal && (
        <EditQuestionModal
          question={question}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}
    </BoTri>
  )
}
