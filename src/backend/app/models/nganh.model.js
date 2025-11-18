import db from '../config/database.js';

class NganhModel {
  // Lấy tất cả ngành
  static async getAll() {
    const query = 'SELECT * FROM nganh ORDER BY tenNganh ASC';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Lấy ngành theo ID
  static async getById(id) {
    const query = 'SELECT * FROM nganh WHERE maNganh = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Tạo ngành mới
  static async create(tenNganh) {
    const query = 'INSERT INTO nganh (tenNganh) VALUES (?)';
    const [result] = await db.execute(query, [tenNganh]);
    return result.insertId;
  }

  // Cập nhật ngành
  static async update(id, tenNganh) {
    const query = 'UPDATE nganh SET tenNganh = ? WHERE maNganh = ?';
    const [result] = await db.execute(query, [tenNganh, id]);
    return result.affectedRows > 0;
  }

  // Xóa ngành
  static async delete(id) {
    const query = 'DELETE FROM nganh WHERE maNganh = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

export default NganhModel;
