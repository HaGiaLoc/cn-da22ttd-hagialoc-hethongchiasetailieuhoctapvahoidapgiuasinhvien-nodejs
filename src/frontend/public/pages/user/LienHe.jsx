import BoTri from '../../components/BoTri'

export default function LienHe() {
  return (
    <BoTri>
      <section className="page-header">
        <div className="container">
          <h1>Liên hệ</h1>
          <p>Kết nối với đội ngũ KEF để được hỗ trợ.</p>
        </div>
      </section>

      <section className="container support-content" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', background: '#fff' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Kênh liên hệ chính</h3>
            <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.6 }}>
              <li>Email hỗ trợ: kainennet2023@gmail.com</li>
              <li>Giờ hỗ trợ: 08:00 - 18:00 (T2 - T6)</li>
              <li>Ưu tiên mô tả rõ vấn đề, đường dẫn trang và ảnh chụp màn hình (nếu có).</li>
            </ul>
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', background: '#fff' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Khi nào nên liên hệ?</h3>
            <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.6 }}>
              <li>Lỗi đăng nhập, quên mật khẩu nhưng không nhận được email.</li>
              <li>Không tải được tài liệu hoặc gặp lỗi khi xem câu hỏi/câu trả lời.</li>
              <li>Phát hiện nội dung vi phạm nhưng nút báo cáo không hoạt động.</li>
              <li>Cần hướng dẫn cấu hình môi trường hoặc các câu hỏi khác.</li>
            </ul>
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', background: '#fff' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Tài nguyên nhanh</h3>
            <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.6 }}>
              <li><a href="/support/guide">Hướng dẫn sử dụng</a> cho các bước thiết lập.</li>
              <li><a href="/support/faq">Câu hỏi thường gặp</a> để tự tra cứu nhanh.</li>
            </ul>
          </div>
        </div>
      </section>
    </BoTri>
  )
}
