import CauHoiService from '../services/cauhoi.service.js';
import MonModel from '../models/mon.model.js';
import NganhModel from '../models/nganh.model.js';
import TagModel from '../models/tag.model.js';

class CauHoiController {
  // Tạo câu hỏi
  static async create(req, res, next) {
    try {
      const { maMon, tieuDeCH, noiDungCH, tags } = req.body;
      const maSinhVien = req.user.id;

      const question = await CauHoiService.create(maSinhVien, {
        maMon,
        tieuDeCH,
        noiDungCH,
        tags
      });

      res.status(201).json({
        success: true,
        message: 'Đặt câu hỏi thành công',
        data: question
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy danh sách câu hỏi
  static async getAll(req, res, next) {
    try {
      const { Mon, Nganh, trangThaiCH, search, page = 1, limit = 20 } = req.query;

      const result = await CauHoiService.getAll(
        { Mon, Nganh, trangThaiCH, search },
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

  // Lấy chi tiết câu hỏi
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const maSinhVien = req.user?.id;
      const role = req.user?.role;

      const question = await CauHoiService.getById(id, maSinhVien, role);

      res.json({
        success: true,
        data: question
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy câu hỏi của tôi
  static async getMyQuestions(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const maSinhVien = req.user.id;

      const result = await CauHoiService.getMyQuestions(
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

  // Lấy câu trả lời của tôi
  static async getMyAnswers(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const maSinhVien = req.user.id;

      const result = await CauHoiService.getMyAnswers(
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

  // Trả lời câu hỏi
  static async answer(req, res, next) {
    try {
      const { id } = req.params;
      const { noiDungCTL } = req.body;
      const maSinhVien = req.user.id;

      const answerId = await CauHoiService.answer(maSinhVien, id, noiDungCTL);

      res.status(201).json({
        success: true,
        message: 'Trả lời câu hỏi thành công',
        data: { maCauTraLoi: answerId }
      });
    } catch (error) {
      next(error);
    }
  }

  // Chấp nhận câu trả lời
  static async acceptAnswer(req, res, next) {
    try {
      const { id, answerId } = req.params;
      const maSinhVien = req.user.id;

      await CauHoiService.acceptAnswer(answerId, id, maSinhVien);

      res.json({
        success: true,
        message: 'Chấp nhận câu trả lời thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Vote câu hỏi
  static async vote(req, res, next) {
    try {
      const { id } = req.params;
      const { isUpvote } = req.body;
      const maSinhVien = req.user.id;

      const question = await CauHoiService.voteQuestion(maSinhVien, id, isUpvote);

      res.json({
        success: true,
        message: 'Vote thành công',
        data: question
      });
    } catch (error) {
      next(error);
    }
  }

  // Vote câu trả lời
  static async voteAnswer(req, res, next) {
    try {
      const { answerId } = req.params;
      const { isUpvote } = req.body;
      const maSinhVien = req.user.id;

      await CauHoiService.voteAnswer(maSinhVien, answerId, isUpvote);

      res.json({
        success: true,
        message: 'Vote thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Xóa câu hỏi
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const maSinhVien = req.user.id;
      const role = req.user.role;

      await CauHoiService.delete(id, maSinhVien, role);

      res.json({
        success: true,
        message: 'Xóa câu hỏi thành công'
      });
    } catch (error) {
      next(error);
    }
  }

  // Xóa câu trả lời
  static async deleteAnswer(req, res, next) {
    try {
      const { answerId } = req.params;
      const maSinhVien = req.user.id;
      const role = req.user.role;

      await CauHoiService.deleteAnswer(answerId, maSinhVien, role);

      res.json({
        success: true,
        message: 'Xóa câu trả lời thành công'
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

  // Lấy danh sách tags
  static async getTags(req, res, next) {
    try {
      const tags = await TagModel.getAll();
      res.json({
        success: true,
        data: tags
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CauHoiController;
