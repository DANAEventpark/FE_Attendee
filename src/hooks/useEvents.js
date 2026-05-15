import { useEffect, useState } from 'react'
import { getEvents } from '@/services/eventService'

export default function useEvents(initialPage = 1) {

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

  useEffect(() => {

    let cancelled = false

    async function loadEvents() {

      setLoading(true)

      setError('')

      try {

        const payload = await getEvents(page)

        console.log(payload)

        if (cancelled) {
          return
        }

        // EVENTS

        setEvents(payload.data || [])

        // PAGINATION

        setPagination({
          currentPage:
            payload.pagination?.currentPage || 1,

          lastPage:
            payload.pagination?.lastPage || 1,

          perPage:
            payload.pagination?.perPage || 6,

          total:
            payload.pagination?.total || 0,
        })

      } catch (fetchError) {

        if (cancelled) {
          return
        }

        console.error(fetchError)

        setEvents([])

        setError(
          fetchError.response?.data?.message
          ?? 'Khong the tai danh sach su kien luc nay.'
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

  }, [page])

  return {
    events,
    pagination,
    loading,
    error,
    page,
    setPage,
  }
}