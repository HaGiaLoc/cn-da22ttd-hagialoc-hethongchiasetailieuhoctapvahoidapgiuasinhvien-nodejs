import { useState, useEffect } from 'react'
import { adminService } from '../../services'

export default function EditQuestionModal({ question, onClose, onSave }) {
  const [formData, setFormData] = useState({
    tieuDeCH: '',
    noiDungCH: '',
    trangThaiCH: 'show',
    maNganh: '',
    maMon: ''
  })
  const [majors, setMajors] = useState([])
  const [subjects, setSubjects] = useState([])
  const [allSubjects, setAllSubjects] = useState([])

  useEffect(() => {
    loadOptions()
  }, [])

  useEffect(() => {
    if (question) {
      setFormData({
        tieuDeCH: question.tieuDeCauHoi || question.tieuDeCH || '',
        noiDungCH: question.noiDungCauHoi || question.noiDungCH || '',
        trangThaiCH: question.trangThaiCauHoi || question.trangThaiCH || 'show',
        maNganh: question.maNganh || '',
        maMon: question.maMon || ''
      })
    }
  }, [question])

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
      const [majorsRes, subjectsRes] = await Promise.all([
        adminService.getAllMajors(),
        adminService.getAllSubjects()
      ])
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

  if (!question) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh sửa câu hỏi</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Mã câu hỏi</label>
              <input
                type="text"
                value={question.maCauHoi}
                disabled
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Đánh giá</label>
              <input
                type="text"
                value={(question.votes > 0 ? '+' : '') + (question.votes || 0)}
                disabled
                className="form-control"
                style={{ 
                  color: question.votes > 0 ? '#4caf50' : question.votes < 0 ? '#f44336' : '#666',
                  fontWeight: 'bold'
                }}
              />
            </div>
            <div className="form-group">
              <label>Tiêu đề</label>
              <input
                type="text"
                className="form-control"
                value={formData.tieuDeCH}
                onChange={(e) => setFormData({ ...formData, tieuDeCH: e.target.value })}
                required
              />
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
                required
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map(subject => (
                  <option key={subject.maMon} value={subject.maMon}>{subject.tenMon}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Nội dung</label>
              <textarea
                className="form-control"
                rows="6"
                value={formData.noiDungCH}
                onChange={(e) => setFormData({ ...formData, noiDungCH: e.target.value })}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                className="form-control"
                value={formData.trangThaiCH}
                onChange={(e) => setFormData({ ...formData, trangThaiCH: e.target.value })}
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
