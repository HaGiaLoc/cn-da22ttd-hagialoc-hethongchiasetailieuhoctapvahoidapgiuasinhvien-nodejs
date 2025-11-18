import db from '../config/database.js';

class DanhGiaCauTraLoiModel {
  // Upvote/Downvote câu trả lời
  static async vote(voteData) {
    const { maSinhVien, maCauTraLoi, isUpvote } = voteData;
    
    // Kiểm tra đã vote chưa
    const checkQuery = 'SELECT * FROM danhgiacautraloi WHERE maSinhVien = ? AND maCauTraLoi = ?';
    const [existing] = await db.execute(checkQuery, [maSinhVien, maCauTraLoi]);

    if (existing.length > 0) {
      // Nếu click lại cùng loại vote thì xóa vote
      const currentUpvote = existing[0].Upvote;
      const currentDownvote = existing[0].Downvote;
      
      if ((isUpvote && currentUpvote) || (!isUpvote && currentDownvote)) {
        // Xóa vote
        const query = 'DELETE FROM danhgiacautraloi WHERE maSinhVien = ? AND maCauTraLoi = ?';
        const [result] = await db.execute(query, [maSinhVien, maCauTraLoi]);
        return result.affectedRows > 0;
      } else {
        // Cập nhật vote
        const query = 'UPDATE danhgiacautraloi SET Upvote = ?, Downvote = ? WHERE maSinhVien = ? AND maCauTraLoi = ?';
        const [result] = await db.execute(query, [isUpvote ? 1 : 0, isUpvote ? 0 : 1, maSinhVien, maCauTraLoi]);
        return result.affectedRows > 0;
      }
    } else {
      // Tạo vote mới
      const query = 'INSERT INTO danhgiacautraloi (maSinhVien, maCauTraLoi, Upvote, Downvote) VALUES (?, ?, ?, ?)';
      const [result] = await db.execute(query, [maSinhVien, maCauTraLoi, isUpvote ? 1 : 0, isUpvote ? 0 : 1]);
      return result.affectedRows > 0;
    }
  }

  // Lấy vote của sinh viên
  static async getByStudentAndAnswer(maSinhVien, maCauTraLoi) {
    const query = 'SELECT * FROM danhgiacautraloi WHERE maSinhVien = ? AND maCauTraLoi = ?';
    const [rows] = await db.execute(query, [maSinhVien, maCauTraLoi]);
    return rows[0];
  }

  // Xóa vote
  static async remove(maSinhVien, maCauTraLoi) {
    const query = 'DELETE FROM danhgiacautraloi WHERE maSinhVien = ? AND maCauTraLoi = ?';
    const [result] = await db.execute(query, [maSinhVien, maCauTraLoi]);
    return result.affectedRows > 0;
  }
}

export default DanhGiaCauTraLoiModel;
