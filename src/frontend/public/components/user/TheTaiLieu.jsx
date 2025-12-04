import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatDate, formatNumber, generateAvatar } from '../../utils/helpers'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { taiLieuService } from '../../api'
import BaoCaoModal from './BaoCaoModal'

export default function TheTaiLieu({ document: taiLieu, onSaveChange }) {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [isSaved, setIsSaved] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Prefer backend avatarPath when it's a usable URL/path; otherwise generate an avatar
  const hasAvatarPath = taiLieu.avatarPath && (String(taiLieu.avatarPath).startsWith('http') || String(taiLieu.avatarPath).startsWith('/'))
  const authorAvatar = hasAvatarPath ? taiLieu.avatarPath : generateAvatar(taiLieu.hoTenSV)

  useEffect(() => {
    // Prefer saved flag from backend if provided; otherwise leave false until user acts
    if (taiLieu.isSaved || taiLieu.saved || taiLieu.savedByCurrentUser) {
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
        const found = savedList.some(d => (d.maTaiLieu || d.id) === (taiLieu.maTaiLieu || taiLieu.id))
        setIsSaved(found)
      } catch (err) {
        // ignore errors; default to false
      }
    }
    checkSaved()
    return () => { mounted = false }
  }, [user, taiLieu])

  const handleSave = (e) => {
    e.stopPropagation()
    
    if (!user) {
      showNotification('Vui lòng đăng nhập để lưu tài liệu', 'error', 2000)
      return
    }
    ;(async () => {
      try {
        if (isSaved) {
          await taiLieuService.unsave(taiLieu.maTaiLieu || taiLieu.id)
          setIsSaved(false)
          showNotification('Đã bỏ lưu tài liệu', 'success', 1000)
          if (typeof onSaveChange === 'function') onSaveChange(taiLieu.maTaiLieu || taiLieu.id, false)
        } else {
          await taiLieuService.save(taiLieu.maTaiLieu || taiLieu.id)
          setIsSaved(true)
          showNotification('Đã lưu tài liệu', 'success', 1000)
          if (typeof onSaveChange === 'function') onSaveChange(taiLieu.maTaiLieu || taiLieu.id, true)
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

  const handleDownload = async (e) => {
    e.stopPropagation()
    if (!user) {
      showNotification('Vui lòng đăng nhập để tải xuống', 'error', 2000)
      return
    }
    
    try {
      showNotification('Đang tải xuống...', 'info', 1000)
      
      const response = await fetch(`/api/tailieu/${taiLieu.maTaiLieu}/download`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Không thể tải xuống tài liệu')
      }
      
      // Get file extension from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let fileExtension = '.pdf' // default extension
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
        if (matches && matches[1]) {
          const serverFileName = matches[1].replace(/['"]/g, '')
          const extMatch = serverFileName.match(/\.[^.]+$/)
          if (extMatch) {
            fileExtension = extMatch[0]
          }
        }
      }
      
      // Use document title as filename
      const fileName = `${taiLieu.tieuDeTL || 'document'}${fileExtension}`
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.download = fileName
      link.style.display = 'none'
      window.document.body.appendChild(link)
      link.click()
      
      // Cleanup after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        window.document.body.removeChild(link)
      }, 100)
      
      showNotification('Tải xuống thành công', 'success', 2000)
    } catch (error) {
      console.error('Download error:', error)
      showNotification('Lỗi khi tải xuống', 'error', 2000)
    }
  }

  return (
    <>
      <div className="document-card">
        <div className="document-thumbnail">
          <i className="fas fa-file-pdf"></i>
          {user?.role === 'student' && (
            <button 
              className="report-btn"
              onClick={handleReport}
              title="Báo cáo tài liệu"
            >
              <i className="fas fa-flag"></i>
            </button>
          )}
        </div>
        <div className="document-info">
          <div className="document-header-actions">
            <span className="document-type">{taiLieu.loaiTaiLieu || taiLieu.tenLoai || taiLieu.tenDinhDang || 'Tài liệu'}</span>
            {user?.role === 'student' && (
              <button 
                className={`save-btn ${isSaved ? 'saved' : ''}`}
                onClick={handleSave}
                title={isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'}
              >
                <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i>
              </button>
            )}
          </div>
          <h3 className="document-title">{taiLieu.tieuDeTL}</h3>
          <div className="document-author">
            <div className="author-info">
              <img
                src={authorAvatar}
                alt={taiLieu.hoTenSV || 'Tác giả'}
                className="author-avatar-small"
              />
              <span>{taiLieu.hoTenSV || taiLieu.tenSV || taiLieu.author || 'Tác giả'}</span>
            </div>
            <span className="document-date">{formatDate(taiLieu.ngayChiaSe)}</span>
          </div>
          <div className="document-meta">
            <div className="meta-stats">
              <span>
                <i className="fas fa-bookmark"></i> {formatNumber(taiLieu.soLanLuu || 0)}
              </span>
              <span>
                <i className="fas fa-download"></i> {formatNumber(taiLieu.luotTaiXuong || 0)}
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

      {showReportModal && createPortal(
        <BaoCaoModal 
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportType="document"
          reportedId={taiLieu.maTaiLieu || taiLieu.id}
          reportedTitle={taiLieu.tieuDeTL}
        />,
        document.body
      )}
    </>
  )
}
