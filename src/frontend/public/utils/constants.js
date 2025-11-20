/**
 * Application Constants
 */

// Danh mục tài liệu
export const DOCUMENT_CATEGORIES = [
  'Bài giảng',
  'Bài tập', 
  'Đề thi',
  'Tài liệu tham khảo',
  'Giáo trình',
  'Luận văn',
  'Khác'
]

// Danh mục câu hỏi
export const QUESTION_CATEGORIES = [
  'Lập trình',
  'Cơ sở dữ liệu',
  'Mạng máy tính',
  'Hệ điều hành',
  'Toán học',
  'Tiếng Anh',
  'Khác'
]

// Loại tài liệu
export const DOCUMENT_TYPES = {
  LECTURE: 'Bài giảng',
  EXERCISE: 'Bài tập',
  EXAM: 'Đề thi',
  REFERENCE: 'Tài liệu tham khảo',
  TEXTBOOK: 'Giáo trình',
  THESIS: 'Luận văn',
  OTHER: 'Khác'
}

// Trạng thái tài liệu
export const DOCUMENT_STATUS = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối'
}

// Trạng thái báo cáo
export const REPORT_STATUS = {
  PENDING: 'Chờ xử lý',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối'
}

// Vai trò người dùng
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
}

// Loại báo cáo
export const REPORT_TYPES = {
  DOCUMENT: 'document',
  QUESTION: 'question',
  ANSWER: 'answer',
  COMMENT: 'comment'
}

// Lý do báo cáo
export const REPORT_REASONS = [
  'Nội dung không phù hợp',
  'Spam',
  'Vi phạm bản quyền',
  'Thông tin sai lệch',
  'Ngôn từ không phù hợp',
  'Khác'
]

// File extensions cho phép
export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.xls',
  '.xlsx',
  '.txt',
  '.zip',
  '.rar'
]

// Kích thước file tối đa (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// Số items mỗi trang
export const ITEMS_PER_PAGE = 12

// Số items trong pagination
export const PAGINATION_ITEMS = 5
