import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { mockReports } from '../../data/mockData'

export default function BaoCaoModal({ isOpen, onClose, reportType, reportedId, reportedTitle }) {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [reason, setReason] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  const predefinedReasons = {
    document: [
      'Nội dung vi phạm bản quyền',
      'Tài liệu sai thông tin',
      'Nội dung không phù hợp',
      'Spam hoặc quảng cáo',
      'Lý do khác'
    ],
    question: [
      'Câu hỏi trùng lặp',
      'Nội dung không phù hợp',
      'Spam',
      'Câu hỏi không rõ ràng',
      'Lý do khác'
    ],
    answer: [
      'Thông tin sai lệch',
      'Nội dung không phù hợp',
      'Spam hoặc quảng cáo',
      'Vi phạm quy định',
      'Lý do khác'
    ],
    comment: [
      'Ngôn từ không phù hợp',
      'Spam',
      'Quấy rối người khác',
      'Nội dung độc hại',
      'Lý do khác'
    ]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!user) {
      showNotification('Vui lòng đăng nhập để báo cáo', 'error', 2000)
      return
    }

    const finalReason = selectedReason === 'Lý do khác' ? reason : selectedReason

    if (!finalReason.trim()) {
      showNotification('Vui lòng chọn hoặc nhập lý do báo cáo', 'error', 2000)
      return
    }

    // Tạo báo cáo mới (mock)
    const newReport = {
      id: mockReports.length + 1,
      maSinhVien: user.id,
      reportType,
      reportedId,
      lyDo: finalReason,
      ngayBaoCao: new Date(),
      trangThaiBaoCao: 'pending'
    }

    // Lưu vào mockReports (trong thực tế sẽ gọi API)
    mockReports.push(newReport)

    showNotification('Đã gửi báo cáo. Chúng tôi sẽ xem xét sớm nhất.', 'success', 1000)
    setReason('')
    setSelectedReason('')
    onClose()
  }

  if (!isOpen) return null

  const reasons = predefinedReasons[reportType] || []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Báo cáo vi phạm</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="report-info">
            <p className="report-item-title">
              <strong>Nội dung báo cáo:</strong> {reportedTitle}
            </p>
            <p className="report-type-label">
              Loại: <span className="badge">{
                reportType === 'document' ? 'Tài liệu' :
                reportType === 'question' ? 'Câu hỏi' :
                reportType === 'answer' ? 'Câu trả lời' : 'Bình luận'
              }</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Lý do báo cáo *</label>
              <div className="reason-options">
                {reasons.map((r, index) => (
                  <label key={index} className="radio-label">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={selectedReason === r}
                      onChange={(e) => setSelectedReason(e.target.value)}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {selectedReason === 'Lý do khác' && (
              <div className="form-group">
                <label>Chi tiết lý do *</label>
                <textarea
                  rows="4"
                  placeholder="Vui lòng mô tả chi tiết lý do báo cáo..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                ></textarea>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-flag"></i> Gửi báo cáo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
