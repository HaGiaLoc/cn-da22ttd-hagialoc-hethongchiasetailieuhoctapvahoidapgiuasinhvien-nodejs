import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'

export default function KhuVucAnh() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    documents: 0,
    questions: 0,
    students: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await api.get('/stats')
      const data = response.data || response
      setStats({
        documents: data.documents || 0,
        questions: data.questions || 0,
        students: data.students || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/documents?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+'
    }
    return num.toString()
  }

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Knowledge Exchange Forum</h1>
          <h1>Nền tảng Chia sẻ Tài liệu & Hỏi đáp giữa Sinh viên</h1>
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
                <h3>{formatNumber(stats.documents)}</h3>
                <p>Tài liệu</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-question-circle"></i>
              <div>
                <h3>{formatNumber(stats.questions)}</h3>
                <p>Câu hỏi</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-users"></i>
              <div>
                <h3>{formatNumber(stats.students)}</h3>
                <p>Sinh viên</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
