export function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
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
