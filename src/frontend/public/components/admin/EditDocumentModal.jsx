import { useState, useEffect } from 'react'
import { adminService } from '../../services'

export default function EditDocumentModal({ document, onClose, onSave }) {
  const [formData, setFormData] = useState({
    tieuDeTL: '',
    trangThaiTL: 'show',
    maLoai: '',
    maDinhDang: '',
    maNganh: '',
    maMon: ''
  })
  const [documentTypes, setDocumentTypes] = useState([])
  const [formats, setFormats] = useState([])
  const [majors, setMajors] = useState([])
  const [subjects, setSubjects] = useState([])
  const [allSubjects, setAllSubjects] = useState([])

  useEffect(() => {
    loadOptions()
  }, [])

  useEffect(() => {
    if (document) {
      setFormData({
        tieuDeTL: document.tieuDeTL || '',
        trangThaiTL: document.trangThaiTL || 'show',
        maLoai: document.maLoai || '',
        maDinhDang: document.maDinhDang || '',
        maNganh: document.maNganh || '',
        maMon: document.maMon || ''
      })
    }
  }, [document])

  useEffect(() => {
    if (formData.maNganh) {
      const filtered = allSubjects.filter(s => s.maNganh == formData.maNganh)
      setSubjects(filtered)
    } else {
      setSubjects(allSubjects)
    }
  }, [formData.maNganh, allSubjects])

  const loadOptions = async () => {
    try {
      const [typesRes, formatsRes, majorsRes, subjectsRes] = await Promise.all([
        adminService.getAllDocumentTypes(),
        adminService.getAllFormats(),
        adminService.getAllMajors(),
        adminService.getAllSubjects()
      ])
      setDocumentTypes(typesRes.data || [])
      setFormats(formatsRes.data || [])
      setMajors(majorsRes.data || [])
      setAllSubjects(subjectsRes.data || [])
      setSubjects(subjectsRes.data || [])
    } catch (error) {
      console.error('Error loading options:', error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!document) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh sửa tài liệu</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Mã tài liệu</label>
              <input
                type="text"
                value={document.maTaiLieu}
                disabled
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Tiêu đề</label>
              <input
                type="text"
                className="form-control"
                value={formData.tieuDeTL}
                onChange={(e) => setFormData({ ...formData, tieuDeTL: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Loại tài liệu</label>
              <select
                className="form-control"
                value={formData.maLoai}
                onChange={(e) => setFormData({ ...formData, maLoai: e.target.value })}
                required
              >
                <option value="">-- Chọn loại --</option>
                {documentTypes.map(type => (
                  <option key={type.maLoai} value={type.maLoai}>{type.tenLoai}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Định dạng</label>
              <select
                className="form-control"
                value={formData.maDinhDang}
                onChange={(e) => setFormData({ ...formData, maDinhDang: e.target.value })}
                required
              >
                <option value="">-- Chọn định dạng --</option>
                {formats.map(format => (
                  <option key={format.maDinhDang} value={format.maDinhDang}>{format.tenDinhDang}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ngành</label>
              <select
                className="form-control"
                value={formData.maNganh}
                onChange={(e) => setFormData({ ...formData, maNganh: e.target.value, maMon: '' })}
              >
                <option value="">-- Chọn ngành --</option>
                {majors.map(major => (
                  <option key={major.maNganh} value={major.maNganh}>{major.tenNganh}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Môn học</label>
              <select
                className="form-control"
                value={formData.maMon}
                onChange={(e) => setFormData({ ...formData, maMon: e.target.value })}
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map(subject => (
                  <option key={subject.maMon} value={subject.maMon}>{subject.tenMon}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                className="form-control"
                value={formData.trangThaiTL}
                onChange={(e) => setFormData({ ...formData, trangThaiTL: e.target.value })}
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
