import db from '../config/database.js';

class TaiLieuModel {
  // Tạo tài liệu mới
  static async create(taiLieuData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { maSinhVien, maMon, maLoai, tieuDeTL, URL, fileSizes, DinhDang } = taiLieuData;
      
      // Insert vào bảng tailieu
      const query = `
        INSERT INTO tailieu (maLoai, maSinhVien, tieuDeTL, URL, fileSizes, DinhDang, trangThaiTL, soLanLuu, luotTaiXuong)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, 0)
      `;
      const [result] = await connection.execute(query, [maLoai, maSinhVien, tieuDeTL, URL, fileSizes, DinhDang]);
      const maTaiLieu = result.insertId;

      // Insert vào bảng danhsachtailieu
      if (maMon) {
        const dsQuery = 'INSERT INTO danhsachtailieu (maMon, maTaiLieu) VALUES (?, ?)';
        await connection.execute(dsQuery, [maMon, maTaiLieu]);
      }

      await connection.commit();
      return maTaiLieu;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy tất cả tài liệu đã được duyệt
  static async getAll(filters = {}, limit = 20, offset = 0) {
    let query = `
      SELECT t.maTaiLieu, t.maLoai, t.maSinhVien, t.tieuDeTL, t.URL, 
             t.fileSizes, t.DinhDang, t.trangThaiTL, t.soLanLuu, 
             t.luotTaiXuong, t.ngayChiaSe,
             MAX(s.hoTenSV) as hoTenSV, 
             MAX(s.avatarURL) as avatarURL, 
             MAX(l.loaiTaiLieu) as loaiTaiLieu,
             MAX(m.tenMon) as tenMon, 
             MAX(n.tenNganh) as tenNganh
      FROM tailieu t
      LEFT JOIN sinhvien s ON t.maSinhVien = s.maSinhVien
      LEFT JOIN loaitailieu l ON t.maLoai = l.maLoai
      LEFT JOIN danhsachtailieu dst ON t.maTaiLieu = dst.maTaiLieu
      LEFT JOIN mon m ON dst.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      WHERE t.trangThaiTL = 'approved'
    `;
    const params = [];

    if (filters.maMon) {
      query += ' AND m.maMon = ?';
      params.push(filters.maMon);
    }
    if (filters.maNganh) {
      query += ' AND n.maNganh = ?';
      params.push(filters.maNganh);
    }
    if (filters.maLoai) {
      query += ' AND t.maLoai = ?';
      params.push(filters.maLoai);
    }
    if (filters.search) {
      query += ' AND t.tieuDeTL LIKE ?';
      params.push(`%${filters.search}%`);
    }

    query += ' GROUP BY t.maTaiLieu ORDER BY t.ngayChiaSe DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Lấy chi tiết tài liệu
  static async getById(id) {
    const query = `
      SELECT t.*, s.hoTenSV, s.avatarURL, l.loaiTaiLieu,
             m.tenMon, n.tenNganh
      FROM tailieu t
      LEFT JOIN sinhvien s ON t.maSinhVien = s.maSinhVien
      LEFT JOIN loaitailieu l ON t.maLoai = l.maLoai
      LEFT JOIN danhsachtailieu dst ON t.maTaiLieu = dst.maTaiLieu
      LEFT JOIN mon m ON dst.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      WHERE t.maTaiLieu = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Tăng lượt tải xuống
  static async incrementDownload(id) {
    const query = 'UPDATE tailieu SET luotTaiXuong = luotTaiXuong + 1 WHERE maTaiLieu = ?';
    await db.execute(query, [id]);
  }

  // Tăng số lần lưu
  static async incrementSave(id) {
    const query = 'UPDATE tailieu SET soLanLuu = soLanLuu + 1 WHERE maTaiLieu = ?';
    await db.execute(query, [id]);
  }

  // Lấy tài liệu của sinh viên
  static async getByStudent(maSinhVien, limit = 20, offset = 0) {
    const query = `
      SELECT t.*
      FROM tailieu t
      WHERE t.maSinhVien = ?
      ORDER BY t.ngayChiaSe DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(query, [maSinhVien, limit, offset]);
    return rows;
  }

  // Cập nhật trạng thái tài liệu (admin)
  static async updateStatus(id, status) {
    const query = 'UPDATE tailieu SET trangThaiTL = ? WHERE maTaiLieu = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Xóa tài liệu
  static async delete(id) {
    const query = 'DELETE FROM tailieu WHERE maTaiLieu = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Đếm tổng số tài liệu
  static async count(status = 'approved') {
    // Đếm từ subquery để match với logic getAll() có GROUP BY
    const query = `
      SELECT COUNT(DISTINCT t.maTaiLieu) as total 
      FROM tailieu t
      WHERE t.trangThaiTL = ?
    `;
    const [rows] = await db.execute(query, [status]);
    return rows[0].total;
  }
}

export default TaiLieuModel;
