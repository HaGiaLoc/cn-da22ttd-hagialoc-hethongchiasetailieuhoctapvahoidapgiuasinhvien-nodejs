import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import BoTri from '../components/BoTri'
import TheTaiLieu from '../components/TheTaiLieu'
import PhanTrang from '../components/PhanTrang'
import { mockDocuments, mockDocumentCategories, mockQuestionCategories } from '../data/mockData'
import { searchMatch } from '../utils/helpers'

export default function DanhSachTaiLieu() {
  const [searchParams] = useSearchParams()
  const [documents, setDocuments] = useState(mockDocuments)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: '',
    subject: '',
    major: '',
    format: '',
    sort: 'newest'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const itemsPerPage = 12

  useEffect(() => {
    applyFilters()
  }, [filters])

  const applyFilters = () => {
    let filtered = [...mockDocuments]

    if (filters.search) {
      filtered = filtered.filter(doc =>
        searchMatch(doc.tieuDeTaiLieu, filters.search)
      )
    }

    if (filters.type) {
      filtered = filtered.filter(doc => doc.type === filters.type)
    }

    if (filters.subject) {
      filtered = filtered.filter(doc => doc.subject === filters.subject)
    }

    if (filters.major) {
      filtered = filtered.filter(doc => doc.major === filters.major)
    }

    if (filters.format) {
      filtered = filtered.filter(doc => doc.format === filters.format)
    }

    // Sorting
    if (filters.sort === 'newest') {
      filtered.sort((a, b) => b.date - a.date)
    } else if (filters.sort === 'popular') {
      filtered.sort((a, b) => b.views - a.views)
    } else if (filters.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    setDocuments(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      subject: '',
      major: '',
      format: '',
      sort: 'newest'
    })
  }

  const totalPages = Math.ceil(documents.length / itemsPerPage)
  const currentDocuments = documents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <BoTri>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-file-alt"></i> Thư viện Tài liệu</h1>
          <p>Khám phá và tải về hàng ngàn tài liệu học tập</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="search-filter-section">
        <div className="container">
          <div className="search-bar-large">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <button className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="filter-container">
            <div className="filters">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">Tất cả loại</option>
                {mockDocumentCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
              >
                <option value="">Tất cả môn học</option>
                {mockQuestionCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <select
                value={filters.major}
                onChange={(e) => handleFilterChange('major', e.target.value)}
              >
                <option value="">Tất cả ngành</option>
                <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              </select>

              <select
                value={filters.format}
                onChange={(e) => handleFilterChange('format', e.target.value)}
              >
                <option value="">Tất cả định dạng</option>
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
                <option value="PPT">PPT</option>
              </select>

              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>

            <button className="btn btn-outline" onClick={clearFilters}>
              <i className="fas fa-times"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </section>

      {/* Documents List */}
      <section className="documents-section">
        <div className="container">
          <div className="section-toolbar">
            <div className="results-count">
              Tìm thấy {documents.length} tài liệu
            </div>
            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>

          <div className={`documents-${viewMode}`}>
            {currentDocuments.map(doc => (
              <TheTaiLieu key={doc.id} document={doc} />
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
      </section>
    </BoTri>
  )
}
