import db from '../config/database.js';

class LoaiTaiLieuModel {
  // Lấy tất cả loại tài liệu
  static async getAll() {
    const query = 'SELECT * FROM loaitailieu ORDER BY loaiTaiLieu ASC';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Lấy loại tài liệu theo ID
  static async getById(id) {
    const query = 'SELECT * FROM loaitailieu WHERE maLoai = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Tạo loại tài liệu mới
  static async create(loaiTaiLieu) {
    const query = 'INSERT INTO loaitailieu (loaiTaiLieu) VALUES (?)';
    const [result] = await db.execute(query, [loaiTaiLieu]);
    return result.insertId;
  }

  // Cập nhật loại tài liệu
  static async update(id, loaiTaiLieu) {
    const query = 'UPDATE loaitailieu SET loaiTaiLieu = ? WHERE maLoai = ?';
    const [result] = await db.execute(query, [loaiTaiLieu, id]);
    return result.affectedRows > 0;
  }

  // Xóa loại tài liệu
  static async delete(id) {
    const query = 'DELETE FROM loaitailieu WHERE maLoai = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

export default LoaiTaiLieuModel;
