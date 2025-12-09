import { Link } from 'react-router-dom'
import BoTri from '../../components/BoTri'

export default function HuongDan() {
  return (
    <BoTri>
      <section className="page-header">
        <div className="container">
          <h1>Hướng dẫn sử dụng</h1>
          <p>Các bước nhanh để bắt đầu với KEF.</p>
        </div>
      </section>

      <section className="container support-content" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <h2>1) Đăng ký / đăng nhập</h2>
            <ul>
              <li>Đăng ký tài khoản bằng email tại trang <Link to="/register">Đăng ký</Link>.</li>
              <li>Đăng nhập tại <Link to="/login">Đăng nhập</Link> và bật "Ghi nhớ đăng nhập" nếu cần.</li>
              <li>Nếu quên mật khẩu, dùng <Link to="/forgot-password">Quên mật khẩu</Link> để nhận liên kết đặt lại.</li>
            </ul>
          </div>

          <div>
            <h2>2) Tài liệu</h2>
            <ul>
              <li>Khám phá tài liệu tại <Link to="/documents">Danh sách tài liệu</Link> và dùng bộ lọc để tìm nhanh.</li>
              <li>Tải lên tài liệu mới tại <Link to="/upload">Tải lên tài liệu</Link>; chọn loại, định dạng và mô tả ngắn.</li>
              <li>Theo dõi tài liệu của bạn tại <Link to="/my-documents">Tài liệu của tôi</Link>.</li>
            </ul>
          </div>

          <div>
            <h2>3) Hỏi đáp</h2>
            <ul>
              <li>Đặt câu hỏi mới tại <Link to="/ask">Đặt câu hỏi</Link>, chọn môn học và thêm mô tả rõ ràng.</li>
              <li>Xem tất cả câu hỏi tại <Link to="/qa">Hỏi đáp</Link>; mở chi tiết để đọc và trả lời.</li>
              <li>Quản lý câu hỏi của bạn tại <Link to="/my-questions">Câu hỏi của tôi</Link> (chỉnh sửa, đánh dấu đã trả lời).</li>
            </ul>
          </div>

          <div>
            <h2>4) Báo cáo & chỉnh sửa</h2>
            <ul>
              <li>Dùng nút báo cáo trong chi tiết tài liệu/câu hỏi/câu trả lời để gửi vi phạm.</li>
              <li>Bạn có thể chỉnh sửa bài đăng của chính mình (câu hỏi, câu trả lời) trực tiếp trong trang chi tiết.</li>
            </ul>
          </div>

          <div>
            <h2>5) Hồ sơ & bảo mật</h2>
            <ul>
              <li>Cập nhật thông tin cá nhân tại <Link to="/profile/edit">Chỉnh sửa hồ sơ</Link> và đổi mật khẩu tại <Link to="/change-password">Đổi mật khẩu</Link>.</li>
              <li>Đăng xuất khi dùng máy công cộng để giữ an toàn tài khoản.</li>
            </ul>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
