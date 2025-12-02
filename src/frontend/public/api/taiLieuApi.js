import api from '../utils/axiosConfig';

const taiLieuService = {
  // Lấy danh sách tài liệu
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.Mon) params.append('Mon', filters.Mon);
    if (filters.Nganh) params.append('Nganh', filters.Nganh);
    if (filters.LoaiTaiLieu) params.append('LoaiTaiLieu', filters.LoaiTaiLieu);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/tailieu?${params.toString()}`);
    return response.data || response;
  },

  // Lấy chi tiết tài liệu
  async getById(id) {
    const response = await api.get(`/tailieu/${id}`);
    return response.data || response;
  },

  // Tải lên tài liệu
  async upload(formData) {
    const response = await api.post('/tailieu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Tải xuống tài liệu
  async download(id) {
    const response = await api.get(`/tailieu/${id}/download`, {
      responseType: 'blob'
    });
    return response;
  },

  // Đánh giá tài liệu
  async rate(id, rating) {
    const response = await api.post(`/tailieu/${id}/rate`, { rating });
    return response.data;
  },

  // Lưu tài liệu
  async save(id) {
    const response = await api.post(`/tailieu/${id}/save`);
    return response.data;
  },

  // Bỏ lưu tài liệu
  async unsave(id) {
    const response = await api.delete(`/tailieu/${id}/save`);
    return response.data;
  },

  // Lấy tài liệu đã lưu
  async getSavedDocuments(page = 1, limit = 20) {
    const response = await api.get(`/tailieu/saved/list?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Lấy tài liệu của tôi
  async getMyDocuments(page = 1, limit = 20) {
    const response = await api.get(`/tailieu/my/list?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Xóa tài liệu
  async delete(id) {
    const response = await api.delete(`/tailieu/${id}`);
    return response.data;
  },

  // Lấy danh sách loại tài liệu
  async getLoaiTaiLieu() {
    const response = await api.get('/tailieu/filters/loai');
    return response.data;
  },

  // Lấy danh sách môn học
  async getMon() {
    const response = await api.get('/tailieu/filters/mon');
    return response.data;
  },

  // Lấy danh sách ngành
  async getNganh() {
    const response = await api.get('/tailieu/filters/nganh');
    return response.data;
  },

  // Lấy danh sách định dạng
  async getDinhDang() {
    const response = await api.get('/tailieu/filters/dinhdang');
    return response.data;
  }
};

export default taiLieuService;
