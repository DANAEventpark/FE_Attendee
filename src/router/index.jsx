import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import EventDetailPage from '@/pages/EventDetailPage'

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
  // Các route sẽ được thêm theo từng REQ:
  // { path: '/login', element: <LoginPage /> },
  // { path: '/events', element: <EventListPage /> },
  { path: '/events/:id', element: <EventDetailPage /> },
  // { path: '/profile', element: <ProfilePage /> },
])

export default router
