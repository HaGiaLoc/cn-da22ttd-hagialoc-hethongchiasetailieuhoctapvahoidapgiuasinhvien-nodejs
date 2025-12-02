import { useState, useEffect } from 'react'

export default function EditQuestionModal({ question, onClose, onSave }) {
  const [formData, setFormData] = useState({
    tieuDeCH: '',
    noiDungCH: ''
  })

  useEffect(() => {
    if (question) {
      setFormData({
        tieuDeCH: question.tieuDeCH || '',
        noiDungCH: question.noiDungCH || ''
      })
    }
  }, [question])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!question) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh sửa câu hỏi</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tiêu đề câu hỏi</label>
              <input
                type="text"
                className="form-control"
                value={formData.tieuDeCH}
                onChange={(e) => setFormData({ ...formData, tieuDeCH: e.target.value })}
                required
                placeholder="Nhập tiêu đề câu hỏi..."
              />
            </div>
            <div className="form-group">
              <label>Nội dung chi tiết</label>
              <textarea
                className="form-control"
                rows="8"
                value={formData.noiDungCH}
                onChange={(e) => setFormData({ ...formData, noiDungCH: e.target.value })}
                placeholder="Mô tả chi tiết câu hỏi của bạn..."
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
