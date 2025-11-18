import CauHoiModel from '../models/cauhoi.model.js';
import CauTraLoiModel from '../models/cautraloi.model.js';
import DanhGiaCauHoiModel from '../models/danhgiacauhoi.model.js';
import DanhGiaCauTraLoiModel from '../models/danhgiacautraloi.model.js';

class CauHoiService {
  // Tạo câu hỏi
  static async create(maSinhVien, questionData) {
    const { maMon, tieuDeCH, noiDungCH, tags } = questionData;

    const cauHoiId = await CauHoiModel.create({
      maSinhVien,
      maMon,
      tieuDeCH,
      noiDungCH,
      tags
    });

    return await CauHoiModel.getById(cauHoiId);
  }

  // Lấy danh sách câu hỏi
  static async getAll(filters, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const questions = await CauHoiModel.getAll(filters, limit, offset);
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

  // Lấy chi tiết câu hỏi
  static async getById(id, maSinhVien = null) {
    const question = await CauHoiModel.getById(id);
    if (!question) {
      throw new Error('Câu hỏi không tồn tại');
    }

    // Lấy câu trả lời
    const answers = await CauTraLoiModel.getByQuestion(id);

    // Lấy vote của user
    let userVote = null;
    if (maSinhVien) {
      userVote = await DanhGiaCauHoiModel.getByStudentAndQuestion(maSinhVien, id);
    }

    return { ...question, answers, userVote };
  }

  // Lấy câu hỏi của tôi
  static async getMyQuestions(maSinhVien, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const questions = await CauHoiModel.getByStudent(maSinhVien, limit, offset);
    
    return { questions };
  }

  // Trả lời câu hỏi
  static async answer(maSinhVien, maCauHoi, noiDungCTL) {
    const question = await CauHoiModel.getById(maCauHoi);
    if (!question) {
      throw new Error('Câu hỏi không tồn tại');
    }

    const answerId = await CauTraLoiModel.create({
      maSinhVien,
      maCauHoi,
      noiDungCTL
    });

    return answerId;
  }

  // Chấp nhận câu trả lời (chỉ người hỏi)
  static async acceptAnswer(maCauTraLoi, maCauHoi, maSinhVien) {
    const question = await CauHoiModel.getById(maCauHoi);
    if (!question) {
      throw new Error('Câu hỏi không tồn tại');
    }

    if (question.maSinhVien !== maSinhVien) {
      throw new Error('Chỉ người đặt câu hỏi mới có thể chấp nhận câu trả lời');
    }

    await CauTraLoiModel.accept(maCauTraLoi, maCauHoi);
    return true;
  }

  // Vote câu hỏi
  static async voteQuestion(maSinhVien, maCauHoi, isUpvote) {
    await DanhGiaCauHoiModel.vote({ maSinhVien, maCauHoi, isUpvote });
    return await CauHoiModel.getById(maCauHoi);
  }

  // Vote câu trả lời
  static async voteAnswer(maSinhVien, maCauTraLoi, isUpvote) {
    await DanhGiaCauTraLoiModel.vote({ maSinhVien, maCauTraLoi, isUpvote });
    return true;
  }

  // Xóa câu hỏi
  static async delete(id, maSinhVien, role) {
    const question = await CauHoiModel.getById(id);
    if (!question) {
      throw new Error('Câu hỏi không tồn tại');
    }

    // Chỉ cho phép chủ sở hữu hoặc admin xóa
    if (role !== 'admin' && question.maSinhVien !== maSinhVien) {
      throw new Error('Bạn không có quyền xóa câu hỏi này');
    }

    await CauHoiModel.delete(id);
    return true;
  }

  // Xóa câu trả lời
  static async deleteAnswer(id, maSinhVien, role) {
    await CauTraLoiModel.delete(id);
    return true;
  }
}

export default CauHoiService;
