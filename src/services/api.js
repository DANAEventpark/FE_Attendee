import axios from 'axios'
import useAuthStore from '@/store/authStore'

/**
 * Axios Instance — FE_Attendee
 * Cấu hình HTTP client gọi đến Laravel API (BE_DANAEventpark)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Request Interceptor ───────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const lang = localStorage.getItem('i18nextLng') || 'vi'
    if (config.headers) {
      config.headers['Accept-Language'] = lang
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ──────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || ''
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/google') ||
      requestUrl.includes('/auth/register')

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      window.location.pathname !== '/login'
    ) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
