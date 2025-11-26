import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatDate, formatNumber, generateAvatar } from '../../utils/helpers'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { taiLieuService } from '../../services'

export default function TheTaiLieu({ document, onSaveChange }) {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [isSaved, setIsSaved] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Prefer backend avatarPath when it's a usable URL/path; otherwise generate an avatar
  const hasAvatarPath = document.avatarPath && (String(document.avatarPath).startsWith('http') || String(document.avatarPath).startsWith('/'))
  const authorAvatar = hasAvatarPath ? document.avatarPath : generateAvatar(document.hoTenSV)

  useEffect(() => {
    // Prefer saved flag from backend if provided; otherwise leave false until user acts
    if (document.isSaved || document.saved || document.savedByCurrentUser) {
      setIsSaved(true)
      return
    }
    // If user is present and no saved flag, we could check server-side saved list.
    // To keep UI responsive, we only call server to confirm when user is present.
    let mounted = true
    const checkSaved = async () => {
      if (!user) return
      try {
        const res = await taiLieuService.getSavedDocuments(1, 1000)
        const savedList = res?.documents || res?.data?.documents || res?.data || res || []
        if (!mounted) return
        const found = savedList.some(d => (d.maTaiLieu || d.id) === (document.maTaiLieu || document.id))
        setIsSaved(found)
      } catch (err) {
        // ignore errors; default to false
      }
    }
    checkSaved()
    return () => { mounted = false }
  }, [user, document])

  const handleSave = (e) => {
    e.stopPropagation()
    
    if (!user) {
      showNotification('Vui lòng đăng nhập để lưu tài liệu', 'error', 2000)
      return
    }
    ;(async () => {
      try {
        if (isSaved) {
          await taiLieuService.unsave(document.maTaiLieu || document.id)
          setIsSaved(false)
          showNotification('Đã bỏ lưu tài liệu', 'success', 1000)
          if (typeof onSaveChange === 'function') onSaveChange(document.maTaiLieu || document.id, false)
        } else {
          await taiLieuService.save(document.maTaiLieu || document.id)
          setIsSaved(true)
          showNotification('Đã lưu tài liệu', 'success', 1000)
          if (typeof onSaveChange === 'function') onSaveChange(document.maTaiLieu || document.id, true)
        }
      } catch (err) {
        console.error('Error saving/unsaving document:', err)
        showNotification(err?.message || 'Không thể lưu tài liệu', 'error')
      }
    })()
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
    // Tải xuống qua endpoint backend (yêu cầu xác thực)
    if (document.maTaiLieu) {
      const downloadUrl = `/api/tailieu/${document.maTaiLieu}/download`;
      window.open(downloadUrl, '_blank')
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
          <span className="document-type">{document.loaiTaiLieu || document.tenLoai || document.tenDinhDang || 'Tài liệu'}</span>
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
              alt={document.hoTenSV || 'Tác giả'}
              className="author-avatar-small"
            />
            <span>{document.hoTenSV || document.tenSV || document.author || 'Tác giả'}</span>
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
