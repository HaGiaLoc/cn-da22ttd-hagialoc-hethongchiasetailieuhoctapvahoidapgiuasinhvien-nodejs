import db from '../config/database.js';

class MonModel {
  // Lấy tất cả môn học
  static async getAll(maNganh = null) {
    let query = `
      SELECT m.*, n.tenNganh
      FROM mon m
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
    `;
    const params = [];

    if (maNganh) {
      query += ' WHERE m.maNganh = ?';
      params.push(maNganh);
    }

    query += ' ORDER BY m.tenMon ASC';
    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Lấy môn học theo ID
  static async getById(id) {
    const query = `
      SELECT m.*, n.tenNganh
      FROM mon m
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      WHERE m.maMon = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Tạo môn học mới
  static async create(monData) {
    const { maNganh, tenMon } = monData;
    const query = 'INSERT INTO mon (maNganh, tenMon) VALUES (?, ?)';
    const [result] = await db.execute(query, [maNganh, tenMon]);
    return result.insertId;
  }

  // Cập nhật môn học
  static async update(id, monData) {
    const { maNganh, tenMon } = monData;
    const query = 'UPDATE mon SET maNganh = ?, tenMon = ? WHERE maMon = ?';
    const [result] = await db.execute(query, [maNganh, tenMon, id]);
    return result.affectedRows > 0;
  }

  // Xóa môn học
  static async delete(id) {
    const query = 'DELETE FROM mon WHERE maMon = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

export default MonModel;
