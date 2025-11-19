import db from '../config/database.js';

class DanhSachTagModel {
  // Thêm tag cho câu hỏi
  static async addTagToQuestion(maTag, maCauHoi) {
    const query = 'INSERT INTO danhsachtag (maTag, maCauHoi) VALUES (?, ?)';
    const [result] = await db.execute(query, [maTag, maCauHoi]);
    return result.affectedRows > 0;
  }

  // Lấy tất cả tags của câu hỏi
  static async getTagsByQuestion(maCauHoi) {
    const query = `
      SELECT t.*
      FROM tag t
      INNER JOIN danhsachtag dst ON t.maTag = dst.maTag
      WHERE dst.maCauHoi = ?
      ORDER BY t.tenTag
    `;
    const [rows] = await db.execute(query, [maCauHoi]);
    return rows;
  }

  // Lấy tất cả câu hỏi có tag
  static async getQuestionsByTag(maTag, limit = 20, offset = 0) {
    const query = `
      SELECT c.*, s.hoTenSV, s.avatarURL, m.tenMon,
             COUNT(DISTINCT ct.maCauTraLoi) as totalAnswers
      FROM cauhoi c
      INNER JOIN danhsachtag dst ON c.maCauHoi = dst.maCauHoi
      LEFT JOIN sinhvien s ON c.maSinhVien = s.maSinhVien
      LEFT JOIN mon m ON c.maMon = m.maMon
      LEFT JOIN cautraloi ct ON c.maCauHoi = ct.maCauHoi
      WHERE dst.maTag = ?
      GROUP BY c.maCauHoi
      ORDER BY c.ngayDatCH DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const [rows] = await db.execute(query, [maTag]);
    return rows;
  }

  // Xóa tất cả tags của câu hỏi
  static async removeAllTagsFromQuestion(maCauHoi) {
    const query = 'DELETE FROM danhsachtag WHERE maCauHoi = ?';
    const [result] = await db.execute(query, [maCauHoi]);
    return result.affectedRows > 0;
  }

  // Xóa tag khỏi câu hỏi
  static async removeTagFromQuestion(maTag, maCauHoi) {
    const query = 'DELETE FROM danhsachtag WHERE maTag = ? AND maCauHoi = ?';
    const [result] = await db.execute(query, [maTag, maCauHoi]);
    return result.affectedRows > 0;
  }

  // Cập nhật tags cho câu hỏi
  static async updateQuestionTags(maCauHoi, tagIds) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Xóa tất cả tags cũ
      await connection.execute('DELETE FROM danhsachtag WHERE maCauHoi = ?', [maCauHoi]);

      // Thêm tags mới
      if (tagIds && tagIds.length > 0) {
        for (const maTag of tagIds) {
          await connection.execute('INSERT INTO danhsachtag (maTag, maCauHoi) VALUES (?, ?)', [maTag, maCauHoi]);
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default DanhSachTagModel;
