import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { cauHoiService } from '../../services'


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
    maNganh: '',
    maMon: '',
    tags: []
  })
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    majors: [],
    tags: []
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      const [monRes, nganhRes, tagsRes] = await Promise.all([
        cauHoiService.getMon(),
        cauHoiService.getNganh(),
        cauHoiService.getTags()
      ])

      console.log('Filter options loaded:', { monRes, nganhRes, tagsRes })

      setFilterOptions({
        subjects: monRes?.data || monRes || [],
        majors: nganhRes?.data || nganhRes || [],
        tags: tagsRes?.data || tagsRes || []
      })
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const getAllTags = () => {
    return filterOptions.tags.map(tag => tag.tenTag || tag).filter(Boolean)
  }

  const allTags = getAllTags()

  // Lọc môn học theo ngành được chọn
  const filteredSubjects = formData.maNganh
    ? filterOptions.subjects.filter(mon => mon.maNganh === parseInt(formData.maNganh))
    : filterOptions.subjects

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.maMon) {
      showNotification('Vui lòng điền đầy đủ thông tin', 'warning')
      return
    }

    try {
      const questionData = {
        tieuDeCH: formData.title.trim(),
        noiDungCH: formData.content.trim(),
        maMon: parseInt(formData.maMon),
        tags: formData.tags
      }

      await cauHoiService.create(questionData)
      showNotification('Câu hỏi đã được đăng thành công', 'success')
      navigate('/qa')
    } catch (error) {
      console.error('Error creating question:', error)
      showNotification(error.message || 'Không thể đăng câu hỏi', 'error')
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

                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-section">
                    <label>Ngành *</label>
                    <select
                      required
                      value={formData.maNganh}
                      onChange={(e) => setFormData({ ...formData, maNganh: e.target.value, maMon: '' })}
                    >
                      <option value="">Chọn ngành</option>
                      {filterOptions.majors.map(nganh => (
                        <option key={nganh.maNganh} value={nganh.maNganh}>{nganh.tenNganh}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-section">
                    <label>Môn học *</label>
                    <select
                      required
                      value={formData.maMon}
                      onChange={(e) => setFormData({ ...formData, maMon: e.target.value })}
                      disabled={!formData.maNganh}
                    >
                      <option value="">Chọn môn học</option>
                      {filteredSubjects.map(mon => (
                        <option key={mon.maMon} value={mon.maMon}>{mon.tenMon}</option>
                      ))}
                    </select>
                    {!formData.maNganh && <small style={{ color: 'var(--text-muted)' }}>Vui lòng chọn ngành trước</small>}
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
