import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Đăng ký
router.post('/register', AuthController.register);

// Đăng nhập
router.post('/login', AuthController.login);

// Lấy thông tin người dùng hiện tại
router.get('/me', authenticate, AuthController.getCurrentUser);

// Đổi mật khẩu
router.put('/change-password', authenticate, AuthController.changePassword);

export default router;
