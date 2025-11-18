import express from 'express';
import BaoCaoController from '../controllers/baocao.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Các route yêu cầu đăng nhập
router.use(authenticate);

// Tạo báo cáo
router.post('/', BaoCaoController.create);

// Các route yêu cầu quyền admin
router.use(isAdmin);

// Lấy tất cả báo cáo
router.get('/', BaoCaoController.getAll);

// Duyệt báo cáo
router.put('/:id/approve', BaoCaoController.approve);

// Từ chối báo cáo
router.put('/:id/reject', BaoCaoController.reject);

// Xóa báo cáo
router.delete('/:id', BaoCaoController.delete);

export default router;
