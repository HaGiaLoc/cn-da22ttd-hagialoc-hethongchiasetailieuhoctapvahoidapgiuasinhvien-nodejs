import SinhVienModel from '../models/sinhvien.model.js';
import bcrypt from 'bcryptjs';
import TaiLieuModel from '../models/tailieu.model.js';
import CauHoiModel from '../models/cauhoi.model.js';
import BaoCaoModel from '../models/baocao.model.js';
import MonModel from '../models/mon.model.js';
import NganhModel from '../models/nganh.model.js';
import TagModel from '../models/tag.model.js';
import LoaiTaiLieuModel from '../models/loaitailieu.model.js';
import DinhDangModel from '../models/dinhdang.model.js';
import CauTraLoiModel from '../models/cautraloi.model.js';
import QuanTriVienModel from '../models/quantrivien.model.js';
import db from '../config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to convert absolute path to relative path from backend root
const getRelativePath = (absolutePath) => {
  if (!absolutePath) return absolutePath;
  // If already relative or URL, return as is
  if (!path.isAbsolute(absolutePath) || absolutePath.startsWith('http')) return absolutePath;
  const backendRoot = path.join(__dirname, '../..');
  const relativePath = path.relative(backendRoot, absolutePath);
  // Convert Windows backslashes to forward slashes for consistency
  return relativePath.replace(/\\/g, '/');
};

class AdminService {
  // Lấy thống kê dashboard
  static async getDashboardStats() {
    const totalStudents = await SinhVienModel.count();
    const totalDocuments = await TaiLieuModel.count('show');
    const pendingDocuments = await TaiLieuModel.count('hidden');
    const totalQuestions = await CauHoiModel.count();
    const pendingReports = await BaoCaoModel.count('pending');

    return {
      totalStudents,
      totalDocuments,
      pendingDocuments,
      totalQuestions,
      pendingReports
    };
  }

  // Lấy danh sách sinh viên
  static async getStudents(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const students = await SinhVienModel.getAll(limit, offset);
    const total = await SinhVienModel.count();

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Xóa sinh viên
  static async deleteStudent(id) {
    const result = await SinhVienModel.delete(id);
    if (!result) {
      throw new Error('Sinh viên không tồn tại');
    }
    return true;
  }

  // Cập nhật thông tin sinh viên
  static async updateStudent(id, data) {
    // Accept more fields: hoTenSV, emailSV, truongHoc, avatarPath, maNganh
    const updatePayload = {
      hoTenSV: data.hoTenSV,
      emailSV: data.emailSV,
      truongHoc: data.truongHoc,
      avatarPath: data.avatarPath ? getRelativePath(data.avatarPath) : data.avatarPath,
      maNganh: data.maNganh
    };

    const result = await SinhVienModel.update(id, updatePayload);
    if (!result) {
      throw new Error('Sinh viên không tồn tại');
    }

    // If status is provided, update it as well
    if (data.trangThaiTK !== undefined) {
      await SinhVienModel.updateStatus(id, data.trangThaiTK);
    }

    // If password provided, hash and update
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      await SinhVienModel.updatePassword(id, hashed);
    }

    // Return the updated student
    const updated = await SinhVienModel.findById(id);
    return updated;
  }

  // Cập nhật trạng thái tài khoản sinh viên
  static async updateStudentStatus(id, status) {
    const result = await SinhVienModel.updateStatus(id, status);
    if (!result) {
      throw new Error('Sinh viên không tồn tại');
    }
    return true;
  }

  // Lấy tài liệu chờ duyệt
  static async getPendingDocuments(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const documents = await TaiLieuModel.getAllForAdmin('hidden', limit, offset);
    const total = await TaiLieuModel.count('hidden');

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Lấy tất cả tài liệu (bao gồm pending, approved, rejected)
  static async getAllDocuments(status = null, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const documents = await TaiLieuModel.getAllForAdmin(status, limit, offset);
    const total = await TaiLieuModel.count(status || 'show');

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Lấy tất cả báo cáo vi phạm
  static async getAllReports(status = null, type = null, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const reports = await BaoCaoModel.getAll(status, type, limit, offset);
    const total = await BaoCaoModel.count(status);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Duyệt báo cáo vi phạm
  static async approveReport(id) {
    const result = await BaoCaoModel.updateStatus(id, 'approved');
    if (!result) {
      throw new Error('Báo cáo không tồn tại');
    }
    return true;
  }

  // Từ chối báo cáo vi phạm
  static async rejectReport(id) {
    const result = await BaoCaoModel.updateStatus(id, 'rejected');
    if (!result) {
      throw new Error('Báo cáo không tồn tại');
    }
    return true;
  }

  // Xóa báo cáo vi phạm
  static async deleteReport(id) {
    const result = await BaoCaoModel.delete(id);
    if (!result) {
      throw new Error('Báo cáo không tồn tại');
    }
    return true;
  }

  // ===== CATEGORY MANAGEMENT =====
  
  // Môn học
  static async getAllSubjects(maNganh = null) {
    return await MonModel.getAll(maNganh);
  }

  static async createSubject(data) {
    const tenMon = String(data.tenMon || '').trim();
    const maNganh = Number(data.maNganh);

    if (!tenMon || Number.isNaN(maNganh)) {
      throw new Error('Vui lòng nhập đầy đủ tên môn và ngành');
    }

    // Tránh trùng tên môn trong cùng ngành
    const exists = await MonModel.existsInMajor(tenMon, maNganh);
    if (exists) {
      throw new Error('Môn học đã tồn tại trong ngành này');
    }

    return await MonModel.create({ tenMon, maNganh });
  }

  static async updateSubject(id, data) {
    const tenMon = String(data.tenMon || '').trim();
    const maNganh = Number(data.maNganh);

    if (!tenMon || Number.isNaN(maNganh)) {
      throw new Error('Vui lòng nhập đầy đủ tên môn và ngành');
    }

    const exists = await MonModel.existsInMajor(tenMon, maNganh, id);
    if (exists) {
      throw new Error('Môn học đã tồn tại trong ngành này');
    }

    const result = await MonModel.update(id, { tenMon, maNganh });
    if (!result) throw new Error('Môn học không tồn tại');
    return true;
  }

  static async deleteSubject(id) {
    const result = await MonModel.delete(id);
    if (!result) throw new Error('Môn học không tồn tại');
    return true;
  }

  // Ngành
  static async getAllMajors() {
    return await NganhModel.getAll();
  }

  static async createMajor(tenNganh) {
    return await NganhModel.create(tenNganh);
  }

  static async updateMajor(id, tenNganh) {
    const result = await NganhModel.update(id, tenNganh);
    if (!result) throw new Error('Ngành không tồn tại');
    return true;
  }

  static async deleteMajor(id) {
    const result = await NganhModel.delete(id);
    if (!result) throw new Error('Ngành không tồn tại');
    return true;
  }

  // Tags
  static async getAllTags() {
    return await TagModel.getAll();
  }

  static async createTag(tenTag) {
    return await TagModel.create(tenTag);
  }

  static async updateTag(id, tenTag) {
    const result = await TagModel.update(id, tenTag);
    if (!result) throw new Error('Tag không tồn tại');
    return true;
  }

  static async deleteTag(id) {
    const result = await TagModel.delete(id);
    if (!result) throw new Error('Tag không tồn tại');
    return true;
  }

  // Loại tài liệu
  static async getAllDocumentTypes() {
    return await LoaiTaiLieuModel.getAll();
  }

  static async createDocumentType(loaiTaiLieu) {
    return await LoaiTaiLieuModel.create(loaiTaiLieu);
  }

  static async updateDocumentType(id, loaiTaiLieu) {
    const result = await LoaiTaiLieuModel.update(id, loaiTaiLieu);
    if (!result) throw new Error('Loại tài liệu không tồn tại');
    return true;
  }

  static async deleteDocumentType(id) {
    const result = await LoaiTaiLieuModel.delete(id);
    if (!result) throw new Error('Loại tài liệu không tồn tại');
    return true;
  }

  // Định dạng
  static async getAllFormats() {
    return await DinhDangModel.getAll();
  }

  static async createFormat(tenDinhDang) {
    return await DinhDangModel.create(tenDinhDang);
  }

  static async updateFormat(id, tenDinhDang) {
    const result = await DinhDangModel.update(id, tenDinhDang);
    if (!result) throw new Error('Định dạng không tồn tại');
    return true;
  }

  static async deleteFormat(id) {
    const result = await DinhDangModel.delete(id);
    if (!result) throw new Error('Định dạng không tồn tại');
    return true;
  }

  // ===== CONTENT MANAGEMENT =====
  
  static async updateDocument(id, updateData) {
    const result = await TaiLieuModel.update(id, updateData);
    if (!result) throw new Error('Tài liệu không tồn tại');
    return true;
  }

  // Câu hỏi
  static async getAllQuestions(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const questions = await CauHoiModel.getAllForAdmin({}, limit, offset);
    
    // Count all questions for admin (including hidden)
    const query = `SELECT COUNT(*) as total FROM cauhoi`;
    const [rows] = await (await import('../config/database.js')).default.execute(query);
    const total = rows[0].total;

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async hideQuestion(id) {
    const result = await CauHoiModel.updateStatus(id, 'hidden');
    if (!result) throw new Error('Câu hỏi không tồn tại');
    return true;
  }

  static async showQuestion(id) {
    const result = await CauHoiModel.updateStatus(id, 'show');
    if (!result) throw new Error('Câu hỏi không tồn tại');
    return true;
  }

  static async updateQuestion(id, updateData) {
    const result = await CauHoiModel.update(id, updateData);
    if (!result) throw new Error('Câu hỏi không tồn tại');
    return true;
  }

  static async deleteQuestion(id) {
    const result = await CauHoiModel.delete(id);
    if (!result) throw new Error('Câu hỏi không tồn tại');
    return true;
  }

  // Câu trả lời
  static async getAllAnswers(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT ctl.maCauTraLoi as maTraLoi, 
             ctl.maSinhVien,
             ctl.maCauHoi,
             ctl.noiDungCTL as noiDungTraLoi, 
             ctl.ngayTraLoi, 
             ctl.trangThaiCTL,
             ch.tieuDeCH as tieuDeCauHoi, 
             ch.trangThaiCH as trangThaiCauHoi,
             sv.hoTenSV,
            -- trangThaiCTL: 'show' = visible, 'hidden' = hidden. Use cauhoi.trangThaiCH to detect accepted answer.
            NULL as trangThaiDuyet,
             (SELECT COALESCE(SUM(CASE WHEN Upvote = '1' THEN 1 WHEN Downvote = '1' THEN -1 ELSE 0 END), 0)
              FROM danhgiacautraloi 
              WHERE maCauTraLoi = ctl.maCauTraLoi) as danhGia
      FROM cautraloi ctl
      LEFT JOIN cauhoi ch ON ctl.maCauHoi = ch.maCauHoi
      LEFT JOIN sinhvien sv ON ctl.maSinhVien = sv.maSinhVien
      ORDER BY ctl.ngayTraLoi DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const [answers] = await db.execute(query);

    const countQuery = 'SELECT COUNT(*) as total FROM cautraloi';
    const [[{ total }]] = await db.execute(countQuery);

    return {
      answers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async updateAnswer(id, updateData) {
    const result = await CauTraLoiModel.update(id, updateData);
    if (!result) throw new Error('Câu trả lời không tồn tại');
    return true;
  }

  static async deleteAnswer(id) {
    const result = await CauTraLoiModel.delete(id);
    if (!result) throw new Error('Câu trả lời không tồn tại');
    return true;
  }

  static async approveAnswer(id) {
    const result = await CauTraLoiModel.acceptById(id);
    if (!result) throw new Error('Câu trả lời không tồn tại');
    return true;
  }

  static async rejectAnswer(id) {
    const result = await CauTraLoiModel.updateStatus(id, 'hidden');
    if (!result) throw new Error('Câu trả lời không tồn tại');
    return true;
  }

  // Thống kê
  static async getStatistics() {
    const [[users]] = await db.execute('SELECT COUNT(*) as count FROM sinhvien');
    const [[activeUsers]] = await db.execute("SELECT COUNT(*) as count FROM sinhvien WHERE trangThaiTK = 'active'");
    const [[blockedUsers]] = await db.execute("SELECT COUNT(*) as count FROM sinhvien WHERE trangThaiTK = 'blocked'");
    const [[docs]] = await db.execute('SELECT COUNT(*) as count FROM tailieu');
    const [[questions]] = await db.execute("SELECT COUNT(*) as count FROM cauhoi");
    const [[visibleQuestions]] = await db.execute("SELECT COUNT(*) as count FROM cauhoi WHERE trangThaiCH = 'show'");
    const [[hiddenQuestions]] = await db.execute("SELECT COUNT(*) as count FROM cauhoi WHERE trangThaiCH = 'hidden'");
    const [[answers]] = await db.execute('SELECT COUNT(*) as count FROM cautraloi');
    const [[visibleAnswers]] = await db.execute("SELECT COUNT(*) as count FROM cautraloi WHERE trangThaiCTL = 'show'");
    const [[hiddenAnswers]] = await db.execute("SELECT COUNT(*) as count FROM cautraloi WHERE trangThaiCTL = 'hidden'");
    const [[pending]] = await db.execute("SELECT COUNT(*) as count FROM tailieu WHERE trangThaiTL = 'hidden'");
    const [[approved]] = await db.execute("SELECT COUNT(*) as count FROM tailieu WHERE trangThaiTL = 'show'");
    const rejected = { count: 0 };
    const [[saved]] = await db.execute('SELECT SUM(soLanLuu) as total FROM tailieu');
    const [[downloads]] = await db.execute('SELECT SUM(luotTaiXuong) as total FROM tailieu');
    const [[totalReports]] = await db.execute('SELECT COUNT(*) as count FROM baocaovipham');
    const [[pendingReports]] = await db.execute("SELECT COUNT(*) as count FROM baocaovipham WHERE trangThaiBC = 'pending'");
    const [[approvedReports]] = await db.execute("SELECT COUNT(*) as count FROM baocaovipham WHERE trangThaiBC = 'approved'");
    const [[rejectedReports]] = await db.execute("SELECT COUNT(*) as count FROM baocaovipham WHERE trangThaiBC = 'rejected'");

    return {
      totalUsers: users.count || 0,
      activeUsers: activeUsers.count || 0,
      blockedUsers: blockedUsers.count || 0,
      totalDocuments: docs.count || 0,
      totalQuestions: questions.count || 0,
      visibleQuestions: visibleQuestions.count || 0,
      hiddenQuestions: hiddenQuestions.count || 0,
      totalAnswers: answers.count || 0,
      visibleAnswers: visibleAnswers.count || 0,
      hiddenAnswers: hiddenAnswers.count || 0,
      pendingDocuments: pending.count || 0,
      approvedDocuments: approved.count || 0,
      rejectedDocuments: rejected.count || 0,
      totalViews: saved.total || 0,
      totalDownloads: downloads.total || 0,
      totalReports: totalReports.count || 0,
      pendingReports: pendingReports.count || 0,
      approvedReports: approvedReports.count || 0,
      rejectedReports: rejectedReports.count || 0
    };
  }

  // ===== ADMIN MANAGEMENT =====
  
  // Quản trị viên
  static async getAllAdmins() {
    return await QuanTriVienModel.getAll();
  }

  static async createAdmin(data) {
    return await QuanTriVienModel.create(data);
  }

  static async updateAdmin(id, data) {
    const result = await QuanTriVienModel.update(id, data);
    if (!result) throw new Error('Quản trị viên không tồn tại');
    return true;
  }

  static async deleteAdmin(id) {
    const result = await QuanTriVienModel.delete(id);
    if (!result) throw new Error('Quản trị viên không tồn tại');
    return true;
  }
}

export default AdminService;
