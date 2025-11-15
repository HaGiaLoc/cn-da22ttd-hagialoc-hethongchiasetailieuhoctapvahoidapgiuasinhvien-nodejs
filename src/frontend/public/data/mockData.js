// Danh mục tài liệu
export const mockDocumentCategories = [
  { id: 1, name: 'Bài giảng' },
  { id: 2, name: 'Bài tập' },
  { id: 3, name: 'Đề thi' },
  { id: 4, name: 'Tài liệu tham khảo' }
]

// Danh mục câu hỏi  
export const mockQuestionCategories = [
  { id: 1, name: 'Lập trình' },
  { id: 2, name: 'Database' },
  { id: 3, name: 'Web' },
  { id: 4, name: 'Toán học' }
]

// Hàm tạo avatar từ tên
export const generateAvatar = (fullName) => {
  if (!fullName) return 'https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff&size=150'
  
  const words = fullName.trim().split(' ')
  let initials = ''
  
  if (words.length >= 2) {
    // Lấy chữ cái đầu của họ (từ đầu) và tên (từ cuối)
    initials = words[0].charAt(0) + words[words.length - 1].charAt(0)
  } else {
    // Nếu chỉ có 1 từ, lấy 2 ký tự đầu
    initials = fullName.substring(0, 2)
  }
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=4F46E5&color=fff&size=150`
}

// Sinh viên
export const mockStudents = [
  {
    id: 1,
    maSinhVien: 'SV001',
    hoTenSinhVien: 'Nguyễn Văn A',
    email: 'nguyenvana@student.edu.vn',
    matKhauSinhVien: 'student123',
    ngayTao: new Date('2024-05-01'),
    tuoiHoc: 2,
    truongHoc: 'Trường Đại học Trà Vinh',
    nganh: 'Công nghệ thông tin',
    avatar: generateAvatar('Nguyễn Văn A')
  },
  {
    id: 2,
    maSinhVien: 'SV002',
    hoTenSinhVien: 'Trần Thị B',
    email: 'tranthib@student.edu.vn',
    matKhauSinhVien: 'sv123456',
    ngayTao: new Date('2024-05-15'),
    tuoiHoc: 2,
    truongHoc: 'Trường Đại học Cần Thơ',
    nganh: 'Khoa học máy tính',
    avatar: generateAvatar('Trần Thị B')
  },
  {
    id: 3,
    maSinhVien: 'SV003',
    hoTenSinhVien: 'Lê Văn C',
    email: 'levanc@student.edu.vn',
    matKhauSinhVien: '123456',
    ngayTao: new Date('2024-06-01'),
    tuoiHoc: 1,
    truongHoc: 'Trường Đại học Trà Vinh',
    nganh: 'Kỹ thuật phần mềm',
    avatar: generateAvatar('Lê Văn C')
  }
]

// Tài liệu
export const mockDocuments = [
  {
    id: 1,
    maSinhVien: 1,
    maDanhMuc: 1,
    tieuDeTaiLieu: 'Cấu trúc dữ liệu và Giải thuật - Chương 1',
    moTaTaiLieu: 'Giới thiệu về cấu trúc dữ liệu cơ bản: mảng, danh sách liên kết',
    url: '/documents/ctdl-c1.pdf',
    noiDungTaiLieu: 'PDF',
    luotXem: 1234,
    luotTaiXuong: 456,
    ngayTao: new Date('2024-11-10'),
    danhGia: 4.5,
    type: 'Bài giảng',
    subject: 'Lập trình',
    major: 'Công nghệ thông tin',
    author: 'Nguyễn Văn A',
    date: new Date('2024-11-10'),
    views: 1234,
    downloads: 456,
    rating: 4.5,
    format: 'PDF'
  },
  {
    id: 2,
    maSinhVien: 2,
    maDanhMuc: 2,
    tieuDeTaiLieu: 'Cơ sở dữ liệu - Bài tập thực hành',
    moTaTaiLieu: 'Bài tập về SQL, thiết kế cơ sở dữ liệu quan hệ',
    url: '/documents/csdl-bt.pdf',
    noiDungTaiLieu: 'PDF',
    luotXem: 890,
    luotTaiXuong: 234,
    ngayTao: new Date('2024-11-12'),
    danhGia: 4.2,
    type: 'Bài tập',
    subject: 'Database',
    major: 'Công nghệ thông tin',
    author: 'Trần Thị B',
    date: new Date('2024-11-12'),
    views: 890,
    downloads: 234,
    rating: 4.2,
    format: 'PDF'
  },
  {
    id: 3,
    maSinhVien: 3,
    maDanhMuc: 4,
    tieuDeTaiLieu: 'Lập trình Web - HTML, CSS, JavaScript',
    moTaTaiLieu: 'Tài liệu tham khảo về phát triển web front-end',
    url: '/documents/web-frontend.pdf',
    noiDungTaiLieu: 'PDF',
    luotXem: 2345,
    luotTaiXuong: 678,
    ngayTao: new Date('2024-11-14'),
    danhGia: 4.8,
    type: 'Tài liệu tham khảo',
    subject: 'Web',
    major: 'Công nghệ thông tin',
    author: 'Lê Văn C',
    date: new Date('2024-11-14'),
    views: 2345,
    downloads: 678,
    rating: 4.8,
    format: 'PDF'
  },
  {
    id: 4,
    maSinhVien: 1,
    maDanhMuc: 3,
    tieuDeTaiLieu: 'Đề thi Toán Cao cấp A1 - Kỳ 1',
    moTaTaiLieu: 'Đề thi và đáp án môn Toán Cao cấp A1',
    url: '/documents/toan-a1.pdf',
    noiDungTaiLieu: 'PDF',
    luotXem: 3456,
    luotTaiXuong: 1234,
    ngayTao: new Date('2024-11-08'),
    danhGia: 4.6,
    type: 'Đề thi',
    subject: 'Toán học',
    major: 'Công nghệ thông tin',
    author: 'Nguyễn Văn A',
    date: new Date('2024-11-08'),
    views: 3456,
    downloads: 1234,
    rating: 4.6,
    format: 'PDF'
  }
]

// Câu hỏi
export const mockQuestions = [
  {
    id: 1,
    maSinhVien: 1,
    maDanhMuc: 1,
    tieuDeCauHoi: 'Làm thế nào để tối ưu hóa thuật toán sắp xếp trong Java?',
    noiDungCauHoi: 'Mình đang làm một project về sắp xếp dữ liệu lớn. Các bạn có thể tư vấn thuật toán nào hiệu quả nhất không?',
    ngayTao: new Date('2024-11-15'),
    vote: 15,
    title: 'Làm thế nào để tối ưu hóa thuật toán sắp xếp trong Java?',
    content: 'Mình đang làm một project về sắp xếp dữ liệu lớn. Các bạn có thể tư vấn thuật toán nào hiệu quả nhất không?',
    author: 'Nguyễn Văn A',
    subject: 'Lập trình',
    major: 'Công nghệ thông tin',
    date: new Date('2024-11-15'),
    votes: 15,
    answers: 2,
    views: 234,
    tags: ['Java', 'Algorithm', 'Sorting'],
    status: 'open'
  },
  {
    id: 2,
    maSinhVien: 2,
    maDanhMuc: 3,
    tieuDeCauHoi: 'React hooks: useEffect chạy nhiều lần, làm sao fix?',
    noiDungCauHoi: 'Mình đang gặp vấn đề với useEffect re-render liên tục. Dependency array đã thêm nhưng vẫn không được.',
    ngayTao: new Date('2024-11-14'),
    vote: 23,
    title: 'React hooks: useEffect chạy nhiều lần, làm sao fix?',
    content: 'Mình đang gặp vấn đề với useEffect re-render liên tục. Dependency array đã thêm nhưng vẫn không được.',
    author: 'Trần Thị B',
    subject: 'Web',
    major: 'Công nghệ thông tin',
    date: new Date('2024-11-14'),
    votes: 23,
    answers: 1,
    views: 456,
    tags: ['React', 'JavaScript', 'Hooks'],
    status: 'solved'
  },
  {
    id: 3,
    maSinhVien: 3,
    maDanhMuc: 2,
    tieuDeCauHoi: 'Cách thiết kế database cho hệ thống e-commerce?',
    noiDungCauHoi: 'Các bạn có thể tư vấn cho mình về thiết kế database cho website bán hàng online không? Mình đang phân vân về các bảng cần thiết.',
    ngayTao: new Date('2024-11-13'),
    vote: 18,
    title: 'Cách thiết kế database cho hệ thống e-commerce?',
    content: 'Các bạn có thể tư vấn cho mình về thiết kế database cho website bán hàng online không? Mình đang phân vân về các bảng cần thiết.',
    author: 'Lê Văn C',
    subject: 'Database',
    major: 'Công nghệ thông tin',
    date: new Date('2024-11-13'),
    votes: 18,
    answers: 0,
    views: 389,
    tags: ['Database', 'SQL', 'E-commerce'],
    status: 'open'
  }
]

// Câu trả lời
export const mockAnswers = [
  {
    id: 1,
    maCauHoi: 1,
    maSinhVien: 2,
    noiDungTraLoi: 'Bạn có thể sử dụng Merge Sort thay vì Quick Sort cho dữ liệu lớn. Merge Sort có độ phức tạp O(n log n) ổn định hơn và phù hợp với dữ liệu lớn.',
    ngayTraLoi: new Date('2024-11-15'),
    vote: 12,
    // Computed fields
    questionId: 1,
    content: 'Bạn có thể sử dụng Merge Sort thay vì Quick Sort cho dữ liệu lớn. Merge Sort có độ phức tạp O(n log n) ổn định hơn và phù hợp với dữ liệu lớn.',
    author: 'Trần Thị B',
    date: new Date('2024-11-15'),
    votes: 12
  },
  {
    id: 2,
    maCauHoi: 1,
    maSinhVien: 3,
    noiDungTraLoi: 'Ngoài ra, bạn cũng có thể xem xét sử dụng Timsort - thuật toán sắp xếp được sử dụng trong Python và Java. Nó kết hợp Merge Sort và Insertion Sort rất hiệu quả.',
    ngayTraLoi: new Date('2024-11-15'),
    vote: 8,
    questionId: 1,
    content: 'Ngoài ra, bạn cũng có thể xem xét sử dụng Timsort - thuật toán sắp xếp được sử dụng trong Python và Java. Nó kết hợp Merge Sort và Insertion Sort rất hiệu quả.',
    author: 'Lê Văn C',
    date: new Date('2024-11-15'),
    votes: 8
  },
  {
    id: 3,
    maCauHoi: 2,
    maSinhVien: 1,
    noiDungTraLoi: 'Bạn cần thêm dependency array vào useEffect. Ví dụ: useEffect(() => { ... }, [dependency]). Nếu vẫn re-render thì kiểm tra xem dependency có phải là object/array mới tạo mỗi lần render không.',
    ngayTraLoi: new Date('2024-11-14'),
    vote: 15,
    questionId: 2,
    content: 'Bạn cần thêm dependency array vào useEffect. Ví dụ: useEffect(() => { ... }, [dependency]). Nếu vẫn re-render thì kiểm tra xem dependency có phải là object/array mới tạo mỗi lần render không.',
    author: 'Nguyễn Văn A',
    date: new Date('2024-11-14'),
    votes: 15
  }
]

// Bình luận
export const mockComments = [
  {
    id: 1,
    maTaiLieu: 1,
    maSinhVien: 2,
    noiDungBinhLuan: 'Tài liệu rất hữu ích, cảm ơn bạn đã chia sẻ!',
    ngayBinhLuan: new Date('2024-11-11')
  },
  {
    id: 2,
    maTaiLieu: 2,
    maSinhVien: 3,
    noiDungBinhLuan: 'Bài tập này khó quá, có thể giải thích thêm không bạn?',
    ngayBinhLuan: new Date('2024-11-13')
  }
]

// Báo cáo vi phạm
export const mockReports = [
  {
    id: 1,
    maSinhVien: 3,
    maCauTraLoi: null,
    maBinhLuan: null,
    lyDo: 'Nội dung không phù hợp',
    ngayBaoCao: new Date('2024-11-15'),
    trangThaiBaoCao: 'Đang xử lý'
  }
]

// Quản trị viên
export const mockAdmins = [
  {
    id: 1,
    hoTenQuanTriVien: 'Admin Hệ thống',
    emailQuanTriVien: 'admin@edushare.vn',
    matKhauQuanTriVien: 'admin123'
  }
]
