import db from '../config/database.js';

class SinhVienModel {
  // Tạo sinh viên mới
  static async create(sinhVienData) {
    const { hoTenSV, emailSV, matKhauSV, truongHoc, avatarURL } = sinhVienData;
    const query = `
      INSERT INTO sinhvien (hoTenSV, emailSV, matKhauSV, truongHoc, avatarURL)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [hoTenSV, emailSV, matKhauSV, truongHoc, avatarURL]);
    return result.insertId;
  }

  // Tìm sinh viên theo email
  static async findByEmail(email) {
    const query = 'SELECT * FROM sinhvien WHERE emailSV = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  // Tìm sinh viên theo ID
  static async findById(id) {
    const query = 'SELECT maSinhVien, hoTenSV, emailSV, truongHoc, avatarURL, ngayTao FROM sinhvien WHERE maSinhVien = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Tìm sinh viên theo ID (bao gồm mật khẩu - chỉ dùng cho authentication)
  static async findByIdWithPassword(id) {
    const query = 'SELECT * FROM sinhvien WHERE maSinhVien = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Cập nhật thông tin sinh viên
  static async update(id, updateData) {
    const { hoTenSV, emailSV, truongHoc, avatarURL } = updateData;
    
    // Nếu có avatarURL thì update, nếu không thì giữ nguyên
    let query, params;
    if (avatarURL !== undefined) {
      query = `
        UPDATE sinhvien 
        SET hoTenSV = ?, emailSV = ?, truongHoc = ?, avatarURL = ?
        WHERE maSinhVien = ?
      `;
      params = [hoTenSV, emailSV, truongHoc, avatarURL, id];
    } else {
      query = `
        UPDATE sinhvien 
        SET hoTenSV = ?, emailSV = ?, truongHoc = ?
        WHERE maSinhVien = ?
      `;
      params = [hoTenSV, emailSV, truongHoc, id];
    }
    
    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  // Cập nhật trạng thái tài khoản
  static async updateStatus(id, status) {
    const query = 'UPDATE sinhvien SET trangThaiTK = ? WHERE maSinhVien = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Đổi mật khẩu
  static async updatePassword(id, newPassword) {
    const query = 'UPDATE sinhvien SET matKhauSV = ? WHERE maSinhVien = ?';
    const [result] = await db.execute(query, [newPassword, id]);
    return result.affectedRows > 0;
  }

  // Lấy danh sách tất cả sinh viên (cho admin)
  static async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT maSinhVien, hoTenSV, emailSV, truongHoc, avatarURL, ngayTao, trangThaiTK
      FROM sinhvien
      ORDER BY ngayTao DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Đếm tổng số sinh viên
  static async count() {
    const query = 'SELECT COUNT(*) as total FROM sinhvien';
    const [rows] = await db.execute(query);
    return rows[0].total;
  }

  // Xóa sinh viên
  static async delete(id) {
    const query = 'DELETE FROM sinhvien WHERE maSinhVien = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

export default SinhVienModel;
