import { createContext, useContext, useState, useEffect } from 'react'
import { mockStudents, generateAvatar } from '../data/mockData'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage or sessionStorage
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      // Tìm thông tin student đệ lấy avatar mới nhất
      const student = mockStudents.find(s => s.id === parsedUser.id)
      if (student) {
        parsedUser.avatar = student.avatar || generateAvatar(student.hoTenSinhVien)
        parsedUser.truongHoc = student.truongHoc
        parsedUser.nganh = student.nganh
        // Cập nhật lại storage
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(parsedUser))
        } else {
          sessionStorage.setItem('user', JSON.stringify(parsedUser))
        }
      }
      setUser(parsedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password, rememberMe = false) => {
    // Tìm sinh viên theo email và mật khẩu từ mockStudents
    const student = mockStudents.find(
      s => s.email === email && s.matKhauSinhVien === password
    )
    
    if (!student) {
      throw new Error('Email hoặc mật khẩu không đúng')
    }
    
    const mockUser = {
      id: student.id,
      name: student.hoTenSinhVien,
      email: student.email,
      maSinhVien: student.maSinhVien,
      avatar: student.avatar || generateAvatar(student.hoTenSinhVien)
    }
    setUser(mockUser)
    
    // Lưu vào localStorage nếu ghi nhớ, không thì sessionStorage
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(mockUser))
    } else {
      sessionStorage.setItem('user', JSON.stringify(mockUser))
    }
    
    return mockUser
  }

  const register = async (userData) => {
    // Mock register - replace with actual API call
    // Chỉ trả về thông tin đăng ký thành công, không tự động đăng nhập
    const newId = mockStudents.length + 1
    const fullName = `${userData.firstName} ${userData.lastName}`
    const newUser = {
      id: newId,
      name: fullName,
      email: userData.email,
      maSinhVien: `SV${String(newId).padStart(3, '0')}`,
      avatar: generateAvatar(fullName)
    }
    // Không set user và không lưu vào storage
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
  }

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
