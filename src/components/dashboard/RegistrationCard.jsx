import { Calendar, Clock, MapPin, AlertTriangle, Loader2, Users } from 'lucide-react'
import artImg from '@/assets/art.jpg'
import communityImg from '@/assets/community.jpg'
import educationImg from '@/assets/education.jpg'
import foodImg from '@/assets/food.jpg'
import musicImg from '@/assets/music.jpg'
import sportsImg from '@/assets/sports.jpg'
import heroFallback from '@/assets/hero.png'

/**
 * RegistrationCard — REQ_11
 * Thẻ sự kiện dạng ngang (horizontal) dùng trong Attendee Dashboard.
 * Props:
 *   - registration: object Registration (bao gồm event đã eager load)
 *   - tab: 'registered' | 'waitlist' | 'cancelled'
 *   - onViewDetail: function(registration) — mở modal chi tiết
 */

// Map tên file ảnh từ DB sang asset đã import
const getCategoryImage = (imageName) => {
  switch (imageName) {
    case 'art.jpg':       return artImg
    case 'community.jpg': return communityImg
    case 'education.jpg': return educationImg
    case 'food.jpg':      return foodImg
    case 'music.jpg':     return musicImg
    case 'sports.jpg':    return sportsImg
    default:              return heroFallback
  }
}

// Format ngày theo kiểu: Thứ X, DD/MM/YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return 'Đang cập nhật'
  const date = new Date(typeof dateStr === 'string' ? dateStr.replace(/-/g, '/') : dateStr)
  if (isNaN(date.getTime())) return 'Đang cập nhật'
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

// Format giờ HH:MM
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(typeof dateStr === 'string' ? dateStr.replace(/-/g, '/') : dateStr)
  if (isNaN(date.getTime())) return ''
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export default function RegistrationCard({ registration, tab, onViewDetail }) {
  const event = registration?.event
  if (!event) return null

  const categoryName  = event.category?.name  ?? 'Sự kiện'
  const categoryImage = event.category?.image ?? ''
  const displayImage  = getCategoryImage(categoryImage)

  const startTime = formatTime(event.start_time)
  const endTime   = formatTime(event.end_time)
  const timeRange = startTime && endTime ? `${startTime} – ${endTime}` : (startTime || 'Đang cập nhật')

  // Trạng thái sự kiện (do nhà tổ chức huỷ) — chỉ hiển thị ở tab "registered"
  const isEventCancelled = event.status === 'cancelled'

  return (
    <article className="group flex gap-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-4">

      {/* ── Hình ảnh sự kiện ── */}
      <div className="relative w-36 h-24 sm:w-48 sm:h-32 shrink-0 overflow-hidden rounded-lg">
        <img
          src={displayImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = heroFallback }}
        />
      </div>

      {/* ── Nội dung chính ── */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          {/* Badge danh mục & trạng thái */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded bg-[#E8F5F8] px-2.5 py-0.5 text-xs font-bold text-[#2E6E7E]">
              {categoryName}
            </span>
            {/* Trạng thái đăng ký */}
            {tab === 'registered' && (
              isEventCancelled ? (
                <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600 border border-red-200">
                  Canceled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-200">
                  Coming soon
                </span>
              )
            )}
            {tab === 'waitlist' && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-[#C0442B] border border-amber-200">
                Đang chờ
              </span>
            )}
            {tab === 'cancelled' && (
              <span className="inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                Đã huỷ đăng ký
              </span>
            )}
          </div>

          {/* Tiêu đề */}
          <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug line-clamp-1 mt-1 hover:text-[#C0442B] transition-colors">
            {event.title}
          </h3>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs sm:text-[13px] text-slate-500 font-semibold mt-3">
            {/* Ngày */}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              {formatDate(event.start_time)}
            </span>
            {/* Giờ */}
            {(startTime || endTime) && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400 shrink-0" />
                {timeRange}
              </span>
            )}
            {/* Địa điểm */}
            {event.location && (
              <span className="flex items-center gap-1.5 truncate max-w-[250px]">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
          </div>

          {/* Cảnh báo sự kiện bị nhà tổ chức huỷ */}
          {tab === 'registered' && isEventCancelled && event.cancel_reason && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-2.5 py-1.5 mt-2 line-clamp-1 border border-red-100">
              <AlertTriangle size={11} className="inline mr-1" />
              Lý do huỷ: {event.cancel_reason}
            </p>
          )}
        </div>

        {/* Nút Xem chi tiết */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onViewDetail(registration)}
            className="rounded bg-[#C0442B] px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#A83821] active:scale-[0.97] transition-all duration-200 shadow-sm"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </article>
  )
}
