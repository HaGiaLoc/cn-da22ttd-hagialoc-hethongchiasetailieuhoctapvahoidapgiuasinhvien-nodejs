import { createContext, useContext, useState, useEffect } from 'react'
import { generateAvatar } from '../utils/helpers'
import authService from '../services/authService'

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
      setUser(parsedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await authService.login(email, password)
      const { user: userData, token, role } = response
      
      // Tạo user object với avatar
      const loggedInUser = {
        id: userData.maSinhVien || userData.maQuanTriVien,
        name: userData.hoTenSV || userData.hoTenQTV,
        email: userData.emailSV || userData.emailQTV,
        role: role,
        token: token,
        avatar: generateAvatar(userData.hoTenSV || userData.hoTenQTV),
        ...(role === 'student' && {
          maSinhVien: userData.maSinhVien,
          MSSV: userData.MSSV,
          Nganh: userData.Nganh
        })
      }
      
      setUser(loggedInUser)
      
      // Lưu vào localStorage nếu ghi nhớ, không thì sessionStorage
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(loggedInUser))
      } else {
        sessionStorage.setItem('user', JSON.stringify(loggedInUser))
      }
      
      return loggedInUser
    } catch (error) {
      throw new Error(error.message || 'Đăng nhập thất bại')
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register({
        email: userData.email,
        password: userData.password,
        hoTenSV: userData.hoTenSV
      })
      
      // Không tự động đăng nhập, chỉ trả về thông báo thành công
      return response
    } catch (error) {
      throw new Error(error.message || 'Đăng ký thất bại')
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
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
