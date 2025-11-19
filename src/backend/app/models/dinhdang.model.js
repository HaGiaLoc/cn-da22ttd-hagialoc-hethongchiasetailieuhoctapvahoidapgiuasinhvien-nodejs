import db from '../config/database.js';

class DinhDangModel {
  // Lấy tất cả định dạng
  static async getAll() {
    const query = 'SELECT * FROM dinhdang ORDER BY tenDinhDang ASC';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Lấy định dạng theo ID
  static async getById(id) {
    const query = 'SELECT * FROM dinhdang WHERE maDinhDang = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Lấy định dạng theo tên
  static async getByName(tenDinhDang) {
    const query = 'SELECT * FROM dinhdang WHERE tenDinhDang = ?';
    const [rows] = await db.execute(query, [tenDinhDang]);
    return rows[0];
  }

  // Tạo định dạng mới
  static async create(tenDinhDang) {
    const query = 'INSERT INTO dinhdang (tenDinhDang) VALUES (?)';
    const [result] = await db.execute(query, [tenDinhDang]);
    return result.insertId;
  }

  // Cập nhật định dạng
  static async update(id, tenDinhDang) {
    const query = 'UPDATE dinhdang SET tenDinhDang = ? WHERE maDinhDang = ?';
    const [result] = await db.execute(query, [tenDinhDang, id]);
    return result.affectedRows > 0;
  }

  // Xóa định dạng
  static async delete(id) {
    const query = 'DELETE FROM dinhdang WHERE maDinhDang = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

export default DinhDangModel;
