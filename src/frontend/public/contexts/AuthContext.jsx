import { createContext, useContext, useState, useEffect } from 'react'
import { generateAvatar } from '../utils/helpers'
import authService from '../api/authApi'

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
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user')
    const isRemembered = localStorage.getItem('rememberMe')
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      
      // Kiểm tra rememberMe trước
      if (isRemembered === 'true') {
        // Remember me = true, luôn giữ đăng nhập
        setUser(parsedUser)
      } else if (isRemembered === 'false') {
        // Remember me = false, kiểm tra sessionStorage
        const isTemporary = sessionStorage.getItem('isTemporarySession')
        
        if (isTemporary === 'true') {
          // Tab hiện tại đã có đánh dấu temporary, giữ đăng nhập
          setUser(parsedUser)
        } else {
          // Tab mới hoặc phiên mới: kế thừa session từ localStorage
          // Đánh dấu tab này cũng là temporary
          sessionStorage.setItem('isTemporarySession', 'true')
          setUser(parsedUser)
        }
      } else {
        // Không có rememberMe (dữ liệu cũ), mặc định giữ đăng nhập
        setUser(parsedUser)
      }
    }
    setLoading(false)

    // Tạo ID duy nhất cho tab này
    let tabId = sessionStorage.getItem('tabId')
    if (!tabId) {
      tabId = 'tab_' + Date.now() + '_' + Math.random()
      sessionStorage.setItem('tabId', tabId)
    }
    
    // Tăng tab counter nếu là session temporary và tab chưa được đếm
    const tabCounted = sessionStorage.getItem('tabCounted')
    if (isRemembered === 'false' && tabCounted !== 'true') {
      const tabCount = parseInt(localStorage.getItem('tabCount') || '0')
      localStorage.setItem('tabCount', (tabCount + 1).toString())
      sessionStorage.setItem('tabCounted', 'true')
    }

    // Xử lý khi đóng tab (không phải reload)
    const handleBeforeUnload = (e) => {
      const rememberMe = localStorage.getItem('rememberMe')
      if (rememberMe === 'false') {
        // Đặt cờ sẽ reload để kiểm tra sau
        sessionStorage.setItem('isReloading', 'true')
        
        // Xóa cờ sau 500ms (nếu không reload thì đây là đóng tab thật)
        setTimeout(() => {
          const stillReloading = sessionStorage.getItem('isReloading')
          if (stillReloading === 'true') {
            // Sau 500ms vẫn có cờ = đang đóng tab, giảm counter
            const tabCount = parseInt(localStorage.getItem('tabCount') || '1')
            const newCount = Math.max(0, tabCount - 1)
            
            if (newCount === 0) {
              // Đây là tab cuối cùng, xóa user
              localStorage.removeItem('user')
              localStorage.removeItem('rememberMe')
              localStorage.removeItem('tabCount')
            } else {
              localStorage.setItem('tabCount', newCount.toString())
            }
            
            // Xóa đánh dấu tab đã đếm
            sessionStorage.removeItem('tabCounted')
          }
        }, 500)
      }
    }
    
    // Xử lý khi load xong trang - xóa cờ reload
    const handlePageShow = () => {
      // Xóa cờ reload khi trang load thành công
      sessionStorage.removeItem('isReloading')
    }

    // Lắng nghe thay đổi storage từ các tab khác
    const handleStorageChange = (e) => {
      // User bị xóa từ tab khác (đăng xuất), logout tab này
      if (e.key === 'user' && !e.newValue) {
        setUser(null)
        sessionStorage.removeItem('tabCounted')
        sessionStorage.removeItem('isTemporarySession')
      }
      // User được cập nhật từ tab khác (đăng nhập), đồng bộ
      else if (e.key === 'user' && e.newValue) {
        const newUser = JSON.parse(e.newValue)
        setUser(newUser)
        // Nếu là session temporary, đánh dấu tab này cũng temporary
        const rememberMe = localStorage.getItem('rememberMe')
        if (rememberMe === 'false') {
          sessionStorage.setItem('isTemporarySession', 'true')
          // Đếm tab nếu chưa đếm
          const tabCounted = sessionStorage.getItem('tabCounted')
          if (tabCounted !== 'true') {
            const tabCount = parseInt(localStorage.getItem('tabCount') || '0')
            localStorage.setItem('tabCount', (tabCount + 1).toString())
            sessionStorage.setItem('tabCounted', 'true')
          }
        }
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('storage', handleStorageChange)
    }
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
      
      // Luôn lưu vào localStorage để chia sẻ giữa các tab
      localStorage.setItem('user', JSON.stringify(loggedInUser))
      localStorage.setItem('rememberMe', rememberMe.toString())
      
      if (!rememberMe) {
        // Đánh dấu session này không được ghi nhớ (chỉ tồn tại trong phiên trình duyệt)
        sessionStorage.setItem('isTemporarySession', 'true')
        // Tăng counter số tab đang mở
        const tabCount = parseInt(localStorage.getItem('tabCount') || '0')
        localStorage.setItem('tabCount', (tabCount + 1).toString())
      } else {
        // Remember me = true, xóa đánh dấu temporary nếu có
        sessionStorage.removeItem('isTemporarySession')
        localStorage.removeItem('tabCount')
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
    sessionStorage.removeItem('isTemporarySession')
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('tabCount')
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
