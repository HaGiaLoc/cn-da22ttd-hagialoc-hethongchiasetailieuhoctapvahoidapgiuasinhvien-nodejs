import bcrypt from 'bcryptjs';
import SinhVienModel from '../models/sinhvien.model.js';
import QuanTriVienModel from '../models/quantrivien.model.js';
import { generateToken } from '../config/jwt.js';

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
}

export default AuthService;
