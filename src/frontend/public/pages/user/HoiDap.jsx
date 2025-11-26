import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import TheCauHoi from '../../components/user/TheCauHoi'
import PhanTrang from '../../components/user/PhanTrang'
import { cauHoiService } from '../../services'
import { searchMatch } from '../../utils/helpers'

export default function HoiDap() {
  const [allQuestions, setAllQuestions] = useState([])
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    subject: '',
    major: '',
    sort: 'newest'
  })
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    majors: []
  })
  const [selectedTag, setSelectedTag] = useState('')
  const [currentTab, setCurrentTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadQuestions()
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      const [monRes, nganhRes] = await Promise.all([
        cauHoiService.getMon(),
        cauHoiService.getNganh()
      ])

      console.log('Filter options loaded:', { monRes, nganhRes })

      setFilterOptions({
        subjects: monRes?.data || monRes || [],
        majors: nganhRes?.data || nganhRes || []
      })
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const loadQuestions = async (opts = {}) => {
    try {
      setIsLoading(true)
      // opts can contain page/limit or overrides
      const svcFilters = { ...opts }
      const res = await cauHoiService.getAll(svcFilters)
      console.log('Questions loaded (server):', res)
      const qs = res.data?.questions || res.questions || res.data || res || []
      setAllQuestions(qs)
      setQuestions(qs)
      return qs
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = async (page = 1) => {
    // Build server filters using IDs for Mon (maMon) and Nganh (maNganh)
    const svcFilters = {}
    if (filters.search) svcFilters.search = filters.search
    if (filters.status && filters.status !== 'all') svcFilters.trangThaiCH = filters.status
    if (filters.major) svcFilters.Nganh = filters.major
    if (filters.subject) svcFilters.Mon = filters.subject
    if (selectedTag) svcFilters.tag = selectedTag
    svcFilters.page = page
    svcFilters.limit = itemsPerPage * 10 // fetch more to allow client-side paging, adjust as needed

    const fetched = await loadQuestions(svcFilters)

    // Apply client-side sorting after server fetch
    let sorted = [...(fetched || [])]
    if (filters.sort === 'newest') sorted.sort((a, b) => new Date(b.ngayDatCH) - new Date(a.ngayDatCH))
    else if (filters.sort === 'votes') sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0))
    else if (filters.sort === 'answers') sorted.sort((a, b) => (b.soLuongTraLoi || 0) - (a.soLuongTraLoi || 0))

    setQuestions(sorted)
    setCurrentPage(1)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, selectedTag])

  const handleMajorChange = (value) => {
    setFilters(prev => ({ ...prev, major: value, subject: '' }))
  }

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag)
  }

  const getAllTags = () => {
    const tagsSet = new Set()
    allQuestions.forEach(question => {
      if (question.tags) {
        // tags là chuỗi từ backend (comma-separated)
        const tagArray = typeof question.tags === 'string' 
          ? question.tags.split(',').filter(t => t.trim())
          : (Array.isArray(question.tags) ? question.tags : [])
        tagArray.forEach(tag => tagsSet.add(tag.trim()))
      }
    })
    return Array.from(tagsSet).sort()
  }

  const allTags = getAllTags()

  // Lọc môn học theo ngành được chọn
  const filteredSubjects = filters.major
    ? filterOptions.subjects.filter(mon => mon.maNganh === filters.major)
    : filterOptions.subjects

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
                        value="show"
                        checked={filters.status === 'show'}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      />
                      Chưa giải quyết
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="answered"
                        checked={filters.status === 'answered'}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      />
                      Đã giải quyết
                    </label>
                  </div>
                </div>

                <div className="filter-group">
                  <label>Ngành</label>
                  <select
                    value={filters.major}
                    onChange={(e) => handleMajorChange(e.target.value)}
                  >
                    <option value="" key="all-majors">Tất cả ngành</option>
                    {filterOptions.majors.map(nganh => (
                      <option key={nganh.maNganh} value={nganh.maNganh}>{nganh.tenNganh}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Môn học</label>
                  <select
                    value={filters.subject}
                    onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                    disabled={!filters.major && filterOptions.subjects.length > 0}
                  >
                    <option value="" key="all-subjects">
                      {filters.major ? 'Tất cả môn học' : 'Chọn ngành trước'}
                    </option>
                    {filteredSubjects.map(mon => (
                      <option key={mon.maMon} value={mon.maMon}>{mon.tenMon}</option>
                    ))}
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
                  <TheCauHoi key={question.maCauHoi} question={question} />
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
