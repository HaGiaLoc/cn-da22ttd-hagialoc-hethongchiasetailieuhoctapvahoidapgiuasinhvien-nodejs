import TaiLieuService from '../services/tailieu.service.js';
import LoaiTaiLieuModel from '../models/loaitailieu.model.js';
import MonModel from '../models/mon.model.js';
import NganhModel from '../models/nganh.model.js';

class TaiLieuController {
  // Tải lên tài liệu
  static async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn file tài liệu'
        });
      }

      const { Mon, Nganh, LoaiTaiLieu, tieuDe, moTa } = req.body;
      const maSinhVien = req.user.id;

      const document = await TaiLieuService.upload(maSinhVien, req.file, {
        Mon,
        Nganh,
        LoaiTaiLieu,
        tieuDe,
        moTa
      });

      res.status(201).json({
        success: true,
        message: 'Tải lên tài liệu thành công',
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách tài liệu
  static async getAll(req, res, next) {
    try {
      const { Mon, Nganh, LoaiTaiLieu, search, page = 1, limit = 20 } = req.query;

      const result = await TaiLieuService.getAll(
        { Mon, Nganh, LoaiTaiLieu, search },
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

  // Lấy chi tiết tài liệu
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const maSinhVien = req.user?.id;

      const document = await TaiLieuService.getById(id, maSinhVien);

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  // Tải xuống tài liệu
  static async download(req, res, next) {
    try {
      const { id } = req.params;

      const document = await TaiLieuService.download(id);

      res.download(document.duongDanFile, document.tenFile);
    } catch (error) {
      next(error);
    }
  }

  // Bỏ lưu tài liệu
  static async unsave(req, res, next) {
    try {
      const { id } = req.params;
      const maSinhVien = req.user.id;

      await TaiLieuService.unsave(maSinhVien, id);

      res.json({
        success: true,
        message: 'Bỏ lưu tài liệu thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Lưu tài liệu
  static async save(req, res, next) {
    try {
      const { id } = req.params;
      const maSinhVien = req.user.id;

      await TaiLieuService.save(maSinhVien, id);

      res.json({
        success: true,
        message: 'Lưu tài liệu thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy tài liệu đã lưu
  static async getSavedDocuments(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const maSinhVien = req.user.id;

      const result = await TaiLieuService.getSavedDocuments(
        maSinhVien,
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

  // Lấy tài liệu của tôi
  static async getMyDocuments(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const maSinhVien = req.user.id;

      const result = await TaiLieuService.getMyDocuments(
        maSinhVien,
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

  // Xóa tài liệu
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const maSinhVien = req.user.id;
      const role = req.user.role;

      await TaiLieuService.delete(id, maSinhVien, role);

      res.json({
        success: true,
        message: 'Xóa tài liệu thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách loại tài liệu
  static async getLoaiTaiLieu(req, res, next) {
    try {
      const loai = await LoaiTaiLieuModel.getAll();
      res.json({
        success: true,
        data: loai
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách môn học
  static async getMon(req, res, next) {
    try {
      const mon = await MonModel.getAll();
      res.json({
        success: true,
        data: mon
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách ngành
  static async getNganh(req, res, next) {
    try {
      const nganh = await NganhModel.getAll();
      res.json({
        success: true,
        data: nganh
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TaiLieuController;
