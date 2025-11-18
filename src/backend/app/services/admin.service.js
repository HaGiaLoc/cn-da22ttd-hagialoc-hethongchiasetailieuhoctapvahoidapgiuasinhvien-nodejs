import SinhVienModel from '../models/sinhvien.model.js';
import TaiLieuModel from '../models/tailieu.model.js';
import CauHoiModel from '../models/cauhoi.model.js';
import BaoCaoModel from '../models/baocao.model.js';

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

  // Lấy tài liệu chờ duyệt
  static async getPendingDocuments(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const documents = await TaiLieuModel.getAll({ status: 'pending' }, limit, offset);
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
    const documents = await TaiLieuModel.getAll(status ? { status } : {}, limit, offset);
    const total = await TaiLieuModel.count(status);

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
}

export default AdminService;
