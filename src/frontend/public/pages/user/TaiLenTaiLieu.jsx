import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { getFileIcon, formatFileSize } from '../../utils/helpers'
import { mockDocumentCategories, mockQuestionCategories } from '../../data/mockData'

export default function TaiLenTaiLieu() {
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
  const [selectedFiles, setSelectedFiles] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    subject: '',
    major: ''
  })

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedFiles.length === 0) {
      showNotification('Vui lòng chọn file để upload', 'error')
      return
    }
    
    // Hiển thị modal đang upload với icon loading
    showNotification('Đang upload tài liệu...', 'loading', 0)
    
    // Sau 1.5s, cập nhật thành upload thành công
    setTimeout(() => {
      showNotification('Upload thành công!', 'success', 1000)
      // Điều hướng sau khi modal đóng (2s)
      setTimeout(() => {
        navigate('/documents')
      }, 2000)
    }, 1500)
  }

  return (
    <BoTri>
      <section className="page-title">
        <div className="container">
          <h1><i className="fas fa-cloud-upload-alt"></i> Upload Tài liệu</h1>
          <p>Chia sẻ tài liệu của bạn với cộng đồng sinh viên</p>
        </div>
      </section>

      <section className="upload-section">
        <div className="container">
          <div className="upload-container">
            <form onSubmit={handleSubmit} className="upload-form">
              <div
                className="upload-area"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <h3>Kéo thả file vào đây hoặc click để chọn</h3>
                <p>Hỗ trợ: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (Tối đa 50MB)</p>
                <input
                  type="file"
                  id="fileInput"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="file-list">
                  <h3>File đã chọn:</h3>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <i className={`fas ${getFileIcon(file.name)}`}></i>
                      <div className="file-info">
                        <h4>{file.name}</h4>
                        <p>{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-section">
                <h3>Thông tin tài liệu</h3>
                
                <div className="form-group">
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tiêu đề tài liệu"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về tài liệu"
                  ></textarea>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="form-group">
                    <label>Loại tài liệu *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="">Chọn loại</option>
                      {mockDocumentCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
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

                  <div className="form-group">
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
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => navigate('/documents')}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-upload"></i> Upload tài liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
