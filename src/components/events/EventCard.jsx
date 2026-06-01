import { useMemo, useCallback } from 'react'
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import heroFallback from '@/assets/hero.png'
import artImg from '@/assets/art.jpg'
import communityImg from '@/assets/community.jpg'
import educationImg from '@/assets/education.jpg'
import foodImg from '@/assets/food.jpg'
import musicImg from '@/assets/music.jpg'
import sportsImg from '@/assets/sports.jpg'

// Map category image string to imported assets
const getCategoryImage = (imageName) => {
  switch (imageName) {
    case 'art.jpg': return artImg
    case 'community.jpg': return communityImg
    case 'education.jpg': return educationImg
    case 'food.jpg': return foodImg
    case 'music.jpg': return musicImg
    case 'sports.jpg': return sportsImg
    default: return musicImg
  }
}

// Date formatters will be created dynamically inside the component to support active language switching

export default function EventCard({ event }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  const dateLang = currentLang === 'en' ? 'en-US' : 'vi-VN'
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(dateLang, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }), [dateLang])

  const formatDate = useCallback((dateValue) => {
    if (!dateValue) return t('event.updating', 'Đang cập nhật')
    const date = new Date(typeof dateValue === 'string' ? dateValue.replace(/-/g, '/') : dateValue)
    if (Number.isNaN(date.getTime())) return t('event.updating', 'Đang cập nhật')
    return dateFormatter.format(date)
  }, [t, dateFormatter])

  const formatDateRange = useCallback((startTime, endTime) => {
    if (!startTime) return t('event.updating_schedule', 'Đang cập nhật lịch trình')
    const start = new Date(typeof startTime === 'string' ? startTime.replace(/-/g, '/') : startTime)
    const end = endTime ? new Date(typeof endTime === 'string' ? endTime.replace(/-/g, '/') : endTime) : null
    if (Number.isNaN(start.getTime())) return t('event.updating_schedule', 'Đang cập nhật lịch trình')

    const startLabel = dateFormatter.format(start)
    if (!end || Number.isNaN(end.getTime())) return startLabel

    const isSameDay = start.getFullYear() === end.getFullYear() &&
                      start.getMonth() === end.getMonth() &&
                      start.getDate() === end.getDate();

    if (isSameDay) {
      const endLabelTime = new Intl.DateTimeFormat(dateLang, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(end);
      return `${startLabel} - ${endLabelTime}`
    }

    return `${startLabel} - ${dateFormatter.format(end)}`
  }, [t, dateFormatter, dateLang])

  const displayImage = event.category?.image ? getCategoryImage(event.category.image) : heroFallback
  const categoryName = event.category?.name ? t('category.' + event.category.name, event.category.name) : t('category.default_category', 'Sự kiện')
  const rating = Number(event.reviews_avg_rating ?? 0)
  const totalSlots = event.capacity ?? 0
  const registeredCount = event.confirmed_registrations_count ?? 0
  const remainingSlots = Math.max(0, totalSlots - registeredCount)

  return (
    <article className="flex flex-col h-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] font-sans">
      
      {/* 1. HÌNH ẢNH & BADGE DANH MỤC */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={displayImage}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(imageEvent) => {
            imageEvent.currentTarget.onerror = null
            imageEvent.currentTarget.src = heroFallback
          }}
        />
        {/* Badge danh mục */}
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#cc2bd6] px-4 py-1 text-sm font-semibold text-white shadow-sm">
          {categoryName}
        </span>
      </div>

      {/* KHỐI NỘI DUNG CHÍNH */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* 2. TIÊU ĐỀ SỰ KIỆN */}
          <h3 className="text-[21px] font-bold text-[#2d4a57] leading-snug line-clamp-2 min-h-[3.25rem]">
            {event.title}
          </h3>

          {/* 3. ĐẦY ĐỦ THÔNG TIN TỪ CODE CŨ */}
          <div className="space-y-2.5 text-[15px] text-[#7d5142] font-medium">
            {/* Thời gian diễn ra */}
            <div className="flex items-start gap-2.5">
              <FaCalendarAlt className="text-[16px] text-slate-500 mt-1 shrink-0" />
              <span className="line-clamp-1">{formatDateRange(event.start_time, event.end_time)}</span>
            </div>

            {/* Địa điểm */}
            <div className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-[17px] text-slate-500 mt-0.5 shrink-0" />
              <span className="line-clamp-1" title={event.location}>{event.location ?? t('event.updating_location', 'Đang cập nhật địa điểm')}</span>
            </div>

            {/* Hạn đăng ký */}
            <div className="flex items-start gap-2.5">
              <FaClock className="text-[16px] text-slate-500 mt-1 shrink-0" />
              <span className="line-clamp-1">
                {t('event.deadline_prefix', 'Hạn đăng ký:')} <b className="text-slate-900 font-semibold">{formatDate(event.registration_deadline)}</b>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* 4. SLOT CÒN LẠI & RATING */}
          <div className="flex items-center justify-between pt-1">
            {/* Hiển thị số slot */}
            <p className="text-[16px] font-bold text-[#2d4a57]">
              {t('event.remaining_slots', { remaining: remainingSlots, total: totalSlots })}
            </p>
            
            {/* Số điểm đánh giá sao */}
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
              <FaStar className="text-amber-400 text-base" />
              <span>{rating > 0 ? rating.toFixed(1) : t('event.new_rating', 'Mới')}</span>
            </div>
          </div>

          {/* 5. NÚT XEM CHI TIẾT */}
          <button 
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="w-full rounded-[14px] bg-[#e14d34] py-3 text-center text-[16px] font-bold text-white transition-all duration-200 hover:bg-[#c93f28] active:scale-[0.98]"
          >
            {t('event.view_details', 'Xem chi tiết')}
          </button>
        </div>

      </div>
    </article>
  )
}