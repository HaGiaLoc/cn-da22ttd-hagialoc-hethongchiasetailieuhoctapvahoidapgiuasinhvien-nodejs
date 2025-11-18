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
    let query = `
      SELECT c.maCauHoi, c.maSinhVien, c.maMon, c.tieuDeCH, 
             c.noiDungCH, c.trangThaiCH, c.ngayDatCH,
             MAX(s.hoTenSV) as hoTenSV, 
             MAX(s.avatarURL) as avatarURL, 
             MAX(m.tenMon) as tenMon, 
             MAX(n.tenNganh) as tenNganh,
             COUNT(DISTINCT ct.maCauTraLoi) as totalAnswers,
             COALESCE(SUM(CASE WHEN d.Upvote = 1 THEN 1 WHEN d.Downvote = 1 THEN -1 ELSE 0 END), 0) as votes,
             GROUP_CONCAT(DISTINCT t.tenTag SEPARATOR ',') as tags
      FROM cauhoi c
      LEFT JOIN sinhvien s ON c.maSinhVien = s.maSinhVien
      LEFT JOIN mon m ON c.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      LEFT JOIN cautraloi ct ON c.maCauHoi = ct.maCauHoi
      LEFT JOIN danhgiacauhoi d ON c.maCauHoi = d.maCauHoi
      LEFT JOIN danhsachtag dst ON c.maCauHoi = dst.maCauHoi
      LEFT JOIN tag t ON dst.maTag = t.maTag
      WHERE 1=1
    `;
    const params = [];

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
      query += ' AND t.tenTag = ?';
      params.push(filters.tag);
    }
    if (filters.search) {
      query += ' AND (c.tieuDeCH LIKE ? OR c.noiDungCH LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' GROUP BY c.maCauHoi ORDER BY c.ngayDatCH DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Lấy chi tiết câu hỏi
  static async getById(id) {
    const query = `
      SELECT c.maCauHoi, c.maSinhVien, c.maMon, c.tieuDeCH, 
             c.noiDungCH, c.trangThaiCH, c.ngayDatCH,
             MAX(s.hoTenSV) as hoTenSV, 
             MAX(s.avatarURL) as avatarURL, 
             MAX(m.tenMon) as tenMon, 
             MAX(n.tenNganh) as tenNganh,
             COUNT(DISTINCT ct.maCauTraLoi) as totalAnswers,
             COALESCE(SUM(CASE WHEN d.Upvote = 1 THEN 1 WHEN d.Downvote = 1 THEN -1 ELSE 0 END), 0) as votes
      FROM cauhoi c
      LEFT JOIN sinhvien s ON c.maSinhVien = s.maSinhVien
      LEFT JOIN mon m ON c.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      LEFT JOIN cautraloi ct ON c.maCauHoi = ct.maCauHoi
      LEFT JOIN danhgiacauhoi d ON c.maCauHoi = d.maCauHoi
      WHERE c.maCauHoi = ?
      GROUP BY c.maCauHoi
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
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(query, [maSinhVien, limit, offset]);
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

  // Đếm tổng số câu hỏi
  static async count() {
    const query = 'SELECT COUNT(*) as total FROM cauhoi';
    const [rows] = await db.execute(query);
    return rows[0].total;
  }
}

export default CauHoiModel;
