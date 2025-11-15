import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockDocuments, mockQuestions, mockStudents } from '../data/mockData'

export default function KhuVucAnh() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/documents?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Tính toán số liệu thống kê từ mockData
  const stats = {
    documents: mockDocuments.length,
    questions: mockQuestions.length,
    students: mockStudents.length
  }

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Nền tảng Chia sẻ Tài liệu & Hỏi đáp</h1>
          <p className="hero-subtitle">
            Kết nối sinh viên - Chia sẻ kiến thức - Học tập hiệu quả
          </p>
          
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu, câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-search"></i> Tìm kiếm
            </button>
          </form>
          
          <div className="hero-stats">
            <div className="stat-item">
              <i className="fas fa-file-alt"></i>
              <div>
                <h3>{stats.documents}</h3>
                <p>Tài liệu</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-question-circle"></i>
              <div>
                <h3>{stats.questions}</h3>
                <p>Câu hỏi</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-users"></i>
              <div>
                <h3>{stats.students}</h3>
                <p>Sinh viên</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
