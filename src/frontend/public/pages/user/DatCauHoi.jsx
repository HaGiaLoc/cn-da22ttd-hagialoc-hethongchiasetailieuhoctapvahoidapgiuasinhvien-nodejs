import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { mockQuestions, mockQuestionCategories } from '../../data/mockData'

export default function DatCauHoi() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const { showNotification } = useNotification()

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { state: { from: location } })
    }
  }, [user, navigate, loading])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    major: '',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')

  // Lấy tất cả tags duy nhất từ các câu hỏi
  const getAllTags = () => {
    const tagsSet = new Set()
    mockQuestions.forEach(question => {
      question.tags.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  }

  const allTags = getAllTags()

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (formData.tags.length < 5 && !formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }))
        setTagInput('')
      }
    }
  }

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const addSuggestedTag = (tag) => {
    if (formData.tags.length < 5 && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim() && formData.content.trim()) {
      showNotification('Câu hỏi đã được đăng', 'success', 1000)
      navigate('/qa')
    }
  }

  return (
    <BoTri>
      <section className="page-title">
        <div className="container">
          <h1><i className="fas fa-question-circle"></i> Đặt câu hỏi</h1>
          <p>Chia sẻ câu hỏi của bạn với cộng đồng sinh viên</p>
        </div>
      </section>

      <section className="ask-question-section">
        <div className="container">
          <div className="ask-container">
            <div className="ask-main">
              <form onSubmit={handleSubmit} className="ask-form">
                <div className="form-section">
                  <label>Tiêu đề câu hỏi *</label>
                  <input
                    type="text"
                    required
                    maxLength="200"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Tóm tắt vấn đề của bạn..."
                  />
                  <small>{formData.title.length}/200 ký tự</small>
                </div>

                <div className="form-section">
                  <label>Nội dung câu hỏi *</label>
                  <textarea
                    required
                    rows="10"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                  ></textarea>
                  <small>{formData.content.length} ký tự</small>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-section">
                    <label>Môn học *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Chọn môn học</option>
                      {mockQuestionCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-section">
                    <label>Ngành *</label>
                    <select
                      required
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    >
                      <option value="">Chọn ngành</option>
                      <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    </select>
                  </div>
                </div>

                <div className="form-section">
                  <label>Tags</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={addTag}
                    placeholder="Nhấn Enter để thêm tag (Tối đa 5)"
                  />
                  <div className="tags-display">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <i className="fas fa-times" onClick={() => removeTag(index)}></i>
                      </span>
                    ))}
                  </div>
                  <div className="suggested-tags">
                    <strong>Tags gợi ý:</strong>
                    {allTags.map((tag, index) => (
                      <span 
                        key={index}
                        className="tag" 
                        onClick={() => addSuggestedTag(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => navigate('/qa')}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-paper-plane"></i> Đăng câu hỏi
                  </button>
                </div>
              </form>
            </div>

            <div className="ask-sidebar">
              <div className="sidebar-card">
                <h3>💡 Mẹo đặt câu hỏi hay</h3>
                <ul>
                  <li>Tóm tắt vấn đề ngắn gọn trong tiêu đề</li>
                  <li>Mô tả chi tiết trong nội dung</li>
                  <li>Đính kèm code nếu có</li>
                  <li>Thêm tags liên quan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
