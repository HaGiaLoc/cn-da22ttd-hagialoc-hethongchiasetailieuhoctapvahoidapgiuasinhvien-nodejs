# API Services - Frontend Integration

## Cấu trúc API Layer

```
services/
├── authService.js       # Authentication API
├── taiLieuService.js    # Document API
├── cauHoiService.js     # Q&A API
├── binhLuanService.js   # Comment API
├── baoCaoService.js     # Report API
├── adminService.js      # Admin API
└── index.js            # Export all services

utils/
└── api.js              # Axios instance với interceptors
```

## Sử dụng API Services

### 1. Import services

```javascript
import { authService, taiLieuService, cauHoiService } from '../services';
// hoặc
import authService from '../services/authService';
```

### 2. Authentication

```javascript
// Đăng nhập
try {
  const { user, token, role } = await authService.login(email, password);
  // Lưu user và token vào localStorage/sessionStorage
  localStorage.setItem('user', JSON.stringify({ ...user, token, role }));
} catch (error) {
  console.error('Login failed:', error.message);
}

// Đăng ký
try {
  const { student, token } = await authService.register({
    email: 'student@example.com',
    password: 'password123',
    hoTenSV: 'Nguyễn Văn A',
    MSSV: '110121001',
    Nganh: 'Công nghệ thông tin'
  });
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Đổi mật khẩu
await authService.changePassword('oldPassword', 'newPassword');

// Logout
authService.logout();
```

### 3. Tài liệu

```javascript
// Lấy danh sách tài liệu
const { documents, pagination } = await taiLieuService.getAll({
  Mon: 'Lập trình Web',
  Nganh: 'Công nghệ thông tin',
  search: 'Node.js',
  page: 1,
  limit: 20
});

// Lấy chi tiết tài liệu
const document = await taiLieuService.getById(1);

// Upload tài liệu
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('Mon', 'Lập trình Web');
formData.append('Nganh', 'Công nghệ thông tin');
formData.append('LoaiTaiLieu', 'Giáo trình');
formData.append('tieuDe', 'Node.js Tutorial');
formData.append('moTa', 'Hướng dẫn Node.js');

const newDocument = await taiLieuService.upload(formData);

// Đánh giá tài liệu
await taiLieuService.rate(1, 5); // 5 sao

// Lưu/Bỏ lưu tài liệu
await taiLieuService.save(1);
await taiLieuService.unsave(1);

// Lấy tài liệu đã lưu
const { documents } = await taiLieuService.getSavedDocuments();

// Lấy tài liệu của tôi
const { documents } = await taiLieuService.getMyDocuments();
```

### 4. Câu hỏi & Trả lời

```javascript
// Lấy danh sách câu hỏi
const { questions, pagination } = await cauHoiService.getAll({
  Mon: 'Lập trình Web',
  trangThaiCH: 'open',
  search: 'React',
  page: 1
});

// Tạo câu hỏi
const question = await cauHoiService.create({
  maDanhMuc: 1,
  tieuDeCH: 'React Hooks là gì?',
  noiDungCH: 'Chi tiết câu hỏi...',
  Tag: 'react,hooks',
  Mon: 'Lập trình Web',
  Nganh: 'Công nghệ thông tin'
});

// Trả lời câu hỏi
await cauHoiService.answer(1, 'Nội dung câu trả lời...');

// Chấp nhận câu trả lời (chỉ người hỏi)
await cauHoiService.acceptAnswer(questionId, answerId);

// Vote câu hỏi/câu trả lời
await cauHoiService.voteQuestion(1, true); // upvote
await cauHoiService.voteQuestion(1, false); // downvote
await cauHoiService.voteAnswer(answerId, true);
```

### 5. Bình luận

```javascript
// Lấy bình luận
const comments = await binhLuanService.getByDocument(1);

// Tạo bình luận
await binhLuanService.create(1, 'Nội dung bình luận');

// Xóa bình luận
await binhLuanService.delete(commentId);
```

### 6. Báo cáo

```javascript
// Tạo báo cáo
await baoCaoService.create('Nội dung vi phạm bản quyền');

// Admin: Lấy danh sách báo cáo
const { reports, pagination } = await baoCaoService.getAll('pending');

// Admin: Duyệt/Từ chối báo cáo
await baoCaoService.approve(reportId);
await baoCaoService.reject(reportId);
```

### 7. Admin

```javascript
// Thống kê dashboard
const stats = await adminService.getDashboardStats();
// {
//   totalStudents: 150,
//   totalDocuments: 300,
//   pendingDocuments: 20,
//   totalQuestions: 100,
//   pendingReports: 5
// }

// Quản lý sinh viên
const { students, pagination } = await adminService.getStudents(1, 20);
await adminService.deleteStudent(studentId);

// Quản lý tài liệu
const { documents } = await adminService.getPendingDocuments();
await adminService.approveDocument(docId);
await adminService.rejectDocument(docId);
```

## Error Handling

Tất cả services đều throw error khi có lỗi. Sử dụng try-catch:

```javascript
try {
  const documents = await taiLieuService.getAll();
} catch (error) {
  if (error.status === 401) {
    // Chưa đăng nhập
    console.error('Vui lòng đăng nhập');
  } else if (error.status === 403) {
    // Không có quyền
    console.error('Bạn không có quyền thực hiện hành động này');
  } else {
    // Lỗi khác
    console.error('Error:', error.message);
  }
}
```

## Axios Interceptors

### Request Interceptor
- Tự động thêm Bearer token vào header từ localStorage/sessionStorage

### Response Interceptor
- Tự động trả về `response.data` thay vì toàn bộ response
- Tự động logout và redirect khi token hết hạn (401)
- Transform error thành format chuẩn

## Environment Variables

File `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Migration từ MockData sang API

### Trước (MockData):
```javascript
const documents = mockDocuments.filter(doc => doc.Mon === 'Lập trình Web');
```

### Sau (API):
```javascript
const { documents } = await taiLieuService.getAll({ Mon: 'Lập trình Web' });
```

## Testing API Connection

```javascript
// Test trong component
useEffect(() => {
  const testAPI = async () => {
    try {
      const { documents } = await taiLieuService.getAll({ limit: 5 });
      console.log('API connected successfully:', documents);
    } catch (error) {
      console.error('API connection failed:', error);
    }
  };
  testAPI();
}, []);
```

## Notes

- Backend phải chạy ở `http://localhost:5000`
- Frontend chạy ở `http://localhost:8080`
- Vite proxy tự động chuyển `/api/*` → `http://localhost:5000/api/*`
- Token được tự động thêm vào mọi request
- Không cần thêm `/api` prefix khi gọi services (đã có trong baseURL)
