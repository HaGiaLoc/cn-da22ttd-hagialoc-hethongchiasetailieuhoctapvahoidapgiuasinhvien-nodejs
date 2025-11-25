import api from '../utils/api';

const authService = {
  // Đăng nhập
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Đăng ký
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Cập nhật hồ sơ người dùng hiện tại
  async updateProfile(profileData) {
    const response = await api.put('/auth/me', profileData);
    return response.data;
  },

  // Đổi mật khẩu
  async changePassword(oldPassword, newPassword) {
    const response = await api.put('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },

  // Logout (client-side)
  logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }
};

export default authService;
