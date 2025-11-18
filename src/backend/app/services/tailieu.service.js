import TaiLieuModel from '../models/tailieu.model.js';
import LuuTaiLieuModel from '../models/luutailieu.model.js';
import fs from 'fs/promises';

class TaiLieuService {
  // Tải lên tài liệu
  static async upload(maSinhVien, fileData, documentData) {
    const { maMon, maLoai, tieuDeTL, URL, fileSizes, DinhDang } = documentData;

    const taiLieuId = await TaiLieuModel.create({
      maSinhVien,
      maMon,
      maLoai,
      tieuDeTL,
      URL: URL || fileData.path,
      fileSizes: fileSizes || fileData.size,
      DinhDang: DinhDang || fileData.mimetype
    });

    return await TaiLieuModel.getById(taiLieuId);
  }

  // Lấy danh sách tài liệu
  static async getAll(filters, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const documents = await TaiLieuModel.getAll(filters, limit, offset);
    const total = await TaiLieuModel.count('approved');

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

  // Lấy chi tiết tài liệu
  static async getById(id, maSinhVien = null) {
    const document = await TaiLieuModel.getById(id);
    if (!document) {
      throw new Error('Tài liệu không tồn tại');
    }

    // Kiểm tra đã lưu chưa
    let isSaved = false;
    if (maSinhVien) {
      isSaved = await LuuTaiLieuModel.isSaved(maSinhVien, id);
    }

    return { ...document, isSaved };
  }

  // Tăng lượt tải xuống
  static async download(id) {
    const document = await TaiLieuModel.getById(id);
    if (!document) {
      throw new Error('Tài liệu không tồn tại');
    }

    await TaiLieuModel.incrementDownload(id);
    return document;
  }

  // Lưu tài liệu
  static async save(maSinhVien, maTaiLieu) {
    const isSaved = await LuuTaiLieuModel.isSaved(maSinhVien, maTaiLieu);
    if (isSaved) {
      throw new Error('Tài liệu đã được lưu');
    }

    await LuuTaiLieuModel.save(maSinhVien, maTaiLieu);
    return true;
  }

  // Bỏ lưu tài liệu
  static async unsave(maSinhVien, maTaiLieu) {
    const isSaved = await LuuTaiLieuModel.isSaved(maSinhVien, maTaiLieu);
    if (!isSaved) {
      throw new Error('Tài liệu chưa được lưu');
    }

    await LuuTaiLieuModel.unsave(maSinhVien, maTaiLieu);
    return true;
  }

  // Lấy tài liệu đã lưu
  static async getSavedDocuments(maSinhVien, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const documents = await LuuTaiLieuModel.getSavedDocuments(maSinhVien, limit, offset);
    
    return { documents };
  }

  // Lấy tài liệu của sinh viên
  static async getMyDocuments(maSinhVien, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const documents = await TaiLieuModel.getByStudent(maSinhVien, limit, offset);
    
    return { documents };
  }

  // Xóa tài liệu
  static async delete(id, maSinhVien, role) {
    const document = await TaiLieuModel.getById(id);
    if (!document) {
      throw new Error('Tài liệu không tồn tại');
    }

    // Chỉ cho phép chủ sở hữu hoặc admin xóa
    if (role !== 'admin' && document.maSinhVien !== maSinhVien) {
      throw new Error('Bạn không có quyền xóa tài liệu này');
    }

    // Xóa file
    try {
      await fs.unlink(document.duongDanFile);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await TaiLieuModel.delete(id);
    return true;
  }

  // Admin duyệt tài liệu
  static async approve(id) {
    const result = await TaiLieuModel.updateStatus(id, 'approved');
    if (!result) {
      throw new Error('Tài liệu không tồn tại');
    }
    return true;
  }

  // Admin từ chối tài liệu
  static async reject(id) {
    const result = await TaiLieuModel.updateStatus(id, 'rejected');
    if (!result) {
      throw new Error('Tài liệu không tồn tại');
    }
    return true;
  }
}

export default TaiLieuService;
