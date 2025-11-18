import db from '../config/database.js';

class CauTraLoiModel {
  // Tạo câu trả lời mới
  static async create(cauTraLoiData) {
    const { maSinhVien, maCauHoi, noiDungCTL } = cauTraLoiData;
    const query = `
      INSERT INTO cautraloi (maSinhVien, maCauHoi, noiDungCTL, ChapNhan)
      VALUES (?, ?, ?, 0)
    `;
    const [result] = await db.execute(query, [maSinhVien, maCauHoi, noiDungCTL]);
    return result.insertId;
  }

  // Lấy câu trả lời theo câu hỏi
  static async getByQuestion(maCauHoi) {
    const query = `
      SELECT ct.*, s.hoTenSV, s.avatarURL,
             COALESCE(SUM(d.Upvote - d.Downvote), 0) as votes
      FROM cautraloi ct
      LEFT JOIN sinhvien s ON ct.maSinhVien = s.maSinhVien
      LEFT JOIN danhgiacautraloi d ON ct.maCauTraLoi = d.maCauTraLoi
      WHERE ct.maCauHoi = ?
      GROUP BY ct.maCauTraLoi
      ORDER BY ct.ChapNhan DESC, votes DESC, ct.ngayTraLoi DESC
    `;
    const [rows] = await db.execute(query, [maCauHoi]);
    return rows;
  }

  // Chấp nhận câu trả lời
  static async accept(id, maCauHoi) {
    // Bỏ chấp nhận các câu trả lời khác của câu hỏi này
    await db.execute('UPDATE cautraloi SET ChapNhan = 0 WHERE maCauHoi = ?', [maCauHoi]);
    
    // Chấp nhận câu trả lời mới
    const query = 'UPDATE cautraloi SET ChapNhan = 1 WHERE maCauTraLoi = ?';
    const [result] = await db.execute(query, [id]);
    
    // Cập nhật trạng thái câu hỏi
    if (result.affectedRows > 0) {
      await db.execute('UPDATE cauhoi SET trangThaiCH = ? WHERE maCauHoi = ?', ['answered', maCauHoi]);
    }
    
    return result.affectedRows > 0;
  }

  // Xóa câu trả lời
  static async delete(id) {
    const query = 'DELETE FROM cautraloi WHERE maCauTraLoi = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

export default CauTraLoiModel;
