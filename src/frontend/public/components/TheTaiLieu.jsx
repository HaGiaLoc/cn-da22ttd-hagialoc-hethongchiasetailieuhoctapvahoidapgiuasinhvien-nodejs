import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatDate, formatNumber } from '../utils/helpers'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { mockStudents, generateAvatar } from '../data/mockData'

export default function TheTaiLieu({ document }) {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [isSaved, setIsSaved] = useState(false)

  // Lấy thông tin sinh viên tác giả
  const author = mockStudents.find(s => s.id === document.maSinhVien)
  const authorAvatar = author?.avatar || generateAvatar(document.author)

  useEffect(() => {
    // Kiểm tra xem tài liệu đã được lưu chưa
    if (user) {
      const savedDocs = JSON.parse(localStorage.getItem(`savedDocs_${user.id}`) || '[]')
      setIsSaved(savedDocs.includes(document.id))
    }
  }, [user, document.id])

  const handleSave = (e) => {
    e.stopPropagation()
    
    if (!user) {
      showNotification('Vui lòng đăng nhập để lưu tài liệu', 'error', 2000)
      return
    }

    const savedDocs = JSON.parse(localStorage.getItem(`savedDocs_${user.id}`) || '[]')
    
    if (isSaved) {
      // Bỏ lưu
      const newSavedDocs = savedDocs.filter(id => id !== document.id)
      localStorage.setItem(`savedDocs_${user.id}`, JSON.stringify(newSavedDocs))
      setIsSaved(false)
      showNotification('Đã bỏ lưu tài liệu', 'success', 1500)
    } else {
      // Lưu tài liệu
      savedDocs.push(document.id)
      localStorage.setItem(`savedDocs_${user.id}`, JSON.stringify(savedDocs))
      setIsSaved(true)
      showNotification('Đã lưu tài liệu', 'success', 1500)
    }
  }

  return (
    <div className="document-card" onClick={() => window.location.href = `/documents/${document.id}`}>
      <div className="document-thumbnail">
        <i className="fas fa-file-pdf"></i>
      </div>
      <div className="document-info">
        <div className="document-header-actions">
          <span className="document-type">{document.type}</span>
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            title={isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'}
          >
            <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i>
          </button>
        </div>
        <h3 className="document-title">{document.tieuDeTaiLieu}</h3>
        <div className="document-author">
          <img 
            src={authorAvatar} 
            alt={document.author}
            className="author-avatar-small"
          />
          <span>{document.author}</span>
        </div>
        <div className="document-meta">
          <span>
            <i className="fas fa-eye"></i> {formatNumber(document.views)}
          </span>
          <span>
            <i className="fas fa-download"></i> {formatNumber(document.downloads)}
          </span>
          <span>
            <i className="fas fa-star"></i> {document.rating}
          </span>
        </div>
      </div>
    </div>
  )
}
