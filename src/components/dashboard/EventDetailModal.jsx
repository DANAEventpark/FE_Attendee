import { createPortal } from 'react-dom'
import { X, Calendar, Clock, MapPin, AlertTriangle, Users, Tag, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import artImg from '@/assets/art.jpg'
import communityImg from '@/assets/community.jpg'
import educationImg from '@/assets/education.jpg'
import foodImg from '@/assets/food.jpg'
import musicImg from '@/assets/music.jpg'
import sportsImg from '@/assets/sports.jpg'
import heroFallback from '@/assets/hero.png'

/**
 * EventDetailModal — REQ_11
 * Modal hiển thị chi tiết sự kiện khi Attendee click "Xem chi tiết" trên Dashboard.
 * Đặc biệt: nếu sự kiện bị nhà tổ chức huỷ → hiển thị lý do huỷ nổi bật.
 *
 * Props:
 *   - registration: object Registration (bao gồm event đã eager load)
 *   - isOpen: boolean
 *   - onClose: function
 *   - tab: 'registered' | 'waitlist' | 'cancelled'
 */

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

const formatDateFull = (dateStr, lng) => {
  if (!dateStr) return 'Đang cập nhật'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 'Đang cập nhật'
  return new Intl.DateTimeFormat(lng === 'en' ? 'en-US' : 'vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function EventDetailModal({ registration, isOpen, onClose, tab }) {
  const { t, i18n } = useTranslation()

  if (!isOpen || !registration) return null

  const event = registration.event
  if (!event) return null

  const displayImage  = getCategoryImage(event.category?.image ?? '')
  const categoryName  = event.category?.name ?? 'Sự kiện'
  const isEventCancelledByOrganizer = event.status === 'cancelled'

  const startDate = formatDateFull(event.start_time, i18n.language)
  const endDate   = formatDateFull(event.end_time, i18n.language)
  const startTime = formatTime(event.start_time)
  const endTime   = formatTime(event.end_time)

  const REGISTRATION_STATUS_MAP = {
    approved:  { label: t('attendee_dashboard.modal.status.approved', 'Đã xác nhận'),   color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    pending:   { label: t('attendee_dashboard.modal.status.pending', 'Đang chờ duyệt'), color: 'bg-amber-100 text-amber-700 border-amber-200' },
    cancelled: { label: t('attendee_dashboard.modal.status.cancelled', 'Đã huỷ đăng ký'), color: 'bg-slate-100 text-slate-600 border-slate-200' },
  }

  const regStatus     = REGISTRATION_STATUS_MAP[registration.status] ?? REGISTRATION_STATUS_MAP.cancelled
  const registeredAt  = registration.created_at
    ? new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(registration.created_at))
    : t('attendee_dashboard.modal.unknown', 'Không rõ')

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">

        {/* ── Banner hình ảnh ── */}
        <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-3xl">
          <img
            src={displayImage}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = heroFallback }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-slate-900 transition-colors shadow"
          >
            <X size={16} />
          </button>

          {/* Badge danh mục */}
          <span className="absolute bottom-4 left-4 rounded-full bg-[#e96a52] px-4 py-1 text-xs font-bold text-white shadow">
            {t('category.' + categoryName, categoryName)}
          </span>
        </div>

        {/* ── Nội dung chi tiết ── */}
        <div className="p-6 space-y-5">

          {/* ⚠️ Banner huỷ bởi nhà tổ chức — HIỂN THỊ NỔI BẬT */}
          {tab === 'registered' && isEventCancelledByOrganizer && (
            <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">{t('attendee_dashboard.modal.event_cancelled_title', 'Sự kiện đã bị nhà tổ chức huỷ')}</p>
                {event.cancel_reason ? (
                  <p className="text-sm text-red-600 leading-relaxed">
                    <span className="font-medium">{t('attendee_dashboard.modal.reason_prefix', 'Lý do: ')}</span>{event.cancel_reason}
                  </p>
                ) : (
                  <p className="text-sm text-red-500 italic">{t('attendee_dashboard.modal.no_reason', 'Nhà tổ chức chưa cung cấp lý do huỷ.')}</p>
                )}
              </div>
            </div>
          )}

          {/* Tiêu đề */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
              {event.title}
            </h2>
          </div>

          {/* Thông tin meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ngày bắt đầu */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e96a52]/10">
                <Calendar size={15} className="text-[#e96a52]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{t('attendee_dashboard.modal.start_date', 'Ngày bắt đầu')}</p>
                <p className="text-sm font-medium text-slate-700">{startDate}</p>
              </div>
            </div>

            {/* Giờ */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e96a52]/10">
                <Clock size={15} className="text-[#e96a52]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{t('attendee_dashboard.modal.time', 'Thời gian')}</p>
                <p className="text-sm font-medium text-slate-700">
                  {startTime && endTime ? `${startTime} – ${endTime}` : (startTime || t('attendee_dashboard.modal.updating', 'Đang cập nhật'))}
                </p>
              </div>
            </div>

            {/* Địa điểm */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 sm:col-span-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e96a52]/10">
                <MapPin size={15} className="text-[#e96a52]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{t('attendee_dashboard.modal.location', 'Địa điểm')}</p>
                <p className="text-sm font-medium text-slate-700">{event.location ?? t('attendee_dashboard.modal.updating', 'Đang cập nhật')}</p>
              </div>
            </div>
          </div>

          {/* Mô tả sự kiện */}
          {event.description && (
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-2">{t('attendee_dashboard.modal.about_title', 'Giới thiệu sự kiện')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line line-clamp-5">
                {event.description}
              </p>
            </div>
          )}

          {/* Thông tin đăng ký của người dùng */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-700 mb-3">{t('attendee_dashboard.modal.your_reg_title', 'Thông tin đăng ký của bạn')}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{t('attendee_dashboard.modal.reg_status_label', 'Trạng thái đăng ký')}</span>
              <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${regStatus.color}`}>
                {regStatus.label}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{t('attendee_dashboard.modal.reg_date_label', 'Ngày đăng ký')}</span>
              <span className="font-medium text-slate-700">{registeredAt}</span>
            </div>
            {event.organizer?.name && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t('attendee_dashboard.modal.organizer_label', 'Ban tổ chức')}</span>
                <span className="font-medium text-slate-700">{event.organizer.name}</span>
              </div>
            )}
          </div>

          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {t('attendee_dashboard.modal.close', 'Đóng')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
