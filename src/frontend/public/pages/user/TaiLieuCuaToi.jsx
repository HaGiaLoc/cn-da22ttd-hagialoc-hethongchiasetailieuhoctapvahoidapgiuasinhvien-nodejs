import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import BoTri from '../../components/BoTri'
import TheTaiLieu from '../../components/user/TheTaiLieu'
import PhanTrang from '../../components/user/PhanTrang'
import { taiLieuService } from '../../services'
import { useAuth } from '../../contexts/AuthContext'

export default function TaiLieuCuaToi() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  const [myDocuments, setMyDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 12

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { state: { from: location } })
    } else {
      loadDocuments()
    }
  }, [user, navigate, loading])

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const res = await taiLieuService.getAll()
      const docs = res.documents || res.data || []
      setMyDocuments(docs.filter(d => d.author === user?.name))
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sắp xếp
  let sortedDocuments = [...myDocuments]
  if (sortBy === 'newest') {
    sortedDocuments.sort((a, b) => b.date - a.date)
  } else if (sortBy === 'downloads') {
    sortedDocuments.sort((a, b) => b.downloads - a.downloads)
  }

  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage)
  const currentDocuments = sortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <BoTri>
      <section className="page-header">
        <div className="container">
          <h1><i className="fas fa-file-alt"></i> Tài liệu của tôi</h1>
          <p>Quản lý tài liệu bạn đã tải lên</p>
        </div>
      </section>

      <section className="documents-section">
        <div className="container">
          <div className="section-header">
            <div className="header-left">
              <h2>{sortedDocuments.length} tài liệu</h2>
            </div>
            <div className="header-right">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="downloads">Nhiều tải nhất</option>
              </select>
              <Link to="/upload" className="btn btn-primary">
                <i className="fas fa-upload"></i> Upload tài liệu mới
              </Link>
            </div>
          </div>

          {currentDocuments.length > 0 ? (
            <>
              <div className="documents-grid">
                {currentDocuments.map(doc => (
                  <TheTaiLieu key={doc.maTaiLieu} document={doc} />
                ))}
              </div>

              {totalPages > 1 && (
                <PhanTrang
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="empty-state">
              <i className="fas fa-file-alt"></i>
              <h3>Chưa có tài liệu nào</h3>
              <p>Bạn chưa tải lên tài liệu nào. Hãy chia sẻ tài liệu của bạn với cộng đồng!</p>
              <Link to="/upload" className="btn btn-primary">
                <i className="fas fa-upload"></i> Upload tài liệu
              </Link>
            </div>
          )}
        </div>
      </section>
    </BoTri>
  )
}
