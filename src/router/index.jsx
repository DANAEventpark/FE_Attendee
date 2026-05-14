import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import ProtectedRoute from '@/components/ProtectedRoute'

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
    path: '/events',
    element: (
      <ProtectedRoute role="attendee">
        <EventsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])

export default router
