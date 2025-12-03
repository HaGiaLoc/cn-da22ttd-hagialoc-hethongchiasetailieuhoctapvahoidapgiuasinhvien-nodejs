import db from '../config/database.js';

class TaiLieuModel {
  // Tạo tài liệu mới
  static async create(taiLieuData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const { maSinhVien, maMon, maLoai, tieuDeTL, filePath, fileSizes, maDinhDang, trangThaiTL = 'show' } = taiLieuData;

      // Insert vào bảng tailieu
      const query = `
        INSERT INTO tailieu (maLoai, maSinhVien, maDinhDang, tieuDeTL, filePath, fileSizes, trangThaiTL)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      // Normalize bind parameters: mysql2 throws if any are undefined. Use null to represent SQL NULL.
      const params = [maLoai, maSinhVien, maDinhDang, tieuDeTL, filePath, fileSizes, trangThaiTL].map(v => (v === undefined ? null : v));
      const [result] = await connection.execute(query, params);
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
          SELECT t.maTaiLieu, t.maLoai, t.maSinhVien, t.maDinhDang, t.tieuDeTL, t.filePath, 
            t.fileSizes, t.trangThaiTL, t.soLanLuu, 
            t.luotTaiXuong, t.ngayChiaSe,
            MAX(s.hoTenSV) as hoTenSV, 
            MAX(s.avatarPath) as avatarPath, 
            MAX(l.loaiTaiLieu) as loaiTaiLieu,
            MAX(d.tenDinhDang) as tenDinhDang,
            MAX(m.tenMon) as tenMon, 
            MAX(n.tenNganh) as tenNganh
          FROM tailieu t
      LEFT JOIN sinhvien s ON t.maSinhVien = s.maSinhVien
      LEFT JOIN loaitailieu l ON t.maLoai = l.maLoai
      LEFT JOIN dinhdang d ON t.maDinhDang = d.maDinhDang
      LEFT JOIN danhsachtailieu dst ON t.maTaiLieu = dst.maTaiLieu
      LEFT JOIN mon m ON dst.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      WHERE t.trangThaiTL = 'show'
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

    query += ` GROUP BY t.maTaiLieu ORDER BY t.ngayChiaSe DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Lấy tài liệu cho admin (tất cả trạng thái)
    static async getAllForAdmin(status = null, limit = 20, offset = 0) {
      let query = `
          SELECT t.maTaiLieu, t.maLoai, t.maSinhVien, t.maDinhDang, t.tieuDeTL, t.filePath, 
            t.fileSizes, t.trangThaiTL, t.soLanLuu, 
            t.luotTaiXuong as luotTai, t.ngayChiaSe as ngayTai,
            MAX(s.hoTenSV) as hoTenSV, 
            MAX(s.avatarPath) as avatarPath, 
            MAX(l.loaiTaiLieu) as tenLoai,
            MAX(d.tenDinhDang) as tenDinhDang,
            MAX(m.maMon) as maMon,
            MAX(m.tenMon) as tenMon,
            MAX(n.maNganh) as maNganh,
            MAX(n.tenNganh) as tenNganh
          FROM tailieu t
      LEFT JOIN sinhvien s ON t.maSinhVien = s.maSinhVien
      LEFT JOIN loaitailieu l ON t.maLoai = l.maLoai
      LEFT JOIN dinhdang d ON t.maDinhDang = d.maDinhDang
      LEFT JOIN danhsachtailieu dst ON t.maTaiLieu = dst.maTaiLieu
      LEFT JOIN mon m ON dst.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
    `;
    
    const params = [];
    
    if (status) {
      query += ' WHERE t.trangThaiTL = ?';
      params.push(status);
    }

    query += ` GROUP BY t.maTaiLieu ORDER BY t.ngayChiaSe DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [rows] = await db.execute(query, params);
    // Thêm trường luotXem mặc định vì chưa có trong DB
    return rows.map(row => ({ ...row, luotXem: 0 }));
  }

  // Lấy chi tiết tài liệu
  static async getById(id) {
    const query = `
            SELECT t.*, s.hoTenSV, s.avatarPath, l.loaiTaiLieu,
              d.tenDinhDang, m.tenMon, n.tenNganh
      FROM tailieu t
      LEFT JOIN sinhvien s ON t.maSinhVien = s.maSinhVien
      LEFT JOIN loaitailieu l ON t.maLoai = l.maLoai
      LEFT JOIN dinhdang d ON t.maDinhDang = d.maDinhDang
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
      SELECT t.maTaiLieu, t.maLoai, t.maSinhVien, t.maDinhDang, t.tieuDeTL, t.filePath,
        t.fileSizes, t.trangThaiTL, t.soLanLuu, t.luotTaiXuong, t.ngayChiaSe,
        MAX(s.hoTenSV) as hoTenSV,
        MAX(s.avatarPath) as avatarPath,
        MAX(l.loaiTaiLieu) as loaiTaiLieu,
        MAX(d.tenDinhDang) as tenDinhDang,
        MAX(m.tenMon) as tenMon,
        MAX(n.tenNganh) as tenNganh
      FROM tailieu t
      LEFT JOIN sinhvien s ON t.maSinhVien = s.maSinhVien
      LEFT JOIN loaitailieu l ON t.maLoai = l.maLoai
      LEFT JOIN dinhdang d ON t.maDinhDang = d.maDinhDang
      LEFT JOIN danhsachtailieu dst ON t.maTaiLieu = dst.maTaiLieu
      LEFT JOIN mon m ON dst.maMon = m.maMon
      LEFT JOIN nganh n ON m.maNganh = n.maNganh
      WHERE t.maSinhVien = ?
      GROUP BY t.maTaiLieu
      ORDER BY t.ngayChiaSe DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const [rows] = await db.execute(query, [maSinhVien]);
    return rows;
  }

  // Cập nhật trạng thái tài liệu (admin)
  static async updateStatus(id, status) {
    const query = 'UPDATE tailieu SET trangThaiTL = ? WHERE maTaiLieu = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Cập nhật tài liệu
  static async update(id, updateData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { tieuDeTL, trangThaiTL, maLoai, maDinhDang, maMon } = updateData;
      const updates = [];
      const params = [];

      if (tieuDeTL !== undefined) {
        updates.push('tieuDeTL = ?');
        params.push(tieuDeTL);
      }
      if (trangThaiTL !== undefined) {
        updates.push('trangThaiTL = ?');
        params.push(trangThaiTL);
      }
      if (maLoai !== undefined) {
        updates.push('maLoai = ?');
        params.push(maLoai);
      }
      if (maDinhDang !== undefined) {
        updates.push('maDinhDang = ?');
        params.push(maDinhDang);
      }

      // Update tailieu table
      if (updates.length > 0) {
        params.push(id);
        const query = `UPDATE tailieu SET ${updates.join(', ')} WHERE maTaiLieu = ?`;
        await connection.execute(query, params);
      }

      // Update danhsachtailieu if maMon is provided
      if (maMon !== undefined) {
        // Delete existing entries
        await connection.execute('DELETE FROM danhsachtailieu WHERE maTaiLieu = ?', [id]);
        
        // Insert new entry if maMon is not null
        if (maMon) {
          await connection.execute('INSERT INTO danhsachtailieu (maMon, maTaiLieu) VALUES (?, ?)', [maMon, id]);
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

  // Xóa tài liệu
  static async delete(id) {
    const query = 'DELETE FROM tailieu WHERE maTaiLieu = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Đếm tổng số tài liệu
  static async count(status = null) {
    let query = `
      SELECT COUNT(DISTINCT t.maTaiLieu) as total 
      FROM tailieu t
    `;
    const params = [];
    
    if (status) {
      query += ' WHERE t.trangThaiTL = ?';
      params.push(status);
    }
    
    const [rows] = await db.execute(query, params);
    return rows[0].total;
  }
}

export default TaiLieuModel;
