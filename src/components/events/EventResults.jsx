import EventGrid from './EventGrid'
import EventPagination from './EventPagination'
import EventSkeleton from './EventSkeleton'
import EventEmpty from './EventEmpty'

export default function EventResults({
  loading,
  error,
  events,
  pagination,
  page,
  onPageChange,
}) {

  if (error) {
    return (
      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {Array.from({ length: 6 }).map(
          (_, index) => (
            <EventSkeleton key={index} />
          )
        )}

      </div>
    )
  }

  if (events.length === 0) {
    return <EventEmpty />
  }


  return (
    <>
      <EventGrid events={events} />

      <EventPagination
        page={page}
        lastPage={pagination.lastPage}
        onPageChange={onPageChange}
      />
    </>
  )
}