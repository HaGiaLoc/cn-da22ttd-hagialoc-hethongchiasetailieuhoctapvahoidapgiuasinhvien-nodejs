export function formatDate(date) {
  if (!date) {
    return 'Ch\u01b0a c\u1eadp nh\u1eadt'
  }
  
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  
  // Ki\u1ec3m tra date h\u1ee3p l\u1ec7
  if (isNaN(date.getTime())) {
    return 'Ch\u01b0a c\u1eadp nh\u1eadt'
  }
  
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Vừa xong'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ngày trước`
  } else {
    return date.toLocaleDateString('vi-VN')
  }
}

export function formatNumber(num) {
  if (num === undefined || num === null) {
    return '0'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// showNotification is now provided by NotificationContext
// Import and use: const { showNotification } = useNotification()

export function getFileIcon(filename) {
  const extension = filename.split('.').pop().toLowerCase()
  const iconMap = {
    'pdf': 'fa-file-pdf',
    'doc': 'fa-file-word',
    'docx': 'fa-file-word',
    'ppt': 'fa-file-powerpoint',
    'pptx': 'fa-file-powerpoint',
    'xls': 'fa-file-excel',
    'xlsx': 'fa-file-excel'
  }
  return iconMap[extension] || 'fa-file'
}

// Hàm chuẩn hóa chuỗi: bỏ dấu, chuyển chữ thường
export function normalizeString(str) {
  if (!str) return ''
  
  // Chuyển về chữ thường
  str = str.toLowerCase()
  
  // Bỏ dấu tiếng Việt
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Thay đổi ký tự đặc biệt
  str = str.replace(/đ/g, 'd')
  str = str.replace(/Đ/g, 'd')
  
  return str
}

// Hàm tìm kiếm không phân biệt dấu, hoa thường
export function searchMatch(text, searchTerm) {
  if (!searchTerm) return true
  if (!text) return false
  
  const normalizedText = normalizeString(text)
  const normalizedSearch = normalizeString(searchTerm)
  
  return normalizedText.includes(normalizedSearch)
}

/**
 * Tạo avatar URL từ tên đầy đủ
 * @param {string} fullName - Tên đầy đủ của người dùng
 * @returns {string} URL avatar
 */
export function generateAvatar(fullName) {
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

/**
 * Lấy URL đầy đủ của avatar từ đường dẫn tương đối hoặc tạo avatar mặc định
 * @param {string} avatarPath - Đường dẫn avatar từ backend (có thể là tương đối hoặc URL)
 * @param {string} fullName - Tên đầy đủ để tạo avatar mặc định nếu không có avatarPath
 * @returns {string} URL avatar đầy đủ
 */
export function getAvatarUrl(avatarPath, fullName) {
  // Nếu không có avatarPath, tạo avatar từ tên
  if (!avatarPath) {
    return generateAvatar(fullName)
  }
  
  // Nếu đã là URL đầy đủ (http/https), trả về luôn
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }
  
  // Nếu là đường dẫn tương đối, tạo URL đầy đủ
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`
  return `${baseUrl}${cleanPath}`
}

// Map enum values (lưu trong DB) sang nhãn tiếng Việt hiển thị trên giao diện
export function getEnumLabel(type, value) {
  if (!value) return ''
  const v = String(value).toLowerCase()

  const maps = {
    questionStatus: {
      show: 'Đang hiển thị',
      answered: 'Đã trả lời',
      hidden: 'Đã ẩn'
    },
    answerStatus: {
      show: 'Đang hiển thị',
      hidden: 'Đã ẩn'
    },
    documentStatus: {
      show: 'Hiển thị',
      hidden: 'Ẩn'
    },
    reportStatus: {
      pending: 'Chờ xử lý',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    },
    reportReason: {
      copyright: 'Vi phạm bản quyền',
      misinformation: 'Thông tin sai lệch',
      inappropriate_content: 'Nội dung không phù hợp',
      spam: 'Spam',
      other: 'Khác'
    },
    reportType: {
      document: 'Tài liệu',
      question: 'Câu hỏi',
      answer: 'Câu trả lời'
    },
    userStatus: {
      active: 'Hoạt động',
      locked: 'Bị khóa'
    }
  }

  const map = maps[type]
  return map?.[v] || value
}
