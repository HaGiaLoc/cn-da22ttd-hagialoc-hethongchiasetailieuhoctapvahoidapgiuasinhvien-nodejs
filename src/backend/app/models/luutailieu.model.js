import db from '../config/database.js';

class LuuTaiLieuModel {
  // Lưu tài liệu
  static async save(maSinhVien, maTaiLieu) {
    const query = 'INSERT INTO luutailieu (maSinhVien, maTaiLieu) VALUES (?, ?)';
    const [result] = await db.execute(query, [maSinhVien, maTaiLieu]);
    return result.affectedRows > 0;
  }

  // Bỏ lưu tài liệu
  static async unsave(maSinhVien, maTaiLieu) {
    const query = 'DELETE FROM luutailieu WHERE maSinhVien = ? AND maTaiLieu = ?';
    const [result] = await db.execute(query, [maSinhVien, maTaiLieu]);
    return result.affectedRows > 0;
  }

  // Kiểm tra đã lưu chưa
  static async isSaved(maSinhVien, maTaiLieu) {
    const query = 'SELECT * FROM luutailieu WHERE maSinhVien = ? AND maTaiLieu = ?';
    const [rows] = await db.execute(query, [maSinhVien, maTaiLieu]);
    return rows.length > 0;
  }

  // Lấy tài liệu đã lưu của sinh viên
  static async getSavedDocuments(maSinhVien, limit = 20, offset = 0) {
    const query = `
      SELECT t.maTaiLieu, t.maLoai, t.maDinhDang, t.maSinhVien, 
             t.tieuDeTL, t.ngayChiaSe, t.trangThaiTL, t.filePath, 
             t.fileSizes, t.soLanLuu, t.luotTaiXuong,
             ANY_VALUE(s.hoTenSV) as hoTenSV, 
             MAX(l.ngayLuu) as ngayLuu
      FROM luutailieu l
      LEFT JOIN tailieu t ON l.maTaiLieu = t.maTaiLieu
      LEFT JOIN sinhvien s ON t.maSinhVien = s.maSinhVien
      WHERE l.maSinhVien = ?
      GROUP BY t.maTaiLieu, t.maLoai, t.maDinhDang, t.maSinhVien, 
               t.tieuDeTL, t.ngayChiaSe, t.trangThaiTL, t.filePath, 
               t.fileSizes, t.soLanLuu, t.luotTaiXuong
      ORDER BY ngayLuu DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const [rows] = await db.execute(query, [maSinhVien]);
    return rows;
  }
}

export default LuuTaiLieuModel;
