import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import TheTaiLieu from '../../components/user/TheTaiLieu'
import TheCauHoi from '../../components/user/TheCauHoi'
import { useAuth } from '../../contexts/AuthContext'
import { generateAvatar } from '../../utils/helpers'
import { taiLieuService, cauHoiService } from '../../services'

export default function HoSo() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('documents')
  const [userDocuments, setUserDocuments] = useState([])
  const [userQuestions, setUserQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [savedDocuments, setSavedDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { state: { from: location } })
    } else {
      loadUserData()
    }
  }, [user, navigate, loading])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      // Fetch user's documents and questions from authenticated endpoints
      const [docsRes, questionsRes, answersRes, savedRes] = await Promise.all([
        taiLieuService.getMyDocuments(1, 1000),
        cauHoiService.getMyQuestions(1, 1000),
        cauHoiService.getMyAnswers(1, 1000),
        taiLieuService.getSavedDocuments(1, 1000)
      ])

      // normalize response shapes
      const docs = docsRes?.documents || docsRes?.data?.documents || docsRes?.data || docsRes || []
      const questions = questionsRes?.questions || questionsRes?.data?.questions || questionsRes?.data || questionsRes || []
      const answers = answersRes?.answers || answersRes?.data?.answers || answersRes?.data || answersRes || []
      const saved = savedRes?.documents || savedRes?.data?.documents || savedRes?.data || savedRes || []

      setUserDocuments(docs)
      setUserQuestions(questions)
      setUserAnswers(answers)
      setSavedDocuments(saved)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const stats = {
    documents: userDocuments.length,
    questions: userQuestions.length,
    answers: userAnswers.length
  }

  const student = { nganh: 'Chưa cập nhật', truongHoc: 'Chưa cập nhật' }

  return (
    <BoTri>
      <section className="profile-section">
        <div className="container">
          <div className="profile-header">
            <div className="profile-cover"></div>
            <div className="profile-info">
              <img src={user?.avatar || generateAvatar(user?.name)} alt={user?.name} className="profile-avatar" />
              <div className="profile-details">
                <h1>{user?.name}</h1>
                <p>{user?.email}</p>
                <div className="profile-meta">
                  <span><i className="fas fa-graduation-cap"></i> {student?.nganh || 'Chưa cập nhật'}</span>
                  <span><i className="fas fa-university"></i> {student?.truongHoc || 'Chưa cập nhật'}</span>
                </div>
              </div>
              <Link to="/profile/edit" className="btn btn-outline">
                <i className="fas fa-edit"></i> Chỉnh sửa
              </Link>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <i className="fas fa-file-alt"></i>
              <div>
                <h3>{stats.documents}</h3>
                <p>Tài liệu</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-question-circle"></i>
              <div>
                <h3>{stats.questions}</h3>
                <p>Câu hỏi</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-comments"></i>
              <div>
                <h3>{stats.answers}</h3>
                <p>Câu trả lời</p>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-tabs">
              <button
                className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <i className="fas fa-file-alt"></i> Tài liệu
              </button>
              <button
                className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('questions')}
              >
                <i className="fas fa-question-circle"></i> Câu hỏi
              </button>
              <button
                className={`tab-btn ${activeTab === 'answers' ? 'active' : ''}`}
                onClick={() => setActiveTab('answers')}
              >
                <i className="fas fa-comments"></i> Câu trả lời
              </button>
              <button
                className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <i className="fas fa-bookmark"></i> Đã lưu
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'documents' && (
                <div className="tab-pane">
                  {userDocuments.length > 0 ? (
                    <div className="documents-grid">
                      {userDocuments.map(doc => (
                        <TheTaiLieu
                          key={doc.maTaiLieu}
                          document={doc}
                          onSaveChange={(id, saved) => {
                            // If saved, add to savedDocuments; if unsaved, remove
                            setSavedDocuments(prev => {
                              const exists = prev.some(d => (d.maTaiLieu || d.id) === id)
                              if (saved) {
                                if (exists) return prev
                                // find the doc in userDocuments to add
                                const toAdd = userDocuments.find(d => (d.maTaiLieu || d.id) === id)
                                return toAdd ? [toAdd, ...prev] : prev
                              } else {
                                return prev.filter(d => (d.maTaiLieu || d.id) !== id)
                              }
                            })
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-file-alt"></i>
                      <h3>Chưa có tài liệu nào</h3>
                      <p>Bạn chưa tải lên tài liệu nào.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="tab-pane">
                  {userQuestions.length > 0 ? (
                    <div className="questions-list">
                      {userQuestions.map(q => (
                        <TheCauHoi key={q.maCauHoi || q.id} question={q} />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-question-circle"></i>
                      <h3>Chưa có câu hỏi nào</h3>
                      <p>Bạn chưa đặt câu hỏi nào.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'answers' && (
                <div className="tab-pane">
                  {userAnswers.length > 0 ? (
                    <div className="answers-list">
                      {userAnswers.map(ans => (
                        <div key={ans.maCauTraLoi} className="answer-item">
                          <div className="answer-voting">
                            <span className="vote-count">{ans.votes || 0}</span>
                          </div>
                          <div className="answer-content">
                            <p>{ans.noiDungCTL}</p>
                            <div className="answer-meta">
                              <Link to={`/qa/${ans.maCauHoi}`} className="question-link">{ans.tieuDeCH || 'Câu hỏi liên quan'}</Link>
                              <span>{new Date(ans.ngayTraLoi).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-comments"></i>
                      <h3>Chưa có câu trả lời nào</h3>
                      <p>Bạn chưa trả lời câu hỏi nào.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="tab-pane">
                  {savedDocuments.length > 0 ? (
                    <div className="documents-grid">
                      {savedDocuments.map(doc => (
                        <TheTaiLieu
                          key={doc.maTaiLieu}
                          document={doc}
                          onSaveChange={(id, saved) => {
                            // If unsaved from the saved tab, remove it; if saved, ensure it remains
                            setSavedDocuments(prev => {
                              if (saved) {
                                const exists = prev.some(d => (d.maTaiLieu || d.id) === id)
                                return exists ? prev : [doc, ...prev]
                              }
                              return prev.filter(d => (d.maTaiLieu || d.id) !== id)
                            })
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-bookmark"></i>
                      <h3>Chưa có tài liệu đã lưu</h3>
                      <p>Bạn chưa lưu tài liệu nào.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
