import api from '../utils/api';

const cauHoiService = {
  // Lấy danh sách câu hỏi
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.Mon) params.append('Mon', filters.Mon);
    if (filters.Nganh) params.append('Nganh', filters.Nganh);
    if (filters.trangThaiCH) params.append('trangThaiCH', filters.trangThaiCH);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/cauhoi?${params.toString()}`);
    return response.data || response;
  },

  // Lấy chi tiết câu hỏi
  async getById(id) {
    const response = await api.get(`/cauhoi/${id}`);
    return response.data || response;
  },

  // Tạo câu hỏi
  async create(questionData) {
    const response = await api.post('/cauhoi', questionData);
    return response.data;
  },

  // Lấy câu hỏi của tôi
  async getMyQuestions(page = 1, limit = 20) {
    const response = await api.get(`/cauhoi/my/list?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Lấy câu trả lời của tôi
  async getMyAnswers(page = 1, limit = 20) {
    const response = await api.get(`/cauhoi/my/answers?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Trả lời câu hỏi
  async answer(id, noiDungCTL) {
    const response = await api.post(`/cauhoi/${id}/answer`, { noiDungCTL });
    return response.data;
  },

  // Chấp nhận câu trả lời
  async acceptAnswer(questionId, answerId) {
    const response = await api.put(`/cauhoi/${questionId}/answer/${answerId}/accept`);
    return response.data;
  },

  // Vote câu hỏi
  async voteQuestion(id, isUpvote) {
    const response = await api.post(`/cauhoi/${id}/vote`, { isUpvote });
    return response.data;
  },

  // Vote câu trả lời
  async voteAnswer(answerId, isUpvote) {
    const response = await api.post(`/cauhoi/answer/${answerId}/vote`, { isUpvote });
    return response.data;
  },

  // Xóa câu hỏi
  async delete(id) {
    const response = await api.delete(`/cauhoi/${id}`);
    return response.data;
  },

  // Xóa câu trả lời
  async deleteAnswer(answerId) {
    const response = await api.delete(`/cauhoi/answer/${answerId}`);
    return response.data;
  },

  // Lấy danh sách môn học
  async getMon() {
    const response = await api.get('/cauhoi/filters/mon');
    return response.data;
  },

  // Lấy danh sách ngành
  async getNganh() {
    const response = await api.get('/cauhoi/filters/nganh');
    return response.data;
  },

  // Lấy danh sách tags
  async getTags() {
    const response = await api.get('/cauhoi/filters/tags');
    return response.data;
  }
};

export default cauHoiService;
