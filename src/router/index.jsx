import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import CategoryPage from '@/pages/CategoryPage'
import EventByCategoryPage from '@/pages/EventByCategoryPage'
import AboutPage from '@/pages/AboutPage'
import EventDetailPage from '@/pages/EventDetailPage'

// Dummy component
const EventsPage = () => <div className="p-8 text-2xl font-bold">Attendee Events Page</div>;

/**
 * Router Configuration — FE_Attendee
 * Quản lý tất cả các route của ứng dụng
 * Sử dụng: createBrowserRouter (React Router v7)
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/events',
    element: (
      <ProtectedRoute role="attendee">
        <EventsPage />
      </ProtectedRoute>
    )
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
    path: '*',
    element: <Navigate to="/" replace />
  }
])

export default router
