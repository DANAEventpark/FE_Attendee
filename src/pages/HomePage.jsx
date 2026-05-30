import { useDeferredValue, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';



import Hero from '@/components/hero/hero'

import SearchBar from '@/components/filters/searchbar'
import CategoriesList from '@/components/filters/categoriesList'

import EventResults from '@/components/events/EventResults'

import useEvents from '@/hooks/useEvents'
import { getCategories } from '@/services/categoryService'
import { getSystemStats } from '@/services/eventService'

export default function HomePage() {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState('all')
  const [timeFilter, setTimeFilter] = useState('upcoming')

  // State for dynamic system stats
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

  useEffect(() => {
    async function loadInitialData() {
      try {
        // 1. Fetch categories
        const catRes = await getCategories()
        setCategories(catRes.data || catRes)

        // 2. Fetch system stats
        const statsRes = await getSystemStats()
        if (statsRes.success) {
          setStats({
            totalEvents: statsRes.data.total_events,
            totalRegistrations: statsRes.data.total_registrations,
            totalOrganizers: statsRes.data.total_organizers
          })
        }
      } catch (error) {
        console.error("Lỗi khi tải số liệu hệ thống:", error)
      }
    }
    loadInitialData()
  }, [])

  const registeredPreview = events.reduce(
    (total, event) =>
      total +
      Number(
        event.confirmed_registrations_count ?? 0
      ),
    0
  )

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
              {t('home.event_feed')}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {t('home.featured_events')}
            </h2>
            {searchTerm && (
              <p className="mt-3 text-sm text-slate-500">
                {t('home.search_results_for')}
                <span className="ml-1 font-semibold text-[#e96a52]">
                  "{searchTerm}"
                </span>
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">

            {t('home.page_of', { current: pagination.currentPage, total: pagination.lastPage })}

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


    </div>
  )
}