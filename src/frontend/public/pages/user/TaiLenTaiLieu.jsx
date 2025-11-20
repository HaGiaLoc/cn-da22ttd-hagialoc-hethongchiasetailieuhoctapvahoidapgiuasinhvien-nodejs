import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { getFileIcon, formatFileSize } from '../../utils/helpers'
import { taiLieuService } from '../../services'

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
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({
    tieuDeTL: '',
    moTa: '',
    maLoai: '',
    maMon: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    subjects: [],
    majors: []
  })

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      const [loaiRes, monRes, nganhRes] = await Promise.all([
        taiLieuService.getLoaiTaiLieu(),
        taiLieuService.getMon(),
        taiLieuService.getNganh()
      ])

      console.log('Filter options loaded:', { loaiRes, monRes, nganhRes })

      setFilterOptions({
        types: loaiRes?.data || loaiRes || [],
        subjects: monRes?.data || monRes || [],
        majors: nganhRes?.data || nganhRes || []
      })
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      showNotification('Vui lòng chọn file để upload', 'error')
      return
    }

    if (!formData.tieuDeTL.trim() || !formData.maLoai || !formData.maMon) {
      showNotification('Vui lòng điền đầy đủ thông tin', 'warning')
      return
    }
    
    try {
      setIsUploading(true)
      showNotification('Đang upload tài liệu...', 'info')

      const uploadData = new FormData()
      uploadData.append('file', selectedFile)
      uploadData.append('tieuDeTL', formData.tieuDeTL.trim())
      uploadData.append('moTa', formData.moTa.trim())
      uploadData.append('maLoai', parseInt(formData.maLoai))
      uploadData.append('maMon', parseInt(formData.maMon))

      await taiLieuService.upload(uploadData)
      
      showNotification('Upload tài liệu thành công!', 'success')
      setTimeout(() => {
        navigate('/documents')
      }, 1000)
    } catch (error) {
      console.error('Error uploading document:', error)
      showNotification(error.message || 'Không thể upload tài liệu', 'error')
    } finally {
      setIsUploading(false)
    }
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

              {selectedFile && (
                <div className="file-list">
                  <h3>File đã chọn:</h3>
                  <div className="file-item">
                    <i className={`fas ${getFileIcon(selectedFile.name)}`}></i>
                    <div className="file-info">
                      <h4>{selectedFile.name}</h4>
                      <p>{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button 
                      type="button" 
                      className="btn-remove"
                      onClick={() => setSelectedFile(null)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="form-section">
                <h3>Thông tin tài liệu</h3>
                
                <div className="form-group">
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    required
                    value={formData.tieuDeTL}
                    onChange={(e) => setFormData({ ...formData, tieuDeTL: e.target.value })}
                    placeholder="Nhập tiêu đề tài liệu"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    rows="4"
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                    placeholder="Mô tả chi tiết về tài liệu"
                  ></textarea>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label>Loại tài liệu *</label>
                    <select
                      required
                      value={formData.maLoai}
                      onChange={(e) => setFormData({ ...formData, maLoai: e.target.value })}
                    >
                      <option value="">Chọn loại</option>
                      {filterOptions.types.map(type => (
                        <option key={type.maLoai} value={type.maLoai}>{type.loaiTaiLieu}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Môn học *</label>
                    <select
                      required
                      value={formData.maMon}
                      onChange={(e) => setFormData({ ...formData, maMon: e.target.value })}
                    >
                      <option value="">Chọn môn học</option>
                      {filterOptions.subjects.map(mon => (
                        <option key={mon.maMon} value={mon.maMon}>{mon.tenMon}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => navigate('/documents')} disabled={isUploading}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                  <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i> 
                  {isUploading ? 'Đang upload...' : 'Upload tài liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
