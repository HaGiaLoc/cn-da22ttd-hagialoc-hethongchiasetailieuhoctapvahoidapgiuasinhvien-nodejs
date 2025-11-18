import BaoCaoModel from '../models/baocao.model.js';

class BaoCaoService {
  // Tạo báo cáo
  static async create(maSinhVien, lyDo) {
    const baoCaoId = await BaoCaoModel.create({ maSinhVien, lyDo });
    return baoCaoId;
  }

  // Lấy tất cả báo cáo (Admin)
  static async getAll(status = null, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const reports = await BaoCaoModel.getAll(status, limit, offset);
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

  // Duyệt báo cáo
  static async approve(id) {
    const result = await BaoCaoModel.updateStatus(id, 'approved');
    if (!result) {
      throw new Error('Báo cáo không tồn tại');
    }
    return true;
  }

  // Từ chối báo cáo
  static async reject(id) {
    const result = await BaoCaoModel.updateStatus(id, 'rejected');
    if (!result) {
      throw new Error('Báo cáo không tồn tại');
    }
    return true;
  }

  // Xóa báo cáo
  static async delete(id) {
    await BaoCaoModel.delete(id);
    return true;
  }
}

export default BaoCaoService;
