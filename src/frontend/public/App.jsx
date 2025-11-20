import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import AdminRoute from './components/admin/AdminRoute'

// Pages
import TrangChu from './pages/user/TrangChu'
import DanhSachTaiLieu from './pages/user/DanhSachTaiLieu'
import TaiLenTaiLieu from './pages/user/TaiLenTaiLieu'
import TaiLieuCuaToi from './pages/user/TaiLieuCuaToi'
import HoiDap from './pages/user/HoiDap'
import ChiTietCauHoi from './pages/user/ChiTietCauHoi'
import DatCauHoi from './pages/user/DatCauHoi'
import CauHoiCuaToi from './pages/user/CauHoiCuaToi'
import DangNhap from './pages/user/DangNhap'
import DangKy from './pages/user/DangKy'
import HoSo from './pages/user/HoSo'
import ChinhSuaHoSo from './pages/user/ChinhSuaHoSo'
import DoiMatKhau from './pages/user/DoiMatKhau'

// Admin Pages
import QuanTriDashboard from './pages/admin/QuanTriDashboard'
import QuanTriTaiLieu from './pages/admin/QuanTriTaiLieu'
import QuanTriBaoCao from './pages/admin/QuanTriBaoCao'
import QuanTriNguoiDung from './pages/admin/QuanTriNguoiDung'
import QuanTriMonHoc from './pages/admin/QuanTriMonHoc'
import QuanTriNganh from './pages/admin/QuanTriNganh'
import QuanTriTags from './pages/admin/QuanTriTags'
import QuanTriLoaiTaiLieu from './pages/admin/QuanTriLoaiTaiLieu'
import QuanTriDinhDang from './pages/admin/QuanTriDinhDang'
import QuanTriQuanTriVien from './pages/admin/QuanTriQuanTriVien'
import QuanTriCauHoi from './pages/admin/QuanTriCauHoi'
import QuanTriCauTraLoi from './pages/admin/QuanTriCauTraLoi'
import QuanTriThongKe from './pages/admin/QuanTriThongKe'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<TrangChu />} />
          <Route path="/documents" element={<DanhSachTaiLieu />} />
          <Route path="/upload" element={<TaiLenTaiLieu />} />
          <Route path="/my-documents" element={<TaiLieuCuaToi />} />
          <Route path="/qa" element={<HoiDap />} />
          <Route path="/qa/:id" element={<ChiTietCauHoi />} />
          <Route path="/ask" element={<DatCauHoi />} />
          <Route path="/my-questions" element={<CauHoiCuaToi />} />
          <Route path="/login" element={<DangNhap />} />
          <Route path="/register" element={<DangKy />} />
          <Route path="/profile" element={<HoSo />} />
          <Route path="/profile/edit" element={<ChinhSuaHoSo />} />
          <Route path="/change-password" element={<DoiMatKhau />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminRoute><QuanTriDashboard /></AdminRoute>} />
          <Route path="/admin/documents" element={<AdminRoute><QuanTriTaiLieu /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><QuanTriBaoCao /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><QuanTriNguoiDung /></AdminRoute>} />
          <Route path="/admin/questions" element={<AdminRoute><QuanTriCauHoi /></AdminRoute>} />
          <Route path="/admin/answers" element={<AdminRoute><QuanTriCauTraLoi /></AdminRoute>} />
          
          {/* Category Management Routes */}
          <Route path="/admin/categories/subjects" element={<AdminRoute><QuanTriMonHoc /></AdminRoute>} />
          <Route path="/admin/categories/majors" element={<AdminRoute><QuanTriNganh /></AdminRoute>} />
          <Route path="/admin/categories/tags" element={<AdminRoute><QuanTriTags /></AdminRoute>} />
          <Route path="/admin/categories/document-types" element={<AdminRoute><QuanTriLoaiTaiLieu /></AdminRoute>} />
          <Route path="/admin/categories/formats" element={<AdminRoute><QuanTriDinhDang /></AdminRoute>} />
          
          {/* System Management Routes */}
          <Route path="/admin/admins" element={<AdminRoute><QuanTriQuanTriVien /></AdminRoute>} />
          <Route path="/admin/statistics" element={<AdminRoute><QuanTriThongKe /></AdminRoute>} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
