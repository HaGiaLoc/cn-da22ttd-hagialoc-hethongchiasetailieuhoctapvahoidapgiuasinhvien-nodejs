import db from '../config/database.js';

class TagModel {
  // Tạo tag mới
  static async create(tenTag) {
    const query = 'INSERT INTO tag (tenTag) VALUES (?)';
    const [result] = await db.execute(query, [tenTag]);
    return result.insertId;
  }

  // Tìm tag theo tên
  static async findByName(tenTag) {
    const query = 'SELECT * FROM tag WHERE tenTag = ?';
    const [rows] = await db.execute(query, [tenTag]);
    return rows[0];
  }

  // Tìm hoặc tạo tag
  static async findOrCreate(tenTag) {
    const existing = await this.findByName(tenTag);
    if (existing) {
      return existing.maTag;
    }
    return await this.create(tenTag);
  }

  // Lấy tất cả tags
  static async getAll() {
    const query = 'SELECT * FROM tag ORDER BY tenTag';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Lấy tags phổ biến
  static async getPopular(limit = 10) {
    const query = `
      SELECT t.*, COUNT(dst.maCauHoi) as usageCount
      FROM tag t
      LEFT JOIN danhsachtag dst ON t.maTag = dst.maTag
      GROUP BY t.maTag
      ORDER BY usageCount DESC
      LIMIT ?
    `;
    const [rows] = await db.execute(query, [limit]);
    return rows;
  }

  // Xóa tag
  static async delete(maTag) {
    const query = 'DELETE FROM tag WHERE maTag = ?';
    const [result] = await db.execute(query, [maTag]);
    return result.affectedRows > 0;
  }
}

export default TagModel;
