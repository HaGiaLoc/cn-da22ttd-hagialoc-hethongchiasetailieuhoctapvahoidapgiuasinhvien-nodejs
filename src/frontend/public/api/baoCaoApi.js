import api from '../utils/axiosConfig';

const baoCaoService = {
  // Tạo báo cáo
  async create(reportData) {
    const response = await api.post('/baocao', reportData);
    return response.data;
  },

  // Lấy tất cả báo cáo (Admin)
  async getAll(status = null, page = 1, limit = 20) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await api.get(`/baocao?${params.toString()}`);
    return response.data;
  },

  // Duyệt báo cáo (Admin)
  async approve(id) {
    const response = await api.put(`/baocao/${id}/approve`);
    return response.data;
  },

  // Từ chối báo cáo (Admin)
  async reject(id) {
    const response = await api.put(`/baocao/${id}/reject`);
    return response.data;
  },

  // Xóa báo cáo (Admin)
  async delete(id) {
    const response = await api.delete(`/baocao/${id}`);
    return response.data;
  }
};

export default baoCaoService;
