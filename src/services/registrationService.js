import client from '@/api/client'

/**
 * registrationService.js — REQ_11
 * Tất cả API calls liên quan đến lịch sử đăng ký của Attendee Dashboard.
 * Sử dụng axios client đã được cấu hình JWT tự động.
 */

/**
 * Lấy thống kê dashboard: số lượng đã đăng ký / waitlist / đã huỷ
 * GET /api/attendee/dashboard/stats
 */
export const getDashboardStats = async () => {
  const response = await client.get('/attendee/dashboard/stats')
  return response.data
}

/**
 * Lấy danh sách sự kiện đã đăng ký (registration.status = approved)
 * GET /api/attendee/dashboard/registrations
 * @param {Object} params - { page, search, category_id, year }
 */
export const getRegistrations = async (params = {}) => {
  const response = await client.get('/attendee/dashboard/registrations', { params })
  return response.data
}

/**
 * Lấy danh sách sự kiện đã tham gia (đã kết thúc)
 * GET /api/attendee/dashboard/done
 */
export const getDoneRegistrations = async (params = {}) => {
  const response = await client.get('/attendee/dashboard/done', { params })
  return response.data
}

/**
 * Lấy danh sách đang chờ (registration.status = pending)
 * GET /api/attendee/dashboard/waitlist
 * @param {Object} params - { page, search, category_id, year }
 */
export const getWaitlist = async (params = {}) => {
  const response = await client.get('/attendee/dashboard/waitlist', { params })
  return response.data
}

/**
 * Lấy danh sách đã huỷ (registration.status = cancelled)
 * GET /api/attendee/dashboard/cancelled
 * @param {Object} params - { page, search, category_id, year }
 */
export const getCancelledRegistrations = async (params = {}) => {
  const response = await client.get('/attendee/dashboard/cancelled', { params })
  return response.data
}
