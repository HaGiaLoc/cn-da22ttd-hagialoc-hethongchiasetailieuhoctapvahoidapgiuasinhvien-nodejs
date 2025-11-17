import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import TheCauHoi from '../../components/user/TheCauHoi'
import PhanTrang from '../../components/user/PhanTrang'
import { mockQuestions, mockQuestionCategories } from '../../data/mockData'
import { searchMatch } from '../../utils/helpers'

export default function HoiDap() {
  const [questions, setQuestions] = useState(mockQuestions)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    subject: '',
    major: '',
    sort: 'newest'
  })
  const [selectedTag, setSelectedTag] = useState('')
  const [currentTab, setCurrentTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const applyFilters = () => {
    let filtered = [...mockQuestions]

    if (filters.search) {
      filtered = filtered.filter(q =>
        searchMatch(q.title, filters.search)
      )
    }

    if (filters.status === 'solved') {
      filtered = filtered.filter(q => q.status === 'solved')
    } else if (filters.status === 'open') {
      filtered = filtered.filter(q => q.status === 'open')
    }

    if (filters.subject) {
      filtered = filtered.filter(q => q.subject === filters.subject)
    }

    if (filters.major) {
      filtered = filtered.filter(q => q.major === filters.major)
    }

    if (selectedTag) {
      filtered = filtered.filter(q => q.tags.includes(selectedTag))
    }

    if (filters.sort === 'newest') {
      filtered.sort((a, b) => b.date - a.date)
    } else if (filters.sort === 'votes') {
      filtered.sort((a, b) => b.votes - a.votes)
    }

    setQuestions(filtered)
    setCurrentPage(1)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, selectedTag])

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag)
  }

  // Lấy tất cả tags duy nhất từ các câu hỏi
  const getAllTags = () => {
    const tagsSet = new Set()
    mockQuestions.forEach(question => {
      question.tags.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  }

  const allTags = getAllTags()

  const totalPages = Math.ceil(questions.length / itemsPerPage)
  const currentQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <BoTri>
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-comments"></i> Hỏi đáp</h1>
          <p>Đặt câu hỏi và nhận câu trả lời từ cộng đồng sinh viên</p>
        </div>
      </section>

      <section className="qa-section">
        <div className="container">
          <div className="qa-container">
            <div className="qa-sidebar">
              <div className="sidebar-card">
                <h3>Bộ lọc</h3>
                
                <div className="filter-group">
                  <label>Trạng thái</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="all"
                        checked={filters.status === 'all'}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      />
                      Tất cả
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="open"
                        checked={filters.status === 'open'}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      />
                      Chưa giải quyết
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="solved"
                        checked={filters.status === 'solved'}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      />
                      Đã giải quyết
                    </label>
                  </div>
                </div>

                <div className="filter-group">
                  <label>Môn học</label>
                  <select
                    value={filters.subject}
                    onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                  >
                    <option value="">Tất cả</option>
                    {mockQuestionCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Ngành</label>
                  <select
                    value={filters.major}
                    onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                  >
                    <option value="">Tất cả</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sắp xếp</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="votes">Nhiều vote nhất</option>
                    <option value="answers">Nhiều câu trả lời</option>
                  </select>
                </div>

                <button className="btn btn-primary btn-full" onClick={applyFilters}>
                  Áp dụng
                </button>
              </div>

              <div className="sidebar-card">
                <h3>Tags phổ biến</h3>
                <div className="tag-cloud">
                  {allTags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`tag ${selectedTag === tag ? 'tag-active' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="qa-main">
              <div className="qa-search">
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <button className="btn btn-primary" onClick={applyFilters}>
                  <i className="fas fa-search"></i>
                </button>
              </div>

              <div className="qa-header">
                <h2>{questions.length} câu hỏi</h2>
                <Link to="/ask" className="btn btn-primary">
                  Đặt câu hỏi
                </Link>
              </div>

              <div className="questions-list">
                {currentQuestions.map(question => (
                  <TheCauHoi key={question.id} question={question} />
                ))}
              </div>

              {totalPages > 1 && (
                <PhanTrang
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
