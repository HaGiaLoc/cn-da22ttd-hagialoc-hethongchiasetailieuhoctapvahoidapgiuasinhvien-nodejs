import bcrypt from 'bcryptjs';
import SinhVienModel from '../models/sinhvien.model.js';
import QuanTriVienModel from '../models/quantrivien.model.js';
import { generateToken } from '../config/jwt.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to convert absolute path to relative path from backend root
const getRelativePath = (absolutePath) => {
  if (!absolutePath) return absolutePath;
  // If already relative or URL, return as is
  if (!path.isAbsolute(absolutePath) || absolutePath.startsWith('http')) return absolutePath;
  const backendRoot = path.join(__dirname, '../..');
  const relativePath = path.relative(backendRoot, absolutePath);
  // Convert Windows backslashes to forward slashes for consistency
  return relativePath.replace(/\\/g, '/');
};

class AuthService {
  // Đăng ký sinh viên
  static async register(userData) {
    const { email, password, hoTenSV } = userData;

    // Kiểm tra email đã tồn tại
    const existing = await SinhVienModel.findByEmail(email);
    if (existing) {
      throw new Error('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo sinh viên mới
    const maSinhVien = await SinhVienModel.create({
      emailSV: email,
      matKhauSV: hashedPassword,
      hoTenSV,
      truongHoc: null,
      avatarPath: ''
    });

    // Lấy thông tin sinh viên
    const student = await SinhVienModel.findById(maSinhVien);

    // Tạo token
    const token = generateToken({
      id: student.maSinhVien,
      email: student.emailSV,
      role: 'student'
    });

    return { student, token };
  }

  // Đăng nhập
  static async login(email, password) {
    // Kiểm tra admin
    const admin = await QuanTriVienModel.findByEmail(email);
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.matKhauQTV);
      if (!isMatch) {
        throw new Error('Email hoặc mật khẩu không chính xác');
      }

      const token = generateToken({
        id: admin.maQuanTriVien,
        email: admin.emailQTV,
        role: 'admin'
      });

      return { user: admin, token, role: 'admin' };
    }

    // Kiểm tra sinh viên
    const student = await SinhVienModel.findByEmail(email);
    if (!student) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(password, student.matKhauSV);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const token = generateToken({
      id: student.maSinhVien,
      email: student.emailSV,
      role: 'student'
    });

    return { user: student, token, role: 'student' };
  }

  // Đổi mật khẩu
  static async changePassword(userId, role, oldPassword, newPassword) {
    let user;
    
    if (role === 'admin') {
      user = await QuanTriVienModel.findByIdWithPassword(userId);
    } else {
      user = await SinhVienModel.findByIdWithPassword(userId);
    }

    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    const passwordField = role === 'admin' ? user.matKhauQTV : user.matKhauSV;
    const isMatch = await bcrypt.compare(oldPassword, passwordField);
    
    if (!isMatch) {
      throw new Error('Mật khẩu cũ không chính xác');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    if (role === 'admin') {
      await QuanTriVienModel.updatePassword(userId, hashedPassword);
    } else {
      await SinhVienModel.updatePassword(userId, hashedPassword);
    }

    return true;
  }

  // Cập nhật thông tin người dùng (sinh viên)
  static async updateProfile(userId, role, updateData) {
    if (role === 'admin') {
      throw new Error('Not implemented for admin');
    }

    // Handle avatar file upload
    let avatarPath = undefined;
    if (updateData.avatarFile) {
      // Convert absolute path from multer to relative path
      avatarPath = getRelativePath(updateData.avatarFile.path);
    } else if (updateData.avatar && !updateData.avatar.startsWith('data:')) {
      // If avatar is provided but not base64, use it (for backward compatibility)
      avatarPath = getRelativePath(updateData.avatar);
    }

    // Map frontend fields to model fields
    const payload = {
      hoTenSV: updateData.hoTenSinhVien || updateData.name || undefined,
      emailSV: updateData.email || undefined,
      truongHoc: updateData.truongHoc || undefined,
      avatarPath: avatarPath,
      maNganh: updateData.maNganh || updateData.nganh || undefined
    };

    const updated = await SinhVienModel.update(userId, payload);
    if (!updated) throw new Error('Không thể cập nhật hồ sơ');

    const student = await SinhVienModel.findById(userId);
    return student;
  }
}

export default AuthService;
