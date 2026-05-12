import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * useAuthStore — FE_Attendee
 * Quản lý state xác thực toàn cục
 *
 * State:
 *  - user: thông tin người dùng đang đăng nhập
 *  - token: JWT access token
 *  - isAuthenticated: trạng thái đã xác thực
 *
 * Actions:
 *  - setAuth(user, token): lưu thông tin sau khi login thành công
 *  - clearAuth(): xoá thông tin khi logout hoặc token hết hạn
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'dana-attendee-auth', // key trong localStorage
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)

export default useAuthStore
