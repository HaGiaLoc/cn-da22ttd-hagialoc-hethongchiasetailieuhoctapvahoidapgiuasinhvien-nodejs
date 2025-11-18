import express from 'express';
import AdminController from '../controllers/admin.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả route yêu cầu quyền admin
router.use(authenticate, isAdmin);

// Lấy thống kê dashboard
router.get('/dashboard/stats', AdminController.getDashboardStats);

// Quản lý sinh viên
router.get('/students', AdminController.getStudents);
router.delete('/students/:id', AdminController.deleteStudent);

// Quản lý tài liệu
router.get('/documents', AdminController.getAllDocuments);
router.get('/documents/pending', AdminController.getPendingDocuments);
router.put('/documents/:id/approve', AdminController.approveDocument);
router.put('/documents/:id/reject', AdminController.rejectDocument);

export default router;
