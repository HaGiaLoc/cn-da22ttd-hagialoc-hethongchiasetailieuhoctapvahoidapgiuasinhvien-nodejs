import db from '../config/database.js';

class DanhGiaCauHoiModel {
  // Upvote/Downvote câu hỏi
  static async vote(voteData) {
    const { maSinhVien, maCauHoi, isUpvote } = voteData;
    
    // Kiểm tra đã vote chưa
    const checkQuery = 'SELECT * FROM danhgiacauhoi WHERE maSinhVien = ? AND maCauHoi = ?';
    const [existing] = await db.execute(checkQuery, [maSinhVien, maCauHoi]);

    if (existing.length > 0) {
      // Nếu click lại cùng loại vote thì xóa vote
      const currentUpvote = existing[0].Upvote;
      const currentDownvote = existing[0].Downvote;
      
      if ((isUpvote && currentUpvote) || (!isUpvote && currentDownvote)) {
        // Xóa vote
        const query = 'DELETE FROM danhgiacauhoi WHERE maSinhVien = ? AND maCauHoi = ?';
        const [result] = await db.execute(query, [maSinhVien, maCauHoi]);
        return result.affectedRows > 0;
      } else {
        // Cập nhật vote
        const query = 'UPDATE danhgiacauhoi SET Upvote = ?, Downvote = ? WHERE maSinhVien = ? AND maCauHoi = ?';
        const [result] = await db.execute(query, [isUpvote ? 1 : 0, isUpvote ? 0 : 1, maSinhVien, maCauHoi]);
        return result.affectedRows > 0;
      }
    } else {
      // Tạo vote mới
      const query = 'INSERT INTO danhgiacauhoi (maSinhVien, maCauHoi, Upvote, Downvote) VALUES (?, ?, ?, ?)';
      const [result] = await db.execute(query, [maSinhVien, maCauHoi, isUpvote ? 1 : 0, isUpvote ? 0 : 1]);
      return result.affectedRows > 0;
    }
  }

  // Lấy vote của sinh viên
  static async getByStudentAndQuestion(maSinhVien, maCauHoi) {
    const query = 'SELECT * FROM danhgiacauhoi WHERE maSinhVien = ? AND maCauHoi = ?';
    const [rows] = await db.execute(query, [maSinhVien, maCauHoi]);
    return rows[0];
  }

  // Xóa vote
  static async remove(maSinhVien, maCauHoi) {
    const query = 'DELETE FROM danhgiacauhoi WHERE maSinhVien = ? AND maCauHoi = ?';
    const [result] = await db.execute(query, [maSinhVien, maCauHoi]);
    return result.affectedRows > 0;
  }
}

export default DanhGiaCauHoiModel;
