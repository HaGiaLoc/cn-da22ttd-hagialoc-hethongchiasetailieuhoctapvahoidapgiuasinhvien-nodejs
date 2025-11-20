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
      const res = await cauHoiService.getAll()
      const questions = res.questions || res.data || []
      setMyQuestions(questions.filter(q => q.author === user?.name))
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  let filteredQuestions = [...myQuestions]
  if (filterStatus === 'solved') {
    filteredQuestions = filteredQuestions.filter(q => q.status === 'solved')
  } else if (filterStatus === 'open') {
    filteredQuestions = filteredQuestions.filter(q => q.status === 'open')
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
                  className={`filter-btn ${filterStatus === 'open' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('open')}
                >
                  Chưa giải quyết
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'solved' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('solved')}
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
