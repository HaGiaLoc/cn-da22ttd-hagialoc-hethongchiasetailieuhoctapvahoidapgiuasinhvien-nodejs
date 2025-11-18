import db from '../config/database.js';

class QuanTriVienModel {
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

  // Tạo quản trị viên mới
  static async create(adminData) {
    const { hoTenQTV, emailQTV, matKhauQTV } = adminData;
    const query = 'INSERT INTO quantrivien (hoTenQTV, emailQTV, matKhauQTV) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [hoTenQTV, emailQTV, matKhauQTV]);
    return result.insertId;
  }

  // Cập nhật mật khẩu
  static async updatePassword(id, newPassword) {
    const query = 'UPDATE quantrivien SET matKhauQTV = ? WHERE maQuanTriVien = ?';
    const [result] = await db.execute(query, [newPassword, id]);
    return result.affectedRows > 0;
  }
}

export default QuanTriVienModel;
