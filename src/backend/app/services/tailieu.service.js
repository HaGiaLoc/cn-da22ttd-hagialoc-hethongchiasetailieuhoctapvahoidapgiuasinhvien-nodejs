import TaiLieuModel from '../models/tailieu.model.js';
import LuuTaiLieuModel from '../models/luutailieu.model.js';
import DinhDangModel from '../models/dinhdang.model.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to convert absolute path to relative path from backend root
const getRelativePath = (absolutePath) => {
  if (!absolutePath) return absolutePath;
  const backendRoot = path.join(__dirname, '../..');
  const relativePath = path.relative(backendRoot, absolutePath);
  // Convert Windows backslashes to forward slashes for consistency
  return relativePath.replace(/\\/g, '/');
};

// Helper function to convert relative path to absolute path
const getAbsolutePath = (relativePath) => {
  if (!relativePath) return relativePath;
  // If already absolute, return as is
  if (path.isAbsolute(relativePath)) return relativePath;
  const backendRoot = path.join(__dirname, '../..');
  return path.join(backendRoot, relativePath);
};

class TaiLieuService {
  // Tải lên tài liệu
  static async upload(maSinhVien, fileData, documentData) {
    const { maMon, maLoai, tieuDeTL, filePath, fileSizes, maDinhDang } = documentData;

    // Determine maDinhDang automatically from file extension if not provided
    let resolvedMaDinhDang = maDinhDang ?? null;
    if (!resolvedMaDinhDang) {
      try {
        const origName = fileData.originalname || '';
        const ext = origName.includes('.') ? origName.split('.').pop().toLowerCase() : '';
        // Map extension to a display name (tenDinhDang) — default to uppercased extension
        const ten = ext ? ext.toUpperCase() : 'UNKNOWN';

        // Try to find existing dinhdang by name
        const existing = await DinhDangModel.getByName(ten);
        if (existing) {
          resolvedMaDinhDang = existing.maDinhDang;
        } else if (ext) {
          // Create new dinhdang entry for this extension
          const newId = await DinhDangModel.create(ten);
          resolvedMaDinhDang = newId;
        }
      } catch (err) {
        // If anything fails, leave maDinhDang null and proceed
        console.error('Error resolving maDinhDang from extension:', err);
        resolvedMaDinhDang = null;
      }
    }

    // Convert absolute path to relative path before saving
    const absolutePath = filePath || fileData.path;
    const relativeFilePath = getRelativePath(absolutePath);

    const taiLieuId = await TaiLieuModel.create({
      maSinhVien,
      maMon,
      maLoai,
      tieuDeTL,
      filePath: relativeFilePath,
      fileSizes: fileSizes || fileData.size,
      maDinhDang: resolvedMaDinhDang
    });

    return await TaiLieuModel.getById(taiLieuId);
  }

  // Lấy danh sách tài liệu
  static async getAll(filters, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const documents = await TaiLieuModel.getAll(filters, limit, offset);
    const total = await TaiLieuModel.count('show');

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

    // Verify file exists
    const filePath = getAbsolutePath(document.filePath);
    if (!filePath) throw new Error('File path not found');

    await TaiLieuModel.incrementDownload(id);
    return { ...document, downloadPath: filePath };
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
      const absolutePath = getAbsolutePath(document.filePath);
      await fs.unlink(absolutePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await TaiLieuModel.delete(id);
    return true;
  }

  // Admin duyệt tài liệu
  static async approve(id) {
    const result = await TaiLieuModel.updateStatus(id, 'show');
    if (!result) {
      throw new Error('Tài liệu không tồn tại');
    }
    return true;
  }

  // Admin từ chối tài liệu
  static async reject(id) {
    const result = await TaiLieuModel.updateStatus(id, 'hidden');
    if (!result) {
      throw new Error('Tài liệu không tồn tại');
    }
    return true;
  }
}

export default TaiLieuService;
