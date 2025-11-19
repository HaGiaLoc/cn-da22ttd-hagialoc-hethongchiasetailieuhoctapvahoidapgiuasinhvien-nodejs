import express from 'express';
import TaiLieuController from '../controllers/tailieu.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Lấy danh sách tài liệu (public)
router.get('/', TaiLieuController.getAll);

// Lấy danh sách loại tài liệu
router.get('/filters/loai', TaiLieuController.getLoaiTaiLieu);

// Lấy danh sách môn học
router.get('/filters/mon', TaiLieuController.getMon);

// Lấy danh sách ngành
router.get('/filters/nganh', TaiLieuController.getNganh);

// Lấy danh sách định dạng
router.get('/filters/dinhdang', TaiLieuController.getDinhDang);

// Lấy chi tiết tài liệu
router.get('/:id', TaiLieuController.getById);

// Tải xuống tài liệu
router.get('/:id/download', authenticate, TaiLieuController.download);

// Các route yêu cầu đăng nhập
router.use(authenticate);

// Tải lên tài liệu
router.post('/', upload.single('file'), TaiLieuController.upload);

// Lưu tài liệu
router.post('/:id/save', TaiLieuController.save);

// Bỏ lưu tài liệu
router.delete('/:id/save', TaiLieuController.unsave);

// Lấy tài liệu đã lưu
router.get('/saved/list', TaiLieuController.getSavedDocuments);

// Lấy tài liệu của tôi
router.get('/my/list', TaiLieuController.getMyDocuments);

// Xóa tài liệu
router.delete('/:id', TaiLieuController.delete);

export default router;
