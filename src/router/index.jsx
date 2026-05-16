import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import CategoryPage from '@/pages/CategoryPage'; 
import EventByCategoryPage from '@/pages/EventByCategoryPage';
import AboutPage from '@/pages/AboutPage';
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
    path: '/categories',
    element: <CategoryPage />,
  },
  {
    path: "/categories/:id/events",
    element: <EventByCategoryPage />
  },
  {
    path: "/about",
    element: <AboutPage />
  }
  // Các route sẽ được thêm theo từng REQ:
  // { path: '/login', element: <LoginPage /> },
  // { path: '/events', element: <EventListPage /> },
  // { path: '/events/:id', element: <EventDetailPage /> },
  // { path: '/profile', element: <ProfilePage /> },
])

export default router
