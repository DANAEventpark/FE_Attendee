import { useDeferredValue, useEffect, useState } from 'react'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

import Hero from '@/components/hero/Hero'

import SearchBar from '@/components/filters/SearchBar'
import CategoriesList from '@/components/filters/CategoriesList'

import EventResults from '@/components/events/EventResults'

import useEvents from '@/hooks/useEvents'
import { getCategories } from '@/services/categoryService'

export default function HomePage() {

  const [categories, setCategories] = useState([])

  const [searchTerm, setSearchTerm] =
    useState('')

  const [activeCategoryId, setActiveCategoryId] =
    useState('all')

  const [timeFilter, setTimeFilter] =
    useState('upcoming')

  const deferredSearchTerm =
    useDeferredValue(searchTerm)

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

    async function loadCategories() {

      try {

        const response =
          await getCategories()

        setCategories(
          response.data || response
        )

      } catch (error) {
        console.error(error)
      }
    }

    loadCategories()

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

      <Navbar />

      <Hero
        totalEvents={pagination.total ?? 0}
        categoriesCount={categories.length}
        registeredPreview={registeredPreview}
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