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
              <li><Link to="/support/guide">Hướng dẫn sử dụng</Link></li>
              <li><Link to="/support/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/support/contact">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; KEF - Knowledge Exchange Forum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
