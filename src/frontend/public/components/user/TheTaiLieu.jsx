import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatDate, formatNumber, generateAvatar } from '../../utils/helpers'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

export default function TheTaiLieu({ document }) {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [isSaved, setIsSaved] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const authorAvatar = generateAvatar(document.hoTenSV)

  useEffect(() => {
    // Kiểm tra xem tài liệu đã được lưu chưa
    if (user) {
      const savedDocs = JSON.parse(localStorage.getItem(`savedDocs_${user.id}`) || '[]')
      setIsSaved(savedDocs.includes(document.maTaiLieu))
    }
  }, [user, document.maTaiLieu])

  const handleSave = (e) => {
    e.stopPropagation()
    
    if (!user) {
      showNotification('Vui lòng đăng nhập để lưu tài liệu', 'error', 2000)
      return
    }

    const savedDocs = JSON.parse(localStorage.getItem(`savedDocs_${user.id}`) || '[]')
    
    if (isSaved) {
      // Bỏ lưu
      const newSavedDocs = savedDocs.filter(id => id !== document.maTaiLieu)
      localStorage.setItem(`savedDocs_${user.id}`, JSON.stringify(newSavedDocs))
      setIsSaved(false)
      showNotification('Đã bỏ lưu tài liệu', 'success', 1000)
    } else {
      // Lưu tài liệu
      savedDocs.push(document.maTaiLieu)
      localStorage.setItem(`savedDocs_${user.id}`, JSON.stringify(savedDocs))
      setIsSaved(true)
      showNotification('Đã lưu tài liệu', 'success', 1000)
    }
  }

  const handleReport = (e) => {
    e.stopPropagation()
    if (!user) {
      showNotification('Vui lòng đăng nhập để báo cáo', 'error', 2000)
      return
    }
    setShowReportModal(true)
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    if (!user) {
      showNotification('Vui lòng đăng nhập để tải xuống', 'error', 2000)
      return
    }
    // Tải xuống trực tiếp tài liệu
    if (document.URL) {
      window.open(document.URL, '_blank')
      showNotification('Đang tải xuống...', 'success', 1000)
    }
  }

  return (
    <div className="document-card">
      <div className="document-thumbnail">
        <i className="fas fa-file-pdf"></i>
        <button 
          className="report-btn"
          onClick={handleReport}
          title="Báo cáo tài liệu"
        >
          <i className="fas fa-flag"></i>
        </button>
      </div>
      <div className="document-info">
        <div className="document-header-actions">
          <span className="document-type">{document.loaiTaiLieu}</span>
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            title={isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'}
          >
            <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i>
          </button>
        </div>
        <h3 className="document-title">{document.tieuDeTL}</h3>
        <div className="document-author">
          <div className="author-info">
            <img 
              src={authorAvatar} 
              alt={document.hoTenSV}
              className="author-avatar-small"
            />
            <span>{document.hoTenSV}</span>
          </div>
          <span className="document-date">{formatDate(document.ngayChiaSe)}</span>
        </div>
        <div className="document-meta">
          <div className="meta-stats">
            <span>
              <i className="fas fa-bookmark"></i> {formatNumber(document.soLanLuu || 0)}
            </span>
            <span>
              <i className="fas fa-download"></i> {formatNumber(document.luotTaiXuong || 0)}
            </span>
          </div>
          <button 
            className="btn btn-sm btn-primary download-btn"
            onClick={handleDownload}
            title="Tải xuống"
          >
            <i className="fas fa-download"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
