import { Link } from 'react-router-dom'
import BoTri from '../../components/BoTri'

const faqs = [
  {
    question: 'Làm sao để tải lên tài liệu?',
    answer: 'Đăng nhập, vào trang Tải lên tài liệu, chọn file, loại, định dạng và mô tả rồi bấm Tải lên.'
  },
  {
    question: 'Tài liệu bị lỗi hoặc sai nội dung, tôi báo cáo thế nào?',
    answer: 'Mở chi tiết tài liệu và dùng nút Báo cáo, chọn lý do phù hợp và gửi.'
  },
  {
    question: 'Tôi có thể chỉnh sửa câu hỏi/câu trả lời của mình không?',
    answer: 'Có. Trong trang chi tiết câu hỏi, bạn sẽ thấy nút chỉnh sửa với các nội dung do bạn đăng.'
  },
  {
    question: 'Làm sao đánh dấu câu hỏi đã được trả lời?',
    answer: 'Trong trang chi tiết câu hỏi của bạn, dùng nút Đánh dấu đã trả lời để đóng câu hỏi.'
  },
  {
    question: 'Quên mật khẩu thì phải làm gì?',
    answer: 'Chọn Quên mật khẩu, nhập email để nhận liên kết đặt lại, sau đó đặt mật khẩu mới.'
  },
  {
    question: 'Tôi cần thêm hỗ trợ?',
    answer: 'Xem Hướng dẫn sử dụng hoặc liên hệ đội ngũ qua trang Liên hệ.'
  }
]

export default function CauHoiThuongGap() {
  return (
    <BoTri>
      <section className="page-header">
        <div className="container">
          <h1>Câu hỏi thường gặp</h1>
          <p>Giải đáp nhanh các thắc mắc phổ biến.</p>
        </div>
      </section>

      <section className="container support-content" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {faqs.map((item, index) => (
            <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', background: '#fff' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{item.question}</h3>
              <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>{item.answer}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <p>Không thấy câu trả lời bạn cần? Xem thêm <Link to="/support/guide">Hướng dẫn sử dụng</Link> hoặc <Link to="/support/contact">Liên hệ</Link> đội ngũ hỗ trợ.</p>
        </div>
      </section>
    </BoTri>
  )
}
