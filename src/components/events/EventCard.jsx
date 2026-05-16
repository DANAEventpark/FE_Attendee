import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaTag,
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
  if (!dateValue) {
    return 'Đang cập nhật'
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return 'Đang cập nhật'
  }

  return DATE_FORMATTER.format(date)
}

function formatDateRange(startTime, endTime) {
  if (!startTime) {
    return 'Đang cập nhật lịch trình'
  }

  const start = new Date(startTime)

  const end = endTime
    ? new Date(endTime)
    : null

  if (Number.isNaN(start.getTime())) {
    return 'Đang cập nhật lịch trình'
  }

  const startLabel = DATE_FORMATTER.format(start)

  if (!end || Number.isNaN(end.getTime())) {
    return startLabel
  }

  return `${startLabel} - ${DATE_FORMATTER.format(end)}`
}

function shortDescription(description) {
  if (!description) {
    return 'Thông tin sự kiện đang được cập nhật.'
  }

  if (description.length <= 120) {
    return description
  }

  return `${description.slice(0, 117)}...`
}

export default function EventCard({ event }) {

  /**
   * IMAGE
   * Backend Laravel đã trả image_url đầy đủ
   */
  const displayImage =
    event.category?.image_url || heroFallback

  /**
   * CATEGORY
   */
  const categoryName =
    event.category?.name ?? 'Sự kiện'

  /**
   * ORGANIZER
   */
  const organizerName =
    event.organizer?.organization_name ??
    event.organizer?.name ??
    'Ban tổ chức'

  /**
   * RATING
   */
  const rating = Number(
    event.reviews_avg_rating ?? 0
  )

  /**
   * SLOT
   */
  const totalSlots = event.capacity ?? 0

  const registeredCount =
    event.confirmed_registrations_count ?? 0

  const remainingSlots = Math.max(
    0,
    totalSlots - registeredCount
  )

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]">

      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden bg-slate-200">

        <img
          src={displayImage}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(imageEvent) => {
            imageEvent.currentTarget.onerror = null
            imageEvent.currentTarget.src = heroFallback
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />

        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">

          {/* CATEGORY */}
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">

            <FaTag className="mr-2 text-[#e96a52]" />

            {categoryName}

          </span>

          {/* REGISTER COUNT */}
          <span className="inline-flex rounded-full bg-slate-950/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">

            {registeredCount} đăng ký

          </span>

        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-4 p-5">

        {/* TITLE */}
        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e96a52]">

            {organizerName}

          </p>

          <h3 className="mt-2 text-xl font-semibold text-slate-900">

            {event.title}

          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">

            {shortDescription(event.description)}

          </p>

        </div>

        {/* INFO */}
        <div className="space-y-3 text-sm text-slate-600">

          {/* EVENT TIME */}
          <div className="flex items-start gap-3">

            <FaCalendarAlt className="mt-0.5 text-[#e96a52]" />

            <span>
              {formatDateRange(
                event.start_time,
                event.end_time
              )}
            </span>

          </div>

          {/* LOCATION */}
          <div className="flex items-start gap-3">

            <FaMapMarkerAlt className="mt-0.5 text-[#e96a52]" />

            <span>
              {event.location ??
                'Đang cập nhật địa điểm'}
            </span>

          </div>

          {/* DEADLINE */}
          <div className="flex items-start gap-3">

            <FaClock className="mt-0.5 text-[#e96a52]" />

            <span>
              Hạn đăng ký:
              <b className="ml-1 text-slate-900">
                {formatDate(
                  event.registration_deadline
                )}
              </b>
            </span>

          </div>

        </div>

        {/* FOOTER */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">

          {/* REGISTERED */}
          <div className="rounded-2xl bg-slate-50 p-3">

            <p className="text-xs font-medium text-slate-500">
              Lượt đăng ký
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {registeredCount}
            </p>

          </div>

          {/* SLOT */}
          <div className="rounded-2xl bg-slate-50 p-3">

            <p className="text-xs font-medium text-slate-500">
              Slot còn lại
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">

              {remainingSlots}/{totalSlots}

            </p>

          </div>

        </div>

        {/* RATING */}
        <div className="flex items-center justify-end gap-2 text-sm font-medium text-slate-700">

          <FaStar className="text-amber-400" />

          <span>
            {rating > 0
              ? rating.toFixed(1)
              : 'Mới'}
          </span>

        </div>

      </div>
    </article>
  )
}