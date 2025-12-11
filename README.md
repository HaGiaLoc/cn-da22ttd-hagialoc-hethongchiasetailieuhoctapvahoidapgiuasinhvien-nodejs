# HỆ THỐNG CHIA SẺ TÀI LIỆU VÀ HỎI ĐÁP GIỮA SINH VIÊN (KEF)

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Công nghệ](#công-nghệ)
- [Tính năng](#tính-năng)
- [Giới thiệu về repository](#giới-thiệu-về-repository)
- [Cài đặt](#cài-đặt)
- [Giấy phép](#giấy-phép)

---

## Giới thiệu
Hệ thống được phát triển nhằm hỗ trợ sinh viên trong việc chia sẻ tài liệu học tập và trao đổi kiến thức một cách thuận tiện. Người dùng có thể đăng tải tài liệu, đặt câu hỏi, trả lời thắc mắc và cùng nhau xây dựng một cộng đồng học thuật cởi mở.

---

## Công nghệ
- **Backend:** Node.js, Express, MySQL2, JWT, Multer, bcryptjs, express-validator.
- **Frontend:** React 18, Vite, React Router, Axios.
- **Hạ tầng:** Docker Compose (MySQL 8, backend, frontend).

---

## Tính năng
- **Đăng ký/đăng nhập**: Hỗ trợ tài khoản bằng email và mật khẩu, kèm theo chức năng quên mật khẩu và xác thực bằng JWT.
- **Quản lý tài liệu**: Sinh viên có thể upload tài liệu, phân loại theo môn học hoặc chủ đề, lưu trữ và tải về khi cần.
- **Hỏi đáp**: Cho phép đặt câu hỏi, trả lời, chỉnh sửa nội dung và đánh dấu câu hỏi đã được giải đáp.
- **Báo cáo và quản trị**: Người dùng có thể báo cáo nội dung vi phạm; phía quản trị có thể duyệt báo cáo, quản lý tài liệu và tài khoản.
- **Lưu trữ file bền vững**: Tài liệu được lưu qua Docker volumes để đảm bảo không bị mất khi hệ thống khởi động lại.

---

## Giới thiệu về repository
Repository này lưu toàn bộ mã nguồn của hệ thống và các tài liệu liên quan đến đồ án. Tất cả thư mục đều nằm trong branch **main**. Cấu trúc chính gồm:

- **src:** Chứa toàn bộ mã nguồn backend, frontend và cấu hình cơ sở dữ liệu.
- **thesis:** Lưu các tài liệu báo cáo, mô tả hệ thống và nội dung đồ án.

---


## Cài đặt
1. **Tải về ứng dụng web**:
   - Ứng dụng web có thể được tải về bằng cách tải file src.

2. **Cài đặt XAMPP**:
   - Đảm bảo rằng [XAMPP](https://www.apachefriends.org) đã được cài đặt trên máy tính của bạn.

3. **Triển khai**:
   ## Chạy bằng Docker (khuyến nghị)
   Yêu cầu: Docker và Docker Compose.

   Mở PowerShell, vào thư mục `src` và chạy:

   ```powershell
   cd src
   docker-compose up -d --build
   ```

   - Frontend: `http://localhost:8080`
   - Backend (health): `http://localhost:5000/api/health`
   - MySQL: `localhost:3307` (user `kef_user`, pass `kef_password`, db `kef_db`)

   ## Chạy thủ công
   1) Database
   - Tạo database `kef_db` và import `src/backend/data/kef_db.sql` (cấu trúc). Có thể import thêm file `kef_db(mock_data).sql` để có dữ liệu mẫu.

   2) Backend

   ```powershell
   cd src/backend
   npm install
   npm run dev
   ```

   3) Frontend

   ```powershell
   cd src/frontend
   npm install
   npm run dev
   ```

   ## Cấu hình `.env`
   Đặt file `.env` trong `src/backend` và `src/frontend` (hoặc sử dụng thiết lập mẫu trong `.env.example`).
   
   Backend:
   - `PORT` — cổng backend (mặc định `5000`).
   - `DB_HOST` — host DB (Nếu dùng Docker: `db`; nếu triển khai local: `localhost`).
   - `DB_PORT` — cổng DB (mặc định `3306` hoặc `3307` nếu map cổng trên host).
   - `DB_USER` — cấu hình user (Mặc định trong Docker là `kef_user`).
   - `DB_PASSWORD` — mật khẩu DB.
   - `DB_NAME` — `kef_db`.
   - `JWT_SECRET` — khóa bí mật JWT (bắt buộc thay đổi trước khi deploy).

   Frontend: thay `VITE_API_URL` hoặc biến tương tự để trỏ tới backend (ví dụ `http://localhost:5000/api`).

   ## Dữ liệu mẫu
   - Import `src/backend/data/kef_db.sql` để tạo cấu trúc bảng và một số dữ liệu khởi tạo.
   - (Tùy chọn) Import `src/backend/data/kef_db(mock_data).sql` để có dữ liệu demo.
   - Nếu dùng Docker Compose và bật phpMyAdmin, bạn có thể truy cập giao diện web để kiểm tra dữ liệu. Cổng phpMyAdmin và thông tin đăng nhập phụ thuộc vào `docker-compose.yml`.

   Chú ý thực hành khi chạy SQL từ PowerShell: các giá trị bcrypt chứa ký tự `$`. PowerShell có thể interpret `$` như biến — khi chèn hoặc update hash trực tiếp qua lệnh `docker exec mysql -e "..."`, hãy bọc chuỗi SQL trong single quotes hoặc dùng file `.sql` để import để tránh bị cắt/xuyên chuỗi.

   ## Lưu ý bảo mật
   - Thay `JWT_SECRET` bằng giá trị đủ mạnh trước khi deploy.
   - Thay mật khẩu mặc định DB và tạo user với quyền phù hợp.
   - Kiểm tra và giới hạn kích thước upload, quét loại file và đặt quyền cho thư mục upload.

   ## Scripts hữu ích
   - Backend: `npm run dev` (nodemon), `npm start` (node).
   - Frontend: `npm run dev`, `npm run build`, `npm run preview`.

   ## Kiểm tra sau khi khởi động
   - Đảm bảo backend trả `200` cho `GET /api/health`.
   - Thử đăng nhập admin bằng một tài khoản đã seed trong DB (hoặc tạo admin mới bằng script tạo hash).

## Giấy phép
Đây là một hệ thống được tạo ra chỉ vì đồ án chuyên ngành không vì bất kỳ lợi ích thương mại hay kiếm tiền.
