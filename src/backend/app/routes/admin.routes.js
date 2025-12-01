import express from 'express';
import AdminController from '../controllers/admin.controller.js';
import BaoCaoController from '../controllers/baocao.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tất cả route yêu cầu quyền admin
router.use(authenticate, isAdmin);

// Lấy thống kê dashboard
router.get('/dashboard/stats', AdminController.getDashboardStats);

// Quản lý sinh viên
router.get('/students', AdminController.getStudents);
router.put('/students/:id', AdminController.updateStudent);
router.put('/students/:id/status', AdminController.updateStudentStatus);
router.delete('/students/:id', AdminController.deleteStudent);

// Quản lý tài liệu
router.get('/documents', AdminController.getAllDocuments);
router.get('/documents/pending', AdminController.getPendingDocuments);
router.put('/documents/:id', AdminController.updateDocument);
router.put('/documents/:id/approve', AdminController.approveDocument);
router.put('/documents/:id/reject', AdminController.rejectDocument);

// Quản lý báo cáo vi phạm
router.get('/reports', AdminController.getAllReports);
router.put('/reports/:id/approve', AdminController.approveReport);
router.put('/reports/:id/reject', AdminController.rejectReport);
router.delete('/reports/:id', AdminController.deleteReport);

// ===== CATEGORY MANAGEMENT =====

// Quản lý môn học
router.get('/subjects', AdminController.getAllSubjects);
router.post('/subjects', AdminController.createSubject);
router.put('/subjects/:id', AdminController.updateSubject);
router.delete('/subjects/:id', AdminController.deleteSubject);

// Quản lý ngành
router.get('/majors', AdminController.getAllMajors);
router.post('/majors', AdminController.createMajor);
router.put('/majors/:id', AdminController.updateMajor);
router.delete('/majors/:id', AdminController.deleteMajor);

// Quản lý tags
router.get('/tags', AdminController.getAllTags);
router.post('/tags', AdminController.createTag);
router.put('/tags/:id', AdminController.updateTag);
router.delete('/tags/:id', AdminController.deleteTag);

// Quản lý loại tài liệu
router.get('/document-types', AdminController.getAllDocumentTypes);
router.post('/document-types', AdminController.createDocumentType);
router.put('/document-types/:id', AdminController.updateDocumentType);
router.delete('/document-types/:id', AdminController.deleteDocumentType);

// Quản lý định dạng
router.get('/formats', AdminController.getAllFormats);
router.post('/formats', AdminController.createFormat);
router.put('/formats/:id', AdminController.updateFormat);
router.delete('/formats/:id', AdminController.deleteFormat);

// ===== CONTENT MANAGEMENT =====

// Quản lý câu hỏi
router.get('/questions', AdminController.getAllQuestions);
router.put('/questions/:id', AdminController.updateQuestion);
router.put('/questions/:id/hide', AdminController.hideQuestion);
router.put('/questions/:id/show', AdminController.showQuestion);
router.delete('/questions/:id', AdminController.deleteQuestion);

// Quản lý câu trả lời
router.get('/answers', AdminController.getAllAnswers);
router.put('/answers/:id', AdminController.updateAnswer);
router.delete('/answers/:id', AdminController.deleteAnswer);
router.put('/answers/:id/approve', AdminController.approveAnswer);
router.put('/answers/:id/reject', AdminController.rejectAnswer);

// Thống kê
router.get('/statistics', AdminController.getStatistics);

// Quản lý quản trị viên
router.get('/admins', AdminController.getAllAdmins);
router.post('/admins', AdminController.createAdmin);
router.put('/admins/:id', AdminController.updateAdmin);
router.delete('/admins/:id', AdminController.deleteAdmin);

export default router;
