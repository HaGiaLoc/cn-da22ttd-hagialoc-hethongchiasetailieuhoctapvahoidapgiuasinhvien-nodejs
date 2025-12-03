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

  // Cập nhật hồ sơ người dùng (sinh viên)
  static async updateProfile(req, res, next) {
    try {
      const { id, role } = req.user;
      const updateData = req.body;

      // Nếu có file avatar được upload, thêm vào updateData
      if (req.file) {
        updateData.avatarFile = req.file;
      }

      const updated = await AuthService.updateProfile(id, role, updateData);

      res.json({
        success: true,
        data: updated
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

  // Xác thực email
  static async verifyEmail(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập email'
        });
      }

      const result = await AuthService.verifyEmail(email);

      if (!result.exists) {
        return res.status(404).json({
          success: false,
          message: 'Email không tồn tại trong hệ thống'
        });
      }

      res.json({
        success: true,
        message: 'Email hợp lệ',
        data: { email, role: result.role }
      });
    } catch (error) {
      next(error);
    }
  }

  // Đặt lại mật khẩu
  static async resetPassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin'
        });
      }

      await AuthService.resetPassword(email, newPassword);

      res.json({
        success: true,
        message: 'Đặt lại mật khẩu thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
