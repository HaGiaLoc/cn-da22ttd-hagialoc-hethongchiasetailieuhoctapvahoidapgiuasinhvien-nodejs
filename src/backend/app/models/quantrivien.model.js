import db from '../config/database.js';
import bcrypt from 'bcryptjs';

class QuanTriVienModel {
  // Lấy tất cả quản trị viên
  static async getAll() {
    const query = 'SELECT maQuanTriVien, hoTenQTV, emailQTV FROM quantrivien ORDER BY maQuanTriVien';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Tìm quản trị viên theo email
  static async findByEmail(email) {
    const query = 'SELECT * FROM quantrivien WHERE emailQTV = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  // Tìm quản trị viên theo ID
  static async findById(id) {
    const query = 'SELECT maQuanTriVien, hoTenQTV, emailQTV FROM quantrivien WHERE maQuanTriVien = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Tìm quản trị viên theo ID (bao gồm mật khẩu - chỉ dùng cho authentication)
  static async findByIdWithPassword(id) {
    const query = 'SELECT * FROM quantrivien WHERE maQuanTriVien = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Tạo quản trị viên mới
  static async create(data) {
    const { email, matKhau, hoTen } = data;
    const hashedPassword = await bcrypt.hash(matKhau, 10);
    
    const query = 'INSERT INTO quantrivien (hoTenQTV, emailQTV, matKhauQTV) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [hoTen, email, hashedPassword]);
    return result.insertId;
  }

  // Cập nhật quản trị viên
  static async update(id, data) {
    const { hoTen, matKhau } = data;
    
    let query, params;
    if (matKhau) {
      const hashedPassword = await bcrypt.hash(matKhau, 10);
      query = 'UPDATE quantrivien SET hoTenQTV = ?, matKhauQTV = ? WHERE maQuanTriVien = ?';
      params = [hoTen, hashedPassword, id];
    } else {
      query = 'UPDATE quantrivien SET hoTenQTV = ? WHERE maQuanTriVien = ?';
      params = [hoTen, id];
    }
    
    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  // Xóa quản trị viên
  static async delete(id) {
    const query = 'DELETE FROM quantrivien WHERE maQuanTriVien = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Cập nhật mật khẩu
  static async updatePassword(id, newPassword) {
    const query = 'UPDATE quantrivien SET matKhauQTV = ? WHERE maQuanTriVien = ?';
    const [result] = await db.execute(query, [newPassword, id]);
    return result.affectedRows > 0;
  }
}

export default QuanTriVienModel;
