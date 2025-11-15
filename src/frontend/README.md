# EduShare - React Frontend

## 🎯 Giới thiệu

Giao diện người dùng được xây dựng bằng **React 18** với **Vite** cho hệ thống chia sẻ tài liệu học tập và hỏi đáp giữa sinh viên.

## 🏗️ Công nghệ sử dụng

- **React 18.2** - Thư viện UI
- **React Router DOM 6.20** - Routing
- **Vite 5** - Build tool & Dev server
- **Axios** - HTTP client
- **CSS3** - Styling (sử dụng lại CSS từ phiên bản cũ)
- **Font Awesome 6.4** - Icons

## 📁 Cấu trúc thư mục

```
src/frontend/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── components/
│   │   ├── BoTri.jsx
│   │   ├── ThanhDieuHuong.jsx
│   │   ├── ChanTrang.jsx
│   │   ├── KhuVucAnh.jsx
│   │   ├── TheTaiLieu.jsx
│   │   ├── TheCauHoi.jsx
│   │   ├── PhanTrang.jsx
│   │   └── ThongBao.jsx
│   ├── pages/
│   │   ├── TrangChu.jsx
│   │   ├── DanhSachTaiLieu.jsx
│   │   ├── ChiTietTaiLieu.jsx
│   │   ├── TaiLenTaiLieu.jsx
│   │   ├── TaiLieuCuaToi.jsx
│   │   ├── HoiDap.jsx
│   │   ├── ChiTietCauHoi.jsx
│   │   ├── DatCauHoi.jsx
│   │   ├── CauHoiCuaToi.jsx
│   │   ├── DangNhap.jsx
│   │   ├── DangKy.jsx
│   │   ├── HoSo.jsx
│   │   ├── ChinhSuaHoSo.jsx
│   │   └── DoiMatKhau.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
cd src/frontend
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🛣️ Routing

Sử dụng React Router DOM 6 với **14 routes**:

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/` | TrangChu | Trang chủ |
| `/documents` | DanhSachTaiLieu | Danh sách tài liệu |
| `/documents/:id` | ChiTietTaiLieu | Chi tiết tài liệu |
| `/upload` | TaiLenTaiLieu | Upload tài liệu |
| `/my-documents` | TaiLieuCuaToi | Tài liệu của tôi |
| `/qa` | HoiDap | Danh sách Q&A |
| `/qa/:id` | ChiTietCauHoi | Chi tiết câu hỏi |
| `/ask` | DatCauHoi | Đặt câu hỏi |
| `/my-questions` | CauHoiCuaToi | Câu hỏi của tôi |
| `/login` | DangNhap | Đăng nhập |
| `/register` | DangKy | Đăng ký |
| `/profile` | HoSo | Hồ sơ người dùng |
| `/profile/edit` | ChinhSuaHoSo | Chỉnh sửa hồ sơ |
| `/change-password` | DoiMatKhau | Đổi mật khẩu |

## 🐛 Lỗi thường gặp

### 1. Module not found
```bash
npm install
```

### 2. Port 3000 đã được sử dụng
Thay đổi port trong `vite.config.js`:
```javascript
server: {
  port: 3001
}
```

### 3. CSS không load
Kiểm tra đường dẫn trong `src/index.css`