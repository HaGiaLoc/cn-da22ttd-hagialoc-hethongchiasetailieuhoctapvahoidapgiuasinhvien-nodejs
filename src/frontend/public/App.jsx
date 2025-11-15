import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Pages
import TrangChu from './pages/TrangChu'
import DanhSachTaiLieu from './pages/DanhSachTaiLieu'
import ChiTietTaiLieu from './pages/ChiTietTaiLieu'
import TaiLenTaiLieu from './pages/TaiLenTaiLieu'
import TaiLieuCuaToi from './pages/TaiLieuCuaToi'
import HoiDap from './pages/HoiDap'
import ChiTietCauHoi from './pages/ChiTietCauHoi'
import DatCauHoi from './pages/DatCauHoi'
import CauHoiCuaToi from './pages/CauHoiCuaToi'
import DangNhap from './pages/DangNhap'
import DangKy from './pages/DangKy'
import HoSo from './pages/HoSo'
import ChinhSuaHoSo from './pages/ChinhSuaHoSo'
import DoiMatKhau from './pages/DoiMatKhau'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<TrangChu />} />
          <Route path="/documents" element={<DanhSachTaiLieu />} />
          <Route path="/documents/:id" element={<ChiTietTaiLieu />} />
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
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
