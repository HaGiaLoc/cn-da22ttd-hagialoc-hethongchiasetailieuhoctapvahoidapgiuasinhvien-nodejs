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

  // Cập nhật thông tin sinh viên
  static async updateStudent(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updated = await AdminService.updateStudent(id, data);

      res.json({
        success: true,
        message: 'Cập nhật thông tin sinh viên thành công',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  // Cập nhật trạng thái tài khoản sinh viên
  static async updateStudentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await AdminService.updateStudentStatus(id, status);

      res.json({
        success: true,
        message: 'Cập nhật trạng thái tài khoản thành công'
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

  // Lấy tất cả báo cáo vi phạm
  static async getAllReports(req, res, next) {
    try {
      const { status, type, page = 1, limit = 20 } = req.query;

      const result = await AdminService.getAllReports(
        status,
        type,
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

  // Duyệt báo cáo vi phạm
  static async approveReport(req, res, next) {
    try {
      const { id } = req.params;

      await AdminService.approveReport(id);

      res.json({
        success: true,
        message: 'Duyệt báo cáo thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Từ chối báo cáo vi phạm
  static async rejectReport(req, res, next) {
    try {
      const { id } = req.params;

      await AdminService.rejectReport(id);

      res.json({
        success: true,
        message: 'Từ chối báo cáo thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Xóa báo cáo vi phạm
  static async deleteReport(req, res, next) {
    try {
      const { id } = req.params;

      await AdminService.deleteReport(id);

      res.json({
        success: true,
        message: 'Xóa báo cáo thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // ===== CATEGORY MANAGEMENT =====
  
  // Môn học
  static async getAllSubjects(req, res, next) {
    try {
      const { maNganh } = req.query;
      const subjects = await AdminService.getAllSubjects(maNganh);
      res.json({ success: true, data: subjects });
    } catch (error) {
      next(error);
    }
  }

  static async createSubject(req, res, next) {
    try {
      const id = await AdminService.createSubject(req.body);
      res.json({ success: true, message: 'Thêm môn học thành công', data: { id } });
    } catch (error) {
      next(error);
    }
  }

  static async updateSubject(req, res, next) {
    try {
      await AdminService.updateSubject(req.params.id, req.body);
      res.json({ success: true, message: 'Cập nhật môn học thành công' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSubject(req, res, next) {
    try {
      await AdminService.deleteSubject(req.params.id);
      res.json({ success: true, message: 'Xóa môn học thành công' });
    } catch (error) {
      next(error);
    }
  }

  // Ngành
  static async getAllMajors(req, res, next) {
    try {
      const majors = await AdminService.getAllMajors();
      res.json({ success: true, data: majors });
    } catch (error) {
      next(error);
    }
  }

  static async createMajor(req, res, next) {
    try {
      const id = await AdminService.createMajor(req.body.tenNganh);
      res.json({ success: true, message: 'Thêm ngành thành công', data: { id } });
    } catch (error) {
      next(error);
    }
  }

  static async updateMajor(req, res, next) {
    try {
      await AdminService.updateMajor(req.params.id, req.body.tenNganh);
      res.json({ success: true, message: 'Cập nhật ngành thành công' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMajor(req, res, next) {
    try {
      await AdminService.deleteMajor(req.params.id);
      res.json({ success: true, message: 'Xóa ngành thành công' });
    } catch (error) {
      next(error);
    }
  }

  // Tags
  static async getAllTags(req, res, next) {
    try {
      const tags = await AdminService.getAllTags();
      res.json({ success: true, data: tags });
    } catch (error) {
      next(error);
    }
  }

  static async createTag(req, res, next) {
    try {
      const id = await AdminService.createTag(req.body.tenTag);
      res.json({ success: true, message: 'Thêm tag thành công', data: { id } });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTag(req, res, next) {
    try {
      await AdminService.deleteTag(req.params.id);
      res.json({ success: true, message: 'Xóa tag thành công' });
    } catch (error) {
      next(error);
    }
  }

  // Loại tài liệu
  static async getAllDocumentTypes(req, res, next) {
    try {
      const types = await AdminService.getAllDocumentTypes();
      res.json({ success: true, data: types });
    } catch (error) {
      next(error);
    }
  }

  static async createDocumentType(req, res, next) {
    try {
      const id = await AdminService.createDocumentType(req.body.loaiTaiLieu);
      res.json({ success: true, message: 'Thêm loại tài liệu thành công', data: { id } });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDocumentType(req, res, next) {
    try {
      await AdminService.deleteDocumentType(req.params.id);
      res.json({ success: true, message: 'Xóa loại tài liệu thành công' });
    } catch (error) {
      next(error);
    }
  }

  // Định dạng
  static async getAllFormats(req, res, next) {
    try {
      const formats = await AdminService.getAllFormats();
      res.json({ success: true, data: formats });
    } catch (error) {
      next(error);
    }
  }

  static async createFormat(req, res, next) {
    try {
      const id = await AdminService.createFormat(req.body.tenDinhDang);
      res.json({ success: true, message: 'Thêm định dạng thành công', data: { id } });
    } catch (error) {
      next(error);
    }
  }

  static async deleteFormat(req, res, next) {
    try {
      await AdminService.deleteFormat(req.params.id);
      res.json({ success: true, message: 'Xóa định dạng thành công' });
    } catch (error) {
      next(error);
    }
  }

  // ===== CONTENT MANAGEMENT =====
  
  // Câu hỏi
  static async getAllQuestions(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await AdminService.getAllQuestions(parseInt(page), parseInt(limit));
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuestion(req, res, next) {
    try {
      await AdminService.deleteQuestion(req.params.id);
      res.json({ success: true, message: 'Xóa câu hỏi thành công' });
    } catch (error) {
      next(error);
    }
  }

  // Câu trả lời
  static async getAllAnswers(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await AdminService.getAllAnswers(parseInt(page), parseInt(limit));
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAnswer(req, res, next) {
    try {
      await AdminService.deleteAnswer(req.params.id);
      res.json({ success: true, message: 'Xóa câu trả lời thành công' });
    } catch (error) {
      next(error);
    }
  }

  static async approveAnswer(req, res, next) {
    try {
      const { id } = req.params;
      await AdminService.approveAnswer(id);
      res.json({ success: true, message: 'Đã chấp nhận câu trả lời' });
    } catch (error) {
      next(error);
    }
  }

  static async rejectAnswer(req, res, next) {
    try {
      const { id } = req.params;
      await AdminService.rejectAnswer(id);
      res.json({ success: true, message: 'Đã ẩn câu trả lời' });
    } catch (error) {
      next(error);
    }
  }

  // Thống kê
  static async getStatistics(req, res, next) {
    try {
      const stats = await AdminService.getStatistics();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  // ===== ADMIN MANAGEMENT =====
  
  // Quản trị viên
  static async getAllAdmins(req, res, next) {
    try {
      const admins = await AdminService.getAllAdmins();
      res.json({ success: true, data: admins });
    } catch (error) {
      next(error);
    }
  }

  static async createAdmin(req, res, next) {
    try {
      const id = await AdminService.createAdmin(req.body);
      res.json({ success: true, message: 'Thêm quản trị viên thành công', data: { id } });
    } catch (error) {
      next(error);
    }
  }

  static async updateAdmin(req, res, next) {
    try {
      await AdminService.updateAdmin(req.params.id, req.body);
      res.json({ success: true, message: 'Cập nhật quản trị viên thành công' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAdmin(req, res, next) {
    try {
      await AdminService.deleteAdmin(req.params.id);
      res.json({ success: true, message: 'Xóa quản trị viên thành công' });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
