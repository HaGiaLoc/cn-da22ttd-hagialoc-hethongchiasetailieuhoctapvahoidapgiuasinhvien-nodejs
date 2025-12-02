import db from '../config/database.js';

class CauTraLoiModel {
  // Tạo câu trả lời mới
  static async create(cauTraLoiData) {
    const { maSinhVien, maCauHoi, noiDungCTL } = cauTraLoiData;
    const query = `
      INSERT INTO cautraloi (maSinhVien, maCauHoi, noiDungCTL, trangThaiCTL)
      VALUES (?, ?, ?, 'show')
    `;
    const [result] = await db.execute(query, [maSinhVien, maCauHoi, noiDungCTL]);
    return result.insertId;
  }

  // Lấy câu trả lời theo câu hỏi
  static async getByQuestion(maCauHoi) {
    const query = `
      SELECT ct.*, s.hoTenSV, s.avatarPath,
             COALESCE(SUM(CAST(d.Upvote AS SIGNED) - CAST(d.Downvote AS SIGNED)), 0) as votes
      FROM cautraloi ct
      LEFT JOIN sinhvien s ON ct.maSinhVien = s.maSinhVien
      LEFT JOIN danhgiacautraloi d ON ct.maCauTraLoi = d.maCauTraLoi
      WHERE ct.maCauHoi = ?
      GROUP BY ct.maCauTraLoi
      ORDER BY (CASE WHEN ct.trangThaiCTL = 'show' THEN 1 ELSE 0 END) DESC, votes DESC, ct.ngayTraLoi DESC
    `;
    const [rows] = await db.execute(query, [maCauHoi]);
    return rows;
  }

  // Lấy câu trả lời của một sinh viên
  static async getByStudent(maSinhVien, limit = 20, offset = 0) {
    const query = `
      SELECT ct.*, q.tieuDeCH, q.maCauHoi,
             COALESCE(SUM(CAST(d.Upvote AS SIGNED) - CAST(d.Downvote AS SIGNED)), 0) as votes
      FROM cautraloi ct
      LEFT JOIN cauhoi q ON ct.maCauHoi = q.maCauHoi
      LEFT JOIN danhgiacautraloi d ON ct.maCauTraLoi = d.maCauTraLoi
      WHERE ct.maSinhVien = ?
      GROUP BY ct.maCauTraLoi
      ORDER BY ct.ngayTraLoi DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.execute(query, [maSinhVien, parseInt(limit, 10), parseInt(offset, 10)]);
    return rows;
  }

  // Chấp nhận câu trả lời
  static async accept(id, maCauHoi) {
    // Hide other answers
    await db.execute("UPDATE cautraloi SET trangThaiCTL = 'hidden' WHERE maCauHoi = ?", [maCauHoi]);
    
    // Mark chosen answer as shown (accepted)
    const query = "UPDATE cautraloi SET trangThaiCTL = 'show' WHERE maCauTraLoi = ?";
    const [result] = await db.execute(query, [id]);
    
    // Cập nhật trạng thái câu hỏi
    if (result.affectedRows > 0) {
      await db.execute('UPDATE cauhoi SET trangThaiCH = ? WHERE maCauHoi = ?', ['answered', maCauHoi]);
    }
    
    return result.affectedRows > 0;
  }

  // Chấp nhận câu trả lời theo id (tự động xác định maCauHoi)
  static async acceptById(id) {
    // Lấy maCauHoi của câu trả lời
    const [rows] = await db.execute('SELECT maCauHoi FROM cautraloi WHERE maCauTraLoi = ?', [id]);
    const row = rows && rows[0];
    if (!row) return false;
    const maCauHoi = row.maCauHoi;

    // Ẩn tất cả câu trả lời khác của câu hỏi
    await db.execute("UPDATE cautraloi SET trangThaiCTL = 'hidden' WHERE maCauHoi = ?", [maCauHoi]);

    // Hiện câu trả lời này
    const [result] = await db.execute("UPDATE cautraloi SET trangThaiCTL = 'show' WHERE maCauTraLoi = ?", [id]);

    if (result.affectedRows > 0) {
      await db.execute('UPDATE cauhoi SET trangThaiCH = ? WHERE maCauHoi = ?', ['answered', maCauHoi]);
    }

    return result.affectedRows > 0;
  }

  // Cập nhật câu trả lời
  static async update(id, updateData) {
    const { noiDungCTL, trangThaiCTL } = updateData;
    const updates = [];
    const params = [];

    if (noiDungCTL !== undefined) {
      updates.push('noiDungCTL = ?');
      params.push(noiDungCTL);
    }
    if (trangThaiCTL !== undefined) {
      updates.push('trangThaiCTL = ?');
      params.push(trangThaiCTL);
    }

    if (updates.length === 0) {
      return true; // No updates needed
    }

    params.push(id);
    const query = `UPDATE cautraloi SET ${updates.join(', ')} WHERE maCauTraLoi = ?`;
    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  // Cập nhật câu trả lời
  static async update(id, updateData) {
    const { noiDungCTL, trangThaiCTL } = updateData;
    const updates = [];
    const params = [];

    if (noiDungCTL !== undefined) {
      updates.push('noiDungCTL = ?');
      params.push(noiDungCTL);
    }
    if (trangThaiCTL !== undefined) {
      updates.push('trangThaiCTL = ?');
      params.push(trangThaiCTL);
    }

    if (updates.length === 0) {
      return true; // No updates needed
    }

    params.push(id);
    const query = `UPDATE cautraloi SET ${updates.join(', ')} WHERE maCauTraLoi = ?`;
    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  // Cập nhật trạng thái câu trả lời (show/hidden)
  static async updateStatus(id, status) {
    const query = 'UPDATE cautraloi SET trangThaiCTL = ? WHERE maCauTraLoi = ?';
    const [result] = await db.execute(query, [status, id]);
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
