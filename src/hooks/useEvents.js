import { useEffect, useState } from 'react'
import { getEvents } from '@/services/eventService'

export default function useEvents(initialPage = 1, search = '', categoryId = 'all', timeFilter = 'upcoming') {
  const [page, setPage] = useState(initialPage)
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 6,
    total: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Khi bất kỳ bộ lọc nào thay đổi (từ khóa, danh mục, thời gian), ép trang quay về 1
  useEffect(() => {
    setPage(1)
  }, [search, categoryId, timeFilter])

  useEffect(() => {
    let cancelled = false

    async function loadEvents() {
      setLoading(true)
      setError('')

      try {
        // Gọi API với đầy đủ 4 tham số phân trang, tìm kiếm, danh mục và mốc thời gian
        const payload = await getEvents(page, search.trim(), categoryId, timeFilter)

        if (cancelled) {
          return
        }

        // Cập nhật danh sách sự kiện từ Laravel
        setEvents(payload.data || [])

        // Đọc cấu trúc phân trang phẳng trực tiếp từ Laravel Paginate
        setPagination({
          currentPage: payload.current_page || 1,
          lastPage: payload.last_page || 1,
          perPage: payload.per_page || 6,
          total: payload.total || 0,
        })

      } catch (fetchError) {
        if (cancelled) {
          return
        }

        console.error(fetchError)
        setEvents([])
        setError(
          fetchError.response?.data?.message ?? 'Không thể tải danh sách sự kiện lúc này.'
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      cancelled = true
    }
  }, [page, search, categoryId, timeFilter])

  return {
    events,
    pagination,
    loading,
    error,
    page,
    setPage,
  }
}