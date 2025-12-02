import { Link } from 'react-router-dom'

export default function ChanTrang() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <i className="fas fa-graduation-cap"></i> KEF
            </h3>
            <p>Nền tảng chia sẻ tài liệu học tập và hỏi đáp dành cho sinh viên</p>
          </div>
          
          <div className="footer-section">
            <h4>Liên kết</h4>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/documents">Tài liệu</Link></li>
              <li><Link to="/qa">Hỏi đáp</Link></li>
              <li><Link to="/about">Giới thiệu</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Hướng dẫn sử dụng</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Theo dõi</h4>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; KEF - Knowledge Exchange Forum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
