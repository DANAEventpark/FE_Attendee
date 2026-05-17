import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
} from 'react-icons/fa'

import heroFallback from '@/assets/hero.png'

const DATE_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(dateValue) {
  if (!dateValue) return 'Đang cập nhật'
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Đang cập nhật'
  return DATE_FORMATTER.format(date)
}

function formatDateRange(startTime, endTime) {
  if (!startTime) return 'Đang cập nhật lịch trình'
  const start = new Date(startTime)
  const end = endTime ? new Date(endTime) : null
  if (Number.isNaN(start.getTime())) return 'Đang cập nhật lịch trình'

  const startLabel = DATE_FORMATTER.format(start)
  if (!end || Number.isNaN(end.getTime())) return startLabel

  return `${startLabel} - ${DATE_FORMATTER.format(end)}`
}

export default function EventCard({ event }) {
  const displayImage = event.category?.image_url || heroFallback
  const categoryName = event.category?.name ?? 'Sự kiện'
  const rating = Number(event.reviews_avg_rating ?? 0)
  const totalSlots = event.capacity ?? 0
  const registeredCount = event.confirmed_registrations_count ?? 0
  const remainingSlots = Math.max(0, totalSlots - registeredCount)

  return (
    <article className="w-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] font-sans">
      
      {/* 1. HÌNH ẢNH & BADGE DANH MỤC (Giống ảnh mẫu) */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImage}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(imageEvent) => {
            imageEvent.currentTarget.onerror = null
            imageEvent.currentTarget.src = heroFallback
          }}
        />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#cc2bd6] px-4 py-1 text-sm font-semibold text-white shadow-sm">
          {categoryName}
        </span>
      </div>

      {/* KHỐI NỘI DUNG CHÍNH */}
      <div className="p-5 space-y-4">
        
        {/* 2. TIÊU ĐỀ SỰ KIỆN */}
        <h3 className="text-[21px] font-bold text-[#2d4a57] leading-snug">
          {event.title}
        </h3>

        <div className="space-y-2.5 text-[15px] text-[#7d5142] font-medium">
          {/* Thời gian diễn ra */}
          <div className="flex items-start gap-2.5">
            <FaCalendarAlt className="text-[16px] text-slate-500 mt-1 shrink-0" />
            <span>{formatDateRange(event.start_time, event.end_time)}</span>
          </div>

          {/* Địa điểm */}
          <div className="flex items-start gap-2.5">
            <FaMapMarkerAlt className="text-[17px] text-slate-500 mt-0.5 shrink-0" />
            <span>{event.location ?? 'Đang cập nhật địa điểm'}</span>
          </div>

          {/* Hạn đăng ký (Vẫn hiển thị đầy đủ) */}
          <div className="flex items-start gap-2.5">
            <FaClock className="text-[16px] text-slate-500 mt-1 shrink-0" />
            <span>
              Hạn đăng ký: <b className="text-slate-900 font-semibold">{formatDate(event.registration_deadline)}</b>
            </span>
          </div>
        </div>

        {/* 4. SLOT CÒN LẠI & RATING  */}
        <div className="flex items-center justify-between pt-1">
          {/* Hiển thị số slot dạng Còn X/Y slot */}
          <p className="text-[16px] font-bold text-[#2d4a57]">
            Còn {remainingSlots}/{totalSlots} slot
          </p>
          
          {/* Số điểm đánh giá sao */}
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
            <FaStar className="text-amber-400 text-base" />
            <span>{rating > 0 ? rating.toFixed(1) : 'Mới'}</span>
          </div>
        </div>

      
        <button 
          type="button"
          className="w-full rounded-[14px] bg-[#e14d34] py-3 text-center text-[16px] font-bold text-white transition-all duration-200 hover:bg-[#c93f28] active:scale-[0.98]"
        >
          Xem chi tiết
        </button>

      </div>
    </article>
  )
}