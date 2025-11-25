import db from '../config/database.js';
import TagModel from './tag.model.js';
import DanhSachTagModel from './danhsachtag.model.js';

class CauHoiModel {
  // Tạo câu hỏi mới
  static async create(cauHoiData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { maSinhVien, maMon, tieuDeCH, noiDungCH, tags } = cauHoiData;
      const query = `
        INSERT INTO cauhoi (maSinhVien, maMon, tieuDeCH, noiDungCH, trangThaiCH)
        VALUES (?, ?, ?, ?, 'open')
      `;
      const [result] = await connection.execute(query, [maSinhVien, maMon, tieuDeCH, noiDungCH]);
      const maCauHoi = result.insertId;

      // Xử lý tags nếu có
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          const maTag = await TagModel.findOrCreate(tagName.trim());
          await connection.execute('INSERT INTO danhsachtag (maTag, maCauHoi) VALUES (?, ?)', [maTag, maCauHoi]);
        }
      }

      await connection.commit();
      return maCauHoi;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy tất cả câu hỏi
  static async getAll(filters = {}, limit = 20, offset = 0) {
    // Map possible query params from controller
    if (filters.Mon) filters.maMon = filters.Mon;
    if (filters.Nganh) filters.maNganh = filters.Nganh;

    let query = `
      SELECT c.maCauHoi, c.maSinhVien, c.maMon, 
             c.tieuDeCH as tieuDeCauHoi, 
             c.noiDungCH as noiDungCauHoi, 
             c.trangThaiCH as trangThaiCauHoi, 
             c.ngayDatCH as ngayDang,
             c.luotTraLoi,
             0 as luotXem,
             s.hoTenSV, 
             s.avatarPath, 
             m.tenMon, 
             n.tenNganh,
             (SELECT COUNT(*) FROM cautraloi WHERE maCauHoi = c.maCauHoi) as soLuongTraLoi,
             (SELECT COALESCE(SUM(CASE WHEN Upvote = 1 THEN 1 WHEN Downvote = 1 THEN -1 ELSE 0 END), 0) 
              FROM danhgiacauhoi WHERE maCauHoi = c.maCauHoi) as votes,
             (SELECT GROUP_CONCAT(DISTINCT t2.tenTag SEPARATOR ',')
              FROM danhsachtag dst2
              LEFT JOIN tag t2 ON dst2.maTag = t2.maTag
              WHERE dst2.maCauHoi = c.maCauHoi) as tags
      FROM cauhoi c
      LEFT JOIN sinhvien s ON c.maSinhVien = s.maSinhVien
      LEFT JOIN mon m ON c.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      WHERE 1=1
    `;
    const params = [];
    // By default exclude questions marked as 'hidden' unless caller explicitly filters by trangThaiCH
    if (!filters.trangThaiCH) {
      query += " AND (c.trangThaiCH IS NULL OR c.trangThaiCH <> 'hidden')";
    }

    if (filters.maMon) {
      query += ' AND c.maMon = ?';
      params.push(filters.maMon);
    }
    if (filters.maNganh) {
      query += ' AND m.maNganh = ?';
      params.push(filters.maNganh);
    }
    if (filters.trangThaiCH) {
      query += ' AND c.trangThaiCH = ?';
      params.push(filters.trangThaiCH);
    }
    if (filters.tag) {
      query += ' AND EXISTS (SELECT 1 FROM danhsachtag dst JOIN tag t ON dst.maTag = t.maTag WHERE dst.maCauHoi = c.maCauHoi AND t.tenTag = ?)';
      params.push(filters.tag);
    }
    if (filters.search) {
      query += ' AND (c.tieuDeCH LIKE ? OR c.noiDungCH LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ` ORDER BY c.ngayDatCH DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Lấy chi tiết câu hỏi
  static async getById(id) {
    const query = `
      SELECT c.maCauHoi, c.maSinhVien, c.maMon, c.tieuDeCH, 
             c.noiDungCH, c.trangThaiCH, c.ngayDatCH,
             s.hoTenSV, 
             s.avatarPath, 
             m.tenMon, 
             n.tenNganh,
             (SELECT COUNT(*) FROM cautraloi WHERE maCauHoi = c.maCauHoi) as totalAnswers,
             (SELECT COALESCE(SUM(CASE WHEN Upvote = 1 THEN 1 WHEN Downvote = 1 THEN -1 ELSE 0 END), 0) 
              FROM danhgiacauhoi WHERE maCauHoi = c.maCauHoi) as votes
      FROM cauhoi c
      LEFT JOIN sinhvien s ON c.maSinhVien = s.maSinhVien
      LEFT JOIN mon m ON c.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      WHERE c.maCauHoi = ?
    `;
    const [rows] = await db.execute(query, [id]);
    
    if (rows[0]) {
      // Lấy tags của câu hỏi
      const tags = await DanhSachTagModel.getTagsByQuestion(id);
      rows[0].tags = tags;
    }
    
    return rows[0];
  }

  // Lấy câu hỏi của sinh viên
  static async getByStudent(maSinhVien, limit = 20, offset = 0) {
    const query = `
      SELECT c.*, COUNT(DISTINCT ct.maCauTraLoi) as totalAnswers
      FROM cauhoi c
      LEFT JOIN cautraloi ct ON c.maCauHoi = ct.maCauHoi
      WHERE c.maSinhVien = ?
      GROUP BY c.maCauHoi
      ORDER BY c.ngayDatCH DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const [rows] = await db.execute(query, [maSinhVien]);
    return rows;
  }

  // Cập nhật trạng thái câu hỏi
  static async updateStatus(id, status) {
    const query = 'UPDATE cauhoi SET trangThaiCH = ? WHERE maCauHoi = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Xóa câu hỏi
  static async delete(id) {
    const query = 'DELETE FROM cauhoi WHERE maCauHoi = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Đếm tổng số câu hỏi (hỗ trợ filter giống getAll)
  static async count(filters = {}) {
    // Map controller params
    if (filters.Mon) filters.maMon = filters.Mon;
    if (filters.Nganh) filters.maNganh = filters.Nganh;

    let query = `SELECT COUNT(*) as total FROM cauhoi c LEFT JOIN mon m ON c.maMon = m.maMon WHERE 1=1`;
    const params = [];

    if (!filters.trangThaiCH) {
      query += " AND (c.trangThaiCH IS NULL OR c.trangThaiCH <> 'hidden')";
    }
    if (filters.maMon) {
      query += ' AND c.maMon = ?';
      params.push(filters.maMon);
    }
    if (filters.maNganh) {
      query += ' AND m.maNganh = ?';
      params.push(filters.maNganh);
    }
    if (filters.trangThaiCH) {
      query += ' AND c.trangThaiCH = ?';
      params.push(filters.trangThaiCH);
    }
    if (filters.search) {
      query += ' AND (c.tieuDeCH LIKE ? OR c.noiDungCH LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].total;
  }
}

export default CauHoiModel;
