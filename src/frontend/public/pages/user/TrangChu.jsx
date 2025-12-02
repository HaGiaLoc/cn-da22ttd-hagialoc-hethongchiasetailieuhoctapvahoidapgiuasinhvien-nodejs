import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BoTri from '../../components/BoTri'
import KhuVucAnh from '../../components/user/KhuVucAnh'
import TheTaiLieu from '../../components/user/TheTaiLieu'
import TheCauHoi from '../../components/user/TheCauHoi'
import { taiLieuService, cauHoiService } from '../../api'

export default function TrangChu() {
  const [recentDocuments, setRecentDocuments] = useState([])
  const [recentQuestions, setRecentQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [docsRes, questionsRes] = await Promise.all([
        taiLieuService.getAll({ limit: 3 }),
        cauHoiService.getAll({ limit: 3 })
      ])
      
      setRecentDocuments(docsRes.documents || [])
      setRecentQuestions(questionsRes.questions || [])
    } catch (error) {
      console.error('Error loading homepage data:', error)
      setRecentDocuments([])
      setRecentQuestions([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <BoTri>
      <KhuVucAnh />
      
      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tính năng nổi bật</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-cloud-upload-alt"></i>
              <h3>Chia sẻ tài liệu</h3>
              <p>Upload và chia sẻ tài liệu học tập với cộng đồng sinh viên</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-download"></i>
              <h3>Tải miễn phí</h3>
              <p>Tải về hàng ngàn tài liệu chất lượng hoàn toàn miễn phí</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-comments"></i>
              <h3>Hỏi đáp</h3>
              <p>Đặt câu hỏi và nhận câu trả lời từ cộng đồng</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-star"></i>
              <h3>Đánh giá</h3>
              <p>Đánh giá và bình luận về tài liệu</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-search"></i>
              <h3>Tìm kiếm</h3>
              <p>Tìm kiếm nhanh chóng với bộ lọc thông minh</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-users"></i>
              <h3>Cộng đồng</h3>
              <p>Kết nối với hàng ngàn sinh viên cùng chí hướng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Documents */}
      <section className="recent-documents">
        <div className="container">
          <div className="section-header">
            <h2>Tài liệu mới nhất</h2>
            <Link to="/documents" className="btn btn-outline">Xem tất cả</Link>
          </div>
          {loading ? (
            <div className="loading-message">Đang tải...</div>
          ) : recentDocuments.length > 0 ? (
            <div className="documents-grid">
              {recentDocuments.map(doc => (
                <TheTaiLieu key={doc.maTaiLieu || doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <div className="empty-message">Chưa có tài liệu nào</div>
          )}
        </div>
      </section>

      {/* Recent Questions */}
      <section className="recent-questions">
        <div className="container">
          <div className="section-header">
            <h2>Câu hỏi mới nhất</h2>
            <Link to="/qa" className="btn btn-outline">Xem tất cả</Link>
          </div>
          {loading ? (
            <div className="loading-message">Đang tải...</div>
          ) : recentQuestions.length > 0 ? (
            <div className="questions-list">
              {recentQuestions.map(question => (
                <TheCauHoi key={question.maCauHoi || question.id} question={question} />
              ))}
            </div>
          ) : (
            <div className="empty-message">Chưa có câu hỏi nào</div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Sẵn sàng bắt đầu?</h2>
          <p>Tham gia cộng đồng sinh viên và khám phá hàng ngàn tài liệu học tập</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-white btn-lg">Đăng ký ngay</Link>
            <Link to="/documents" className="btn btn-white btn-lg">Khám phá tài liệu</Link>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
