import { useDeferredValue, useEffect, useState } from 'react'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

import Hero from '@/components/hero/Hero'

import SearchBar from '@/components/filters/SearchBar'
import CategoriesList from '@/components/filters/CategoriesList'

import EventResults from '@/components/events/EventResults'

import useEvents from '@/hooks/useEvents'
import { getCategories } from '@/services/categoryService'
// Import thêm hàm getSystemStats từ file eventService của bạn
import { getSystemStats } from '@/services/eventService' 

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState('all')
  const [timeFilter, setTimeFilter] = useState('upcoming')

  // KHAI BÁO STATE LƯU SỐ THỐNG KÊ CỨNG TOÀN HỆ THỐNG
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalOrganizers: 0
  })

  const deferredSearchTerm = useDeferredValue(searchTerm)

  const {
    events,
    pagination,
    loading,
    error,
    page,
    setPage,
  } = useEvents(
    1,
    deferredSearchTerm,
    activeCategoryId,
    timeFilter
  )

  // Gọi các API load dữ liệu hệ thống ngay khi vừa mount component
  useEffect(() => {
    async function loadInitialData() {
      try {
        // 1. Tải danh mục sự kiện
        const catResponse = await getCategories()
        setCategories(catResponse.data || catResponse)

        // 2. Tải số liệu thống kê cứng từ database
        const statsResponse = await getSystemStats()
        if (statsResponse.success) {
          setStats({
            totalEvents: statsResponse.data.total_events,
            totalRegistrations: statsResponse.data.total_registrations,
            totalOrganizers: statsResponse.data.total_organizers
          })
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", error)
      }
    }

    loadInitialData()
  }, [])

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pagination.lastPage
    ) {
      return
    }

    setPage(newPage)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="min-h-screen bg-[#f4efe7] text-slate-900">
      <Navbar />

      {/* TRUYỀN CÁC SỐ THỐNG KÊ CỨNG LẤY TỪ DATABASE VÀO ĐÂY */}
      <Hero
        totalEvents={stats.totalEvents}
        totalRegistrations={stats.totalRegistrations}
        totalOrganizers={stats.totalOrganizers}
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      <CategoriesList
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#e96a52]">
              Event feed
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Các sự kiện nổi bật
            </h2>
            {searchTerm && (
              <p className="mt-3 text-sm text-slate-500">
                Kết quả tìm kiếm cho:
                <span className="ml-1 font-semibold text-[#e96a52]">
                  "{searchTerm}"
                </span>
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
            Trang {pagination.currentPage} / {pagination.lastPage}
          </div>
        </div>

        <EventResults
          loading={loading}
          error={error}
          events={events}
          pagination={pagination}
          page={page}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
    </div>
  )
}