import BaoCaoService from '../services/baocao.service.js';

class BaoCaoController {
  // Tạo báo cáo
  static async create(req, res, next) {
    try {
      const { lyDo } = req.body;
      const maSinhVien = req.user.id;

      const baoCaoId = await BaoCaoService.create(maSinhVien, lyDo);

      res.status(201).json({
        success: true,
        message: 'Gửi báo cáo thành công',
        data: { maBaoCao: baoCaoId }
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy tất cả báo cáo (Admin)
  static async getAll(req, res, next) {
    try {
      const { status, page = 1, limit = 20 } = req.query;

      const result = await BaoCaoService.getAll(
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

  // Duyệt báo cáo (Admin)
  static async approve(req, res, next) {
    try {
      const { id } = req.params;

      await BaoCaoService.approve(id);

      res.json({
        success: true,
        message: 'Duyệt báo cáo thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Từ chối báo cáo (Admin)
  static async reject(req, res, next) {
    try {
      const { id } = req.params;

      await BaoCaoService.reject(id);

      res.json({
        success: true,
        message: 'Từ chối báo cáo thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Xóa báo cáo (Admin)
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      await BaoCaoService.delete(id);

      res.json({
        success: true,
        message: 'Xóa báo cáo thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BaoCaoController;
