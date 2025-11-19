import SinhVienModel from '../models/sinhvien.model.js';
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

class AdminService {
  // Lấy thống kê dashboard
  static async getDashboardStats() {
    const totalStudents = await SinhVienModel.count();
    const totalDocuments = await TaiLieuModel.count('approved');
    const pendingDocuments = await TaiLieuModel.count('pending');
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
    const { hoTenSV, emailSV, truongHoc } = data;
    const result = await SinhVienModel.update(id, { hoTenSV, emailSV, truongHoc });
    if (!result) {
      throw new Error('Sinh viên không tồn tại');
    }
    return true;
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
    const documents = await TaiLieuModel.getAllForAdmin('pending', limit, offset);
    const total = await TaiLieuModel.count('pending');

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
    const total = await TaiLieuModel.count(status || 'approved');

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
    return await MonModel.create(data);
  }

  static async updateSubject(id, data) {
    const result = await MonModel.update(id, data);
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

  static async deleteFormat(id) {
    const result = await DinhDangModel.delete(id);
    if (!result) throw new Error('Định dạng không tồn tại');
    return true;
  }

  // ===== CONTENT MANAGEMENT =====
  
  // Câu hỏi
  static async getAllQuestions(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const questions = await CauHoiModel.getAll({}, limit, offset);
    const total = await CauHoiModel.count();

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
             sv.hoTenSV,
             CASE WHEN ctl.trangThaiCTL = 'approved' THEN 'accepted' ELSE 'normal' END as trangThaiDuyet,
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

  static async deleteAnswer(id) {
    const result = await CauTraLoiModel.delete(id);
    if (!result) throw new Error('Câu trả lời không tồn tại');
    return true;
  }

  // Thống kê
  static async getStatistics() {
    const [[users]] = await db.execute('SELECT COUNT(*) as count FROM sinhvien');
    const [[docs]] = await db.execute('SELECT COUNT(*) as count FROM tailieu');
    const [[questions]] = await db.execute('SELECT COUNT(*) as count FROM cauhoi');
    const [[answers]] = await db.execute('SELECT COUNT(*) as count FROM cautraloi');
    const [[pending]] = await db.execute("SELECT COUNT(*) as count FROM tailieu WHERE trangThaiTL = 'pending'");
    const [[approved]] = await db.execute("SELECT COUNT(*) as count FROM tailieu WHERE trangThaiTL = 'approved'");
    const [[rejected]] = await db.execute("SELECT COUNT(*) as count FROM tailieu WHERE trangThaiTL = 'rejected'");
    const [[saved]] = await db.execute('SELECT SUM(soLanLuu) as total FROM tailieu');
    const [[downloads]] = await db.execute('SELECT SUM(luotTaiXuong) as total FROM tailieu');
    const [[totalReports]] = await db.execute('SELECT COUNT(*) as count FROM baocaovipham');
    const [[pendingReports]] = await db.execute("SELECT COUNT(*) as count FROM baocaovipham WHERE trangThaiBC = 'pending'");
    const [[approvedReports]] = await db.execute("SELECT COUNT(*) as count FROM baocaovipham WHERE trangThaiBC = 'approved'");
    const [[rejectedReports]] = await db.execute("SELECT COUNT(*) as count FROM baocaovipham WHERE trangThaiBC = 'rejected'");

    return {
      totalUsers: users.count || 0,
      totalDocuments: docs.count || 0,
      totalQuestions: questions.count || 0,
      totalAnswers: answers.count || 0,
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
