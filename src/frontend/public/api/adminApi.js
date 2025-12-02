import api from '../utils/axiosConfig';

const adminService = {
  // Lấy thống kê dashboard
  async getDashboardStats() {
    return await api.get('/admin/dashboard/stats');
  },

  // Lấy danh sách sinh viên
  async getAllUsers(page = 1, limit = 50) {
    return await api.get(`/admin/students?page=${page}&limit=${limit}`);
  },

  // Xóa sinh viên
  async deleteStudent(id) {
    return await api.delete(`/admin/students/${id}`);
  },

  // Cập nhật thông tin sinh viên
  async updateStudent(id, data) {
    return await api.put(`/admin/students/${id}`, data);
  },

  // Cập nhật trạng thái tài khoản sinh viên
  async updateStudentStatus(id, status) {
    return await api.put(`/admin/students/${id}/status`, { status });
  },

  // Lấy tất cả tài liệu
  async getAllDocuments(status = null, page = 1, limit = 50) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('limit', limit);
    
    return await api.get(`/admin/documents?${params.toString()}`);
  },

  // Lấy tài liệu chờ duyệt
  async getPendingDocuments(page = 1, limit = 20) {
    return await api.get(`/admin/documents/pending?page=${page}&limit=${limit}`);
  },

  // Duyệt tài liệu
  async approveDocument(id) {
    return await api.put(`/admin/documents/${id}/approve`);
  },

  // Từ chối tài liệu
  async rejectDocument(id) {
    return await api.put(`/admin/documents/${id}/reject`);
  },

  // Cập nhật tài liệu
  async updateDocument(id, data) {
    return await api.put(`/admin/documents/${id}`, data);
  },

  // Xóa tài liệu
  async deleteDocument(id) {
    return await api.delete(`/tailieu/${id}`);
  },

  // Lấy tất cả báo cáo
  async getAllReports(status = null, type = null, page = 1, limit = 50) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    params.append('page', page);
    params.append('limit', limit);
    
    return await api.get(`/admin/reports?${params.toString()}`);
  },

  // Duyệt báo cáo
  async approveReport(id) {
    return await api.put(`/admin/reports/${id}/approve`);
  },

  // Từ chối báo cáo
  async rejectReport(id) {
    return await api.put(`/admin/reports/${id}/reject`);
  },

  // Xóa báo cáo
  async deleteReport(id) {
    return await api.delete(`/admin/reports/${id}`);
  },

  // ===== CATEGORY MANAGEMENT =====
  
  // Môn học
  async getAllSubjects(maNganh = null) {
    const params = maNganh ? `?maNganh=${maNganh}` : '';
    return await api.get(`/admin/subjects${params}`);
  },

  async createSubject(data) {
    return await api.post('/admin/subjects', data);
  },

  async updateSubject(id, data) {
    return await api.put(`/admin/subjects/${id}`, data);
  },

  async deleteSubject(id) {
    return await api.delete(`/admin/subjects/${id}`);
  },

  // Ngành
  async getAllMajors() {
    return await api.get('/admin/majors');
  },

  async createMajor(tenNganh) {
    return await api.post('/admin/majors', { tenNganh });
  },

  async updateMajor(id, tenNganh) {
    return await api.put(`/admin/majors/${id}`, { tenNganh });
  },

  async deleteMajor(id) {
    return await api.delete(`/admin/majors/${id}`);
  },

  // Tags
  async getAllTags() {
    return await api.get('/admin/tags');
  },

  async createTag(tenTag) {
    return await api.post('/admin/tags', { tenTag });
  },

  async updateTag(id, tenTag) {
    return await api.put(`/admin/tags/${id}`, { tenTag });
  },

  async deleteTag(id) {
    return await api.delete(`/admin/tags/${id}`);
  },

  // Loại tài liệu
  async getAllDocumentTypes() {
    return await api.get('/admin/document-types');
  },

  async createDocumentType(loaiTaiLieu) {
    return await api.post('/admin/document-types', { loaiTaiLieu });
  },

  async updateDocumentType(id, loaiTaiLieu) {
    return await api.put(`/admin/document-types/${id}`, { loaiTaiLieu });
  },

  async deleteDocumentType(id) {
    return await api.delete(`/admin/document-types/${id}`);
  },

  // Định dạng
  async getAllFormats() {
    return await api.get('/admin/formats');
  },

  async createFormat(tenDinhDang) {
    return await api.post('/admin/formats', { tenDinhDang });
  },

  async updateFormat(id, tenDinhDang) {
    return await api.put(`/admin/formats/${id}`, { tenDinhDang });
  },

  async deleteFormat(id) {
    return await api.delete(`/admin/formats/${id}`);
  },

  // ===== CONTENT MANAGEMENT =====
  
  // Câu hỏi
  async getAllQuestions(page = 1, limit = 50) {
    return await api.get(`/admin/questions?page=${page}&limit=${limit}`);
  },

  async hideQuestion(id) {
    return await api.put(`/admin/questions/${id}/hide`);
  },

  async showQuestion(id) {
    return await api.put(`/admin/questions/${id}/show`);
  },

  async updateQuestion(id, data) {
    return await api.put(`/admin/questions/${id}`, data);
  },

  async deleteQuestion(id) {
    return await api.delete(`/admin/questions/${id}`);
  },

  // Câu trả lời
  async getAllAnswers(page = 1, limit = 50) {
    return await api.get(`/admin/answers?page=${page}&limit=${limit}`);
  },

  async updateAnswer(id, data) {
    return await api.put(`/admin/answers/${id}`, data);
  },

  async deleteAnswer(id) {
    return await api.delete(`/admin/answers/${id}`);
  },
  
  async approveAnswer(id) {
    return await api.put(`/admin/answers/${id}/approve`);
  },

  async rejectAnswer(id) {
    return await api.put(`/admin/answers/${id}/reject`);
  },

  // Thống kê
  async getStatistics() {
    return await api.get('/admin/statistics');
  },

  // Quản trị viên
  async getAllAdmins() {
    return await api.get('/admin/admins');
  },

  async createAdmin(data) {
    return await api.post('/admin/admins', data);
  },

  async updateAdmin(id, data) {
    return await api.put(`/admin/admins/${id}`, data);
  },

  async deleteAdmin(id) {
    return await api.delete(`/admin/admins/${id}`);
  }
};

export default adminService;
