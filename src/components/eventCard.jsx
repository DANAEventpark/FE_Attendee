import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";

const categoryThemes = {
  Music: {
    panel: "from-[#4b1d6b] via-[#8136be] to-[#ff6ea8]",
    accent: "bg-[#ef4f92]",
  },
  Sports: {
    panel: "from-[#0c3c61] via-[#1673a5] to-[#3ed0d2]",
    accent: "bg-[#0f7ea0]",
  },
  Food: {
    panel: "from-[#61330d] via-[#d26e1f] to-[#f4c15d]",
    accent: "bg-[#d26e1f]",
  },
  Art: {
    panel: "from-[#471b52] via-[#9340c9] to-[#f17cd9]",
    accent: "bg-[#9340c9]",
  },
  Education: {
    panel: "from-[#17315d] via-[#325fba] to-[#9fd4ff]",
    accent: "bg-[#325fba]",
  },
  Community: {
    panel: "from-[#15453d] via-[#1f7d63] to-[#7bd9a4]",
    accent: "bg-[#1f7d63]",
  },
};

function formatFullDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatShortMonth(dateValue) {
  return new Date(dateValue).toLocaleDateString("vi-VN", {
    month: "short",
  });
}

function formatTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDaysLeft(dateValue) {
  const deadline = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
}

function getTheme(categoryName) {
  return categoryThemes[categoryName] ?? {
    panel: "from-[#203a43] via-[#2c5364] to-[#7ad0df]",
    accent: "bg-[#2c5364]",
  };
}

export default function EventCard({ event }) {
  const eventDate = new Date(event.start_time);
  const daysLeft = getDaysLeft(event.registration_deadline);
  const theme = getTheme(event.category?.name);
  const confirmedCount = Number(event.confirmed_registrations_count || 0);
  const capacity = Number(event.capacity || 0);
  const slotsLeft = Math.max(capacity - confirmedCount, 0);
  const organizerName =
    event.organizer?.organization_name || event.organizer?.name || "Đang cập nhật";
  const avgRating = event.reviews_avg_rating
    ? Number(event.reviews_avg_rating).toFixed(1)
    : "Mới";

  return (
    <article className="overflow-hidden rounded-[28px] border border-[#dbcab1] bg-white shadow-[0_12px_28px_rgba(23,56,70,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(23,56,70,0.16)]">
      <div
        className={`relative flex h-44 flex-col justify-between bg-gradient-to-br ${theme.panel} p-5 text-white`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_50%)]" />

        <div className="relative flex items-start justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white ${theme.accent}`}
          >
            {event.category?.name ?? "Sự kiện"}
          </span>

          <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm">
            <FaStar className="text-yellow-200" />
            <span>{avgRating}</span>
            <span className="text-white/70">({event.reviews_count || 0})</span>
          </div>
        </div>

        <div className="relative">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">
            Lịch nổi bật
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-5xl font-black leading-none">
                {String(eventDate.getDate()).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm text-white/75">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </p>
            </div>

            <div className="rounded-[22px] border border-white/20 bg-white/10 px-4 py-3 text-right backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">
                Tháng
              </p>
              <p className="mt-1 text-lg font-bold">
                {formatShortMonth(event.start_time)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold leading-snug text-[#173846]">
          {event.title}
        </h3>

        <p
          className="mt-3 text-sm leading-6 text-[#5f6461]"
          style={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {event.description}
        </p>

        <div className="mt-5 space-y-3 text-sm text-[#4f5555]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-xl bg-[#f8efe2] p-2 text-[#e96a52]">
              <FaCalendarAlt />
            </span>
            <div>
              <p className="font-semibold text-[#173846]">
                {formatFullDate(event.start_time)}
              </p>
              <p className="text-[#7a7c7a]">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-xl bg-[#f8efe2] p-2 text-[#e96a52]">
              <FaMapMarkerAlt />
            </span>
            <div>
              <p className="font-semibold text-[#173846]">Địa điểm</p>
              <p className="text-[#7a7c7a]">{event.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-xl bg-[#f8efe2] p-2 text-[#e96a52]">
              <FaUserTie />
            </span>
            <div>
              <p className="font-semibold text-[#173846]">Ban tổ chức</p>
              <p className="text-[#7a7c7a]">{organizerName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-xl bg-[#f8efe2] p-2 text-[#e96a52]">
              <FaClock />
            </span>
            <div>
              <p className="font-semibold text-[#173846]">Hạn đăng ký</p>
              <p className="text-[#7a7c7a]">
                {formatFullDate(event.registration_deadline)}
                {daysLeft > 0
                  ? ` · còn ${daysLeft} ngày`
                  : daysLeft === 0
                  ? " · chốt hôm nay"
                  : " · đã quá hạn"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-xl bg-[#f8efe2] p-2 text-[#e96a52]">
              <FaUsers />
            </span>
            <div>
              <p className="font-semibold text-[#173846]">Đăng ký / sức chứa</p>
              <p className="text-[#7a7c7a]">
                {confirmedCount} / {capacity} · còn {slotsLeft} chỗ
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f6efe6] px-3 py-1 text-xs font-medium text-[#173846]">
            {event.category?.name ?? "General"}
          </span>
          <span className="rounded-full bg-[#f6efe6] px-3 py-1 text-xs font-medium text-[#173846]">
            Rating {avgRating}
          </span>
        </div>

        <button className="mt-6 w-full rounded-2xl bg-[#e96a52] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d75c46]">
          Xem chi tiết
        </button>
      </div>
    </article>
  );
}
