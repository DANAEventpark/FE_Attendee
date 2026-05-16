export default function EventEmpty() {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">

      <h3 className="text-2xl font-semibold text-slate-900">
        Không tìm thấy sự kiện phù hợp
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
        Thử nhập từ khóa khác hoặc đổi mốc thời gian xem sao nhé.
      </p>

    </div>
  )
}