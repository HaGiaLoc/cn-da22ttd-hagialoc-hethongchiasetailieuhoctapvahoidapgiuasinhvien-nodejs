import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import TheTaiLieu from '../../components/user/TheTaiLieu'
import PhanTrang from '../../components/user/PhanTrang'
import { taiLieuService } from '../../services'
import { searchMatch } from '../../utils/helpers'

export default function DanhSachTaiLieu() {
  const [searchParams] = useSearchParams()
  const [allDocuments, setAllDocuments] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: '',
    subject: '',
    major: '',
    format: '',
    sort: 'newest'
  })
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    subjects: [],
    majors: [],
    formats: []
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const itemsPerPage = 12

  useEffect(() => {
    loadDocuments()
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      const [loaiRes, monRes, nganhRes, dinhDangRes] = await Promise.all([
        taiLieuService.getLoaiTaiLieu(),
        taiLieuService.getMon(),
        taiLieuService.getNganh(),
        taiLieuService.getDinhDang()
      ])

      console.log('Filter options loaded:', { loaiRes, monRes, nganhRes, dinhDangRes })

      setFilterOptions({
        types: loaiRes?.data || loaiRes || [],
        subjects: monRes?.data || monRes || [],
        majors: nganhRes?.data || nganhRes || [],
        formats: dinhDangRes?.data || dinhDangRes || []
      })
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const res = await taiLieuService.getAll()
      const docs = res.documents || res.data || []
      setAllDocuments(docs)
      setDocuments(docs)
    } catch (error) {
      console.error('Error loading documents:', error)
      setAllDocuments([])
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    applyFilters()
  }, [filters])

  const applyFilters = () => {
    let filtered = [...allDocuments]

    if (filters.search) {
      filtered = filtered.filter(doc =>
        searchMatch(doc.tieuDeTL, filters.search)
      )
    }

    if (filters.type) {
      filtered = filtered.filter(doc => doc.loaiTaiLieu === filters.type)
    }

    if (filters.subject) {
      filtered = filtered.filter(doc => doc.tenMon === filters.subject)
    }

    if (filters.major) {
      filtered = filtered.filter(doc => doc.tenNganh === filters.major)
    }

    if (filters.format) {
      filtered = filtered.filter(doc => doc.tenDinhDang === filters.format)
    }

    // Sorting
    if (filters.sort === 'newest') {
      filtered.sort((a, b) => new Date(b.ngayChiaSe) - new Date(a.ngayChiaSe))
    } else if (filters.sort === 'popular') {
      filtered.sort((a, b) => b.soLanLuu - a.soLanLuu)
    } else if (filters.sort === 'rating') {
      filtered.sort((a, b) => b.luotTaiXuong - a.luotTaiXuong)
    }

    setDocuments(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleMajorChange = (value) => {
    setFilters(prev => ({ ...prev, major: value, subject: '' }))
  }

  // Lọc môn học theo ngành được chọn
  const filteredSubjects = filters.major
    ? filterOptions.subjects.filter(mon => {
        const nganh = filterOptions.majors.find(n => n.tenNganh === filters.major)
        return nganh ? mon.maNganh === nganh.maNganh : true
      })
    : filterOptions.subjects

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

      {/* Main Content with Sidebar */}
      <section className="documents-section">
        <div className="container">
          <div className="documents-layout">
            {/* Sidebar Filter */}
            <aside className="documents-sidebar">
              <div className="sidebar-card">
                <h3>Bộ lọc</h3>
                
                <div className="filter-group">
                  <label>Loại tài liệu</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">Tất cả loại</option>
                    {filterOptions.types.map((type) => (
                      <option key={type.maLoai} value={type.loaiTaiLieu}>
                        {type.loaiTaiLieu}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Ngành</label>
                  <select
                    value={filters.major}
                    onChange={(e) => handleMajorChange(e.target.value)}
                  >
                    <option value="">Tất cả ngành</option>
                    {filterOptions.majors.map((nganh) => (
                      <option key={nganh.maNganh} value={nganh.tenNganh}>
                        {nganh.tenNganh}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Môn học</label>
                  <select
                    value={filters.subject}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                    disabled={!filters.major}
                  >
                    <option value="">
                      {!filters.major 
                        ? 'Chọn ngành trước' 
                        : filteredSubjects.length === 0 
                          ? 'Không có môn học' 
                          : 'Tất cả môn học'}
                    </option>
                    {filteredSubjects.map((mon) => (
                      <option key={mon.maMon} value={mon.tenMon}>
                        {mon.tenMon}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Định dạng</label>
                  <select
                    value={filters.format}
                    onChange={(e) => handleFilterChange('format', e.target.value)}
                  >
                    <option value="">Tất cả định dạng</option>
                    {filterOptions.formats.map((format) => (
                      <option key={format.maDinhDang} value={format.tenDinhDang}>
                        {format.tenDinhDang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sắp xếp</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Phổ biến</option>
                    <option value="rating">Lượt tải</option>
                  </select>
                </div>

                <button className="btn btn-primary btn-full" onClick={clearFilters}>
                  <i className="fas fa-times"></i> Xóa bộ lọc
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="documents-main">
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
            {isLoading ? (
              <div className="loading-container">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Đang tải tài liệu...</p>
              </div>
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map(doc => (
                <TheTaiLieu key={doc.maTaiLieu} document={doc} />
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-folder-open"></i>
                <h3>Chưa có tài liệu nào</h3>
                <p>
                  {filters.search || filters.type || filters.subject || filters.major || filters.format
                    ? 'Không tìm thấy tài liệu phù hợp với bộ lọc. Thử xóa bộ lọc hoặc tìm kiếm khác.'
                    : 'Hiện tại chưa có tài liệu nào trong hệ thống. Hãy là người đầu tiên chia sẻ tài liệu!'}
                </p>
                {!(filters.search || filters.type || filters.subject || filters.major || filters.format) && (
                  <Link to="/upload" className="btn btn-primary">
                    <i className="fas fa-upload"></i> Tải lên tài liệu
                  </Link>
                )}
              </div>
            )}
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
