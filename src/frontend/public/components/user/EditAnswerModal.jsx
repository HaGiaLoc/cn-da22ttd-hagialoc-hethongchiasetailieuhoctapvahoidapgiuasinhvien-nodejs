import { useState, useEffect } from 'react'

export default function EditAnswerModal({ answer, onClose, onSave }) {
  const [noiDungCTL, setNoiDungCTL] = useState('')

  useEffect(() => {
    if (answer) {
      setNoiDungCTL(answer.noiDungCTL || '')
    }
  }, [answer])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (noiDungCTL.trim()) {
      onSave({ noiDungCTL: noiDungCTL.trim() })
    }
  }

  if (!answer) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh sửa câu trả lời</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Nội dung câu trả lời *</label>
              <textarea
                className="form-control"
                rows="8"
                value={noiDungCTL}
                onChange={(e) => setNoiDungCTL(e.target.value)}
                placeholder="Nhập nội dung câu trả lời..."
                required
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={!noiDungCTL.trim()}>
              <i className="fas fa-save"></i> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
