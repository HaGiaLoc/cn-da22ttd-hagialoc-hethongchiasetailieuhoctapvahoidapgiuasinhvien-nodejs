import AuthService from '../services/auth.service.js';

class AuthController {
  // Đăng ký
  static async register(req, res, next) {
    try {
      const { email, password, hoTenSV, MSSV, Nganh } = req.body;

      const result = await AuthService.register({
        email,
        password,
        hoTenSV,
        MSSV,
        Nganh
      });

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Đăng nhập
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Lấy thông tin người dùng hiện tại
  static async getCurrentUser(req, res, next) {
    try {
      res.json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Đổi mật khẩu
  static async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const { id, role } = req.user;

      console.log('Change password request:', { 
        userId: id, 
        role, 
        hasOldPassword: !!oldPassword, 
        hasNewPassword: !!newPassword 
      });

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới'
        });
      }

      await AuthService.changePassword(id, role, oldPassword, newPassword);

      res.json({
        success: true,
        message: 'Đổi mật khẩu thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
