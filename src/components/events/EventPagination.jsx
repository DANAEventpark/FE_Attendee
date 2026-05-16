export default function EventPagination({
  page,
  lastPage,
  onPageChange,
}) {
  if (lastPage <= 1) {
    return null
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">

      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>

      {Array.from(
        { length: lastPage },
        (_, index) => {
          const pageNumber = index + 1

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
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

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === lastPage}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>

    </div>
  )
}