import { useDeferredValue, useEffect, useState } from 'react'

import CategoriesList from '@/components/categoriesList'
import EventCard from '@/components/EventCard'
import Footer from '@/components/footer'
import Hero from '@/components/hero'
import Navbar from '@/components/navbar'
import SearchBar from '@/components/searchbar'

import useEvents from '@/hooks/useEvents'

import { getCategories } from '@/services/categoryService'

function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="h-56 animate-pulse bg-slate-200" />

      <div className="space-y-3 p-5">
        <div className="h-6 animate-pulse rounded bg-slate-200" />
        <div className="h-4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  )
}

export default function HomePage() {

  const {
    events,
    pagination,
    loading,
    error,
    page,
    setPage,
  } = useEvents()

  const [categories, setCategories] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const [activeCategoryId, setActiveCategoryId] = useState('all')

  const deferredSearchTerm = useDeferredValue(searchTerm)

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getCategories()

        setCategories(response.data || response)
      } catch (error) {
        console.error(error)
      }
    }

    loadCategories()
  }, [])

  // FILTER

  const keyword = deferredSearchTerm.trim().toLowerCase()

  const filteredEvents = events.filter((event) => {

    const matchCategory =
      activeCategoryId === 'all' ||
      String(event.category?.id) === String(activeCategoryId)

    const matchKeyword =
      keyword.length === 0 ||
      [
        event.title,
        event.description,
        event.location,
        event.category?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword)

    return matchCategory && matchKeyword
  })

  const registeredPreview = events.reduce(
    (total, event) =>
      total + Number(event.confirmed_registrations_count ?? 0),
    0
  )

  // CHANGE PAGE

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
        totalEvents={pagination.total ?? events.length}
        categoriesCount={categories.length}
        registeredPreview={registeredPreview}
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        resultsCount={filteredEvents.length}
      />

      <CategoriesList
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />

      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#e96a52]">
              Event feed
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Các sự kiện nổi bật
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Khám phá các sự kiện hấp dẫn tại Đà Nẵng.
            </p>

          </div>

          <div className="rounded-2xl bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
            Trang {pagination.currentPage} / {pagination.lastPage}
          </div>

        </div>

        {/* ERROR */}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {/* LOADING */}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {Array.from({ length: 6 }).map((_, index) => (
              <EventSkeleton key={index} />
            ))}

          </div>
        ) : filteredEvents.length > 0 ? (

          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}

            </div>

            {/* PAGINATION */}

            {pagination.lastPage > 1 && (

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">

                {/* PREV */}

                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {/* PAGE */}

                {Array.from(
                  { length: pagination.lastPage },
                  (_, index) => {

                    const pageNumber = index + 1

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`h-10 w-10 rounded-xl text-sm font-semibold transition
                        ${
                          page === pageNumber
                            ? 'bg-[#e96a52] text-white'
                            : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  }
                )}

                {/* NEXT */}

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.lastPage}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>

              </div>
            )}
          </>
        ) : (

          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">

            <h3 className="text-2xl font-semibold text-slate-900">
              Không tìm thấy sự kiện phù hợp
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Thử từ khóa khác hoặc đổi danh mục.
            </p>

          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}