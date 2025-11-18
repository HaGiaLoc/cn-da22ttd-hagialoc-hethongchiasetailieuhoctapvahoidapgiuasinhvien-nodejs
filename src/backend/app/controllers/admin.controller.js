import AdminService from '../services/admin.service.js';
import TaiLieuService from '../services/tailieu.service.js';

class AdminController {
  // Lấy thống kê dashboard
  static async getDashboardStats(req, res, next) {
    try {
      const stats = await AdminService.getDashboardStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách sinh viên
  static async getStudents(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;

      const result = await AdminService.getStudents(
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Xóa sinh viên
  static async deleteStudent(req, res, next) {
    try {
      const { id } = req.params;

      await AdminService.deleteStudent(id);

      res.json({
        success: true,
        message: 'Xóa sinh viên thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy tài liệu chờ duyệt
  static async getPendingDocuments(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;

      const result = await AdminService.getPendingDocuments(
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy tất cả tài liệu
  static async getAllDocuments(req, res, next) {
    try {
      const { status, page = 1, limit = 20 } = req.query;

      const result = await AdminService.getAllDocuments(
        status,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Duyệt tài liệu
  static async approveDocument(req, res, next) {
    try {
      const { id } = req.params;

      await TaiLieuService.approve(id);

      res.json({
        success: true,
        message: 'Duyệt tài liệu thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Từ chối tài liệu
  static async rejectDocument(req, res, next) {
    try {
      const { id } = req.params;

      await TaiLieuService.reject(id);

      res.json({
        success: true,
        message: 'Từ chối tài liệu thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
