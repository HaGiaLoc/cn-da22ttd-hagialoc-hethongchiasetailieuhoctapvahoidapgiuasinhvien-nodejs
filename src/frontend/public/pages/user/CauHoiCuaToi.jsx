import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import TheCauHoi from '../../components/user/TheCauHoi'
import PhanTrang from '../../components/user/PhanTrang'
import { cauHoiService } from '../../services'
import { useAuth } from '../../contexts/AuthContext'

export default function CauHoiCuaToi() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const [myQuestions, setMyQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  // filterStatus values: 'all' | 'show' | 'answered'
  const [filterStatus, setFilterStatus] = useState('all')
  const itemsPerPage = 10

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { state: { from: location } })
    } else {
      loadQuestions()
    }
  }, [user, navigate, loading])

  const loadQuestions = async () => {
    try {
      setIsLoading(true)
      // Fetch user's questions from backend. Request a large limit to retrieve all and paginate client-side.
      const res = await cauHoiService.getMyQuestions(1, 1000)
      const questions = res?.questions || res?.data?.questions || []
      setMyQuestions(questions)
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  let filteredQuestions = [...myQuestions]
  if (filterStatus === 'answered') {
    // show only questions marked as answered
    filteredQuestions = filteredQuestions.filter(q => (q.trangThaiCauHoi || q.trangThaiCH || q.status) === 'answered')
  } else if (filterStatus === 'show') {
    // show only visible / unresolved questions (DB uses 'show')
    filteredQuestions = filteredQuestions.filter(q => (q.trangThaiCauHoi || q.trangThaiCH || q.status) === 'show')
  }

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)
  const currentQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <BoTri>
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-question-circle"></i> Câu hỏi của tôi</h1>
          <p>Quản lý câu hỏi bạn đã đặt</p>
        </div>
      </section>

      <section className="qa-section">
        <div className="container">
          <div className="section-header">
            <div className="header-left">
              <h2>{myQuestions.length} câu hỏi</h2>
            </div>
            <div className="header-right">
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Tất cả
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'show' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('show')}
                >
                  Chưa giải quyết
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'answered' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('answered')}
                >
                  Đã giải quyết
                </button>
              </div>
              <Link to="/ask" className="btn btn-primary">
                Đặt câu hỏi mới
              </Link>
            </div>
          </div>

          {currentQuestions.length > 0 ? (
            <>
              <div className="questions-list">
                {currentQuestions.map(question => (
                  <TheCauHoi key={question.maCauHoi} question={question} />
                ))}
              </div>

              {totalPages > 1 && (
                <PhanTrang
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="empty-state">
              <i className="fas fa-question-circle"></i>
              <h3>Chưa có câu hỏi nào</h3>
              <p>Bạn chưa đặt câu hỏi nào. Hãy đặt câu hỏi để nhận trợ giúp từ cộng đồng!</p>
              <Link to="/ask" className="btn btn-primary">
                Đặt câu hỏi
              </Link>
            </div>
          )}
        </div>
      </section>
    </BoTri>
  )
}
