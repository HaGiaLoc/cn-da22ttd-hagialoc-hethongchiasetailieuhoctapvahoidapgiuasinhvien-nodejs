import { useState, useEffect } from 'react'

export default function EditAnswerModal({ answer, onClose, onSave }) {
  const [formData, setFormData] = useState({
    noiDungCTL: '',
    trangThaiCTL: 'show'
  })

  useEffect(() => {
    if (answer) {
      setFormData({
        noiDungCTL: answer.noiDungTraLoi || answer.noiDungCTL || '',
        trangThaiCTL: answer.trangThaiCTL || 'show'
      })
    }
  }, [answer])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
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
              <label>Mã câu trả lời</label>
              <input
                type="text"
                value={answer.maTraLoi}
                disabled
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Đánh giá</label>
              <input
                type="text"
                value={(answer.danhGia > 0 ? '+' : '') + (answer.danhGia || 0)}
                disabled
                className="form-control"
                style={{ 
                  color: answer.danhGia > 0 ? '#4caf50' : answer.danhGia < 0 ? '#f44336' : '#666',
                  fontWeight: 'bold'
                }}
              />
            </div>
            <div className="form-group">
              <label>Nội dung</label>
              <textarea
                className="form-control"
                rows="8"
                value={formData.noiDungCTL}
                onChange={(e) => setFormData({ ...formData, noiDungCTL: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                className="form-control"
                value={formData.trangThaiCTL}
                onChange={(e) => setFormData({ ...formData, trangThaiCTL: e.target.value })}
              >
                <option value="show">Hiện</option>
                <option value="hidden">Ẩn</option>
              </select>
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
