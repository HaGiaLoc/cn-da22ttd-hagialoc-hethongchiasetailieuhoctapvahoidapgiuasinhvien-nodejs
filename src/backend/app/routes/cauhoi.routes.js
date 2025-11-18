import express from 'express';
import CauHoiController from '../controllers/cauhoi.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Lấy danh sách câu hỏi (public)
router.get('/', CauHoiController.getAll);

// Lấy danh sách môn học (public)
router.get('/filters/mon', CauHoiController.getMon);

// Lấy danh sách ngành (public)
router.get('/filters/nganh', CauHoiController.getNganh);

// Lấy chi tiết câu hỏi
router.get('/:id', CauHoiController.getById);

// Các route yêu cầu đăng nhập
router.use(authenticate);

// Tạo câu hỏi
router.post('/', CauHoiController.create);

// Lấy câu hỏi của tôi
router.get('/my/list', CauHoiController.getMyQuestions);

// Trả lời câu hỏi
router.post('/:id/answer', CauHoiController.answer);

// Chấp nhận câu trả lời
router.put('/:id/answer/:answerId/accept', CauHoiController.acceptAnswer);

// Vote câu hỏi
router.post('/:id/vote', CauHoiController.vote);

// Vote câu trả lời
router.post('/answer/:answerId/vote', CauHoiController.voteAnswer);

// Xóa câu hỏi
router.delete('/:id', CauHoiController.delete);

// Xóa câu trả lời
router.delete('/answer/:answerId', CauHoiController.deleteAnswer);

export default router;
