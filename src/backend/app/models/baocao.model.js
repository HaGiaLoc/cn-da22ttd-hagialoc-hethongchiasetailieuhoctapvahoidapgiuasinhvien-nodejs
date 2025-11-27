import db from '../config/database.js';

class BaoCaoModel {
  // Tạo báo cáo mới
  static async create(baoCaoData) {
    const { maSinhVien, lyDo, loaiBaoCao } = baoCaoData;
    const query = `
      INSERT INTO baocaovipham (maSinhVien, lyDo, loaiBaoCao, trangThaiBC, maQuanTriVien)
      VALUES (?, ?, ?, 'pending', 1)
    `;
    const [result] = await db.execute(query, [maSinhVien, lyDo, loaiBaoCao]);
    return result.insertId;
  }

  // Lấy tất cả báo cáo
  static async getAll(status = null, type = null, limit = 20, offset = 0) {
    let query = `
      SELECT b.*, s.hoTenSV, s.emailSV,
             t.maTaiLieu, t.tieuDeTL,
             ch.maCauHoi, ch.tieuDeCH,
             ctl.maCauTraLoi, ctl.noiDungCTL as noiDungTraLoi
      FROM baocaovipham b
      LEFT JOIN sinhvien s ON b.maSinhVien = s.maSinhVien
      LEFT JOIN tailieu t ON b.maTaiLieu = t.maTaiLieu
      LEFT JOIN cauhoi ch ON b.maCauHoi = ch.maCauHoi
      LEFT JOIN cautraloi ctl ON b.maCauTraLoi = ctl.maCauTraLoi
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND b.trangThaiBC = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND b.loaiBaoCao = ?';
      params.push(type);
    }

    query += ` ORDER BY b.ngayBC DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Cập nhật trạng thái báo cáo
  static async updateStatus(id, status) {
    const query = 'UPDATE baocaovipham SET trangThaiBC = ? WHERE maBaoCao = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Xóa báo cáo
  static async delete(id) {
    const query = 'DELETE FROM baocaovipham WHERE maBaoCao = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Đếm tổng số báo cáo
  static async count(status = null) {
    let query = 'SELECT COUNT(*) as total FROM baocaovipham';
    const params = [];

    if (status) {
      query += ' WHERE trangThaiBC = ?';
      params.push(status);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].total;
  }
}

export default BaoCaoModel;
