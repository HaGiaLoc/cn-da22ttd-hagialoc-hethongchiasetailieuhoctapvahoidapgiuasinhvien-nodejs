import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import BaoCaoModal from '../../components/user/BaoCaoModal'
import { mockQuestions, mockAnswers, mockStudents, generateAvatar } from '../../data/mockData'
import { useNotification } from '../../contexts/NotificationContext'
import { useAuth } from '../../contexts/AuthContext'
import { formatDate } from '../../utils/helpers'

export default function ChiTietCauHoi() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [answer, setAnswer] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const q = mockQuestions.find(q => q.id === parseInt(id))
    setQuestion(q || mockQuestions[0])
    
    // Lấy các câu trả lời cho câu hỏi này
    const questionAnswers = mockAnswers.filter(a => a.questionId === parseInt(id))
    setAnswers(questionAnswers)
  }, [id])

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

  const handleVote = (direction) => {
    showNotification(`Đã ${direction === 'up' ? 'upvote' : 'downvote'}`, 'success', 1000)
  }

  const handleTextareaFocus = () => {
    if (!user) {
      showNotification('Vui lòng đăng nhập để trả lời câu hỏi', 'warning')
    }
  }

  const handleSubmitAnswer = (e) => {
    e.preventDefault()
    if (answer.trim()) {
      showNotification('Đã gửi câu trả lời', 'success', 1000)
      setAnswer('')
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
            <span>{question.title}</span>
          </div>

          <div className="question-detail">
            <div className="question-main">
              <div className="question-header">
                <div className="question-header-top">
                  <div className="question-meta">
                    <img 
                      src={mockStudents.find(s => s.hoTenSinhVien === question.author)?.avatar || generateAvatar(question.author)} 
                      alt={question.author}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <span className="author-name">{question.author}</span>
                      <div className="question-date-views">
                        <span>Ngày đăng: {formatDate(question.date)}</span>
                        <span>•</span>
                        <span>{question.views} lượt xem</span>
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
                <h1>{question.title}</h1>
                <div className="question-subject-tags">
                  <span className="subject-tag"><i className="fas fa-book"></i> {question.subject}</span>
                  <span className="major-tag"><i className="fas fa-graduation-cap"></i> {question.major}</span>
                </div>
              </div>

              <div className="question-body">
                <div className="question-voting">
                  <button onClick={() => handleVote('up')}>
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <span className="vote-count">{question.votes}</span>
                  <button onClick={() => handleVote('down')}>
                    <i className="fas fa-arrow-down"></i>
                  </button>
                </div>

                <div className="question-content">
                  <p>{question.content}</p>
                  <div className="question-tags">
                    {question.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="answers-section">
                <h3>{answers.length} Câu trả lời</h3>
                <div className="answers-list">
                  {answers.map(ans => (
                    <div key={ans.id} className="answer-item">
                      <div className="answer-voting">
                        <button><i className="fas fa-arrow-up"></i></button>
                        <span className="vote-count">{ans.votes}</span>
                        <button><i className="fas fa-arrow-down"></i></button>
                      </div>
                      <div className="answer-content">
                        <p>{ans.content}</p>
                        <div className="answer-meta">
                          <span>Trả lời bởi {ans.author}</span>
                          <span>{formatDate(ans.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="answer-form-section">
                <h3>Câu trả lời của bạn</h3>
                <form onSubmit={handleSubmitAnswer} className="answer-form">
                  <textarea
                    rows="6"
                    placeholder="Viết câu trả lời của bạn..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onFocus={handleTextareaFocus}
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <BaoCaoModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="question"
        reportedId={question?.id}
        reportedTitle={question?.title}
      />
    </BoTri>
  )
}
