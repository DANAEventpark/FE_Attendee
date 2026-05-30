import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import CategoryPage from '@/pages/CategoryPage'
import EventByCategoryPage from '@/pages/EventByCategoryPage'
import AboutPage from '@/pages/AboutPage'
import EventDetailPage from '@/pages/EventDetailPage'
import DashboardPage from '@/pages/DashboardPage'

/**
 * Router Configuration — FE_Attendee
 * Quản lý tất cả các route của ứng dụng
 * Sử dụng: createBrowserRouter (React Router v7)
 */
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/events/:id',
        element: <EventDetailPage />
      },
      {
        path: '/categories',
        element: <CategoryPage />,
      },
      {
        path: '/categories/:id/events',
        element: <EventByCategoryPage />
      },
      {
        path: '/about',
        element: <AboutPage />
      },
      {
        // REQ_11 — Attendee Dashboard: lịch sử đăng ký
        path: '/dashboard',
        element: <DashboardPage />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
])

export default router
