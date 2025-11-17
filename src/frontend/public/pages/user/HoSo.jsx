import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import TheTaiLieu from '../../components/user/TheTaiLieu'
import TheCauHoi from '../../components/user/TheCauHoi'
import { useAuth } from '../../contexts/AuthContext'
import { mockDocuments, mockQuestions, mockStudents, generateAvatar } from '../../data/mockData'

export default function HoSo() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('documents')

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { state: { from: location } })
    }
  }, [user, navigate, loading])

  // Tìm thông tin sinh viên đầy đủ
  const student = mockStudents.find(s => s.id === user?.id)
  
  // Lọc tài liệu và câu hỏi của người dùng hiện tại
  const userDocuments = mockDocuments.filter(doc => doc.author === user?.name)
  const userQuestions = mockQuestions.filter(q => q.author === user?.name)
  
  // Lấy tài liệu đã lưu
  const savedDocIds = user ? JSON.parse(localStorage.getItem(`savedDocs_${user.id}`) || '[]') : []
  const savedDocuments = mockDocuments.filter(doc => savedDocIds.includes(doc.id))
  
  // Tính toán số liệu thống kê từ dữ liệu thực
  const stats = {
    documents: userDocuments.length,
    questions: userQuestions.length,
    answers: userQuestions.reduce((sum, q) => sum + q.answers, 0)
  }

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
                        <TheTaiLieu key={doc.id} document={doc} />
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
                        <TheCauHoi key={q.id} question={q} />
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
                  <div className="empty-state">
                    <i className="fas fa-comments"></i>
                    <h3>Chưa có câu trả lời nào</h3>
                    <p>Bạn chưa trả lời câu hỏi nào.</p>
                  </div>
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="tab-pane">
                  {savedDocuments.length > 0 ? (
                    <div className="documents-grid">
                      {savedDocuments.map(doc => (
                        <TheTaiLieu key={doc.id} document={doc} />
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
