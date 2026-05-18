import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import api from "../../services/api"; 

const heroPosters = [
  {
    eyebrow: "Veritas",
    title: "Light Into Focus",
    subtitle: "Curated talks and workshops",
    style: {
      background:
        "linear-gradient(160deg, rgba(19,57,92,1) 0%, rgba(44,106,159,1) 45%, rgba(244,188,84,1) 100%)",
    },
  },
  {
    eyebrow: "Celestial Odyssey",
    title: "Night Of Ideas",
    subtitle: "Immersive community showcase",
    style: {
      background:
        "linear-gradient(160deg, rgba(16,22,74,1) 0%, rgba(61,43,159,1) 50%, rgba(104,195,255,1) 100%)",
    },
  },
];

export default function Hero() {
  const [stats, setStats] = useState({
    total_events: 0,
    total_registrations: 0,
    total_organizers: 0,
  });

  // Fetch system stats automatically on component mount
  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        const response = await api.get("/system-stats");
        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu thống kê hệ thống:", error);
      }
    };

    fetchSystemStats();
  }, []);

  return (
    <section className="bg-[#173846] pb-24 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-[#f06f58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Nền tảng sự kiện cộng đồng
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
            Khám phá sự kiện
            <br />
            xung quanh bạn
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
            Từ âm nhạc, workshop đến hoạt động cộng đồng, mọi trải nghiệm nổi bật
            đều được gom lại để bạn dễ chọn và dễ tham gia.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-[#e96a52] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e96a52]/25 transition hover:bg-[#d75c46]">
              Khám phá ngay
              <FaArrowRight className="text-xs" />
            </button>

            <p className="text-sm text-white/60">
              {stats.total_events} sự kiện đang mở đăng ký
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">{stats.total_events}</p>
              <p className="mt-2 text-sm text-white/60">Sự kiện đang mở</p>
            </div>

            <div className="rounded-[24px] border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">{stats.total_registrations}</p>
              <p className="mt-2 text-sm text-white/60">Lượt đăng ký tham gia</p>
            </div>

            <div className="rounded-[24px] border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">{stats.total_organizers}</p>
              <p className="mt-2 text-sm text-white/60">Nhà tổ chức đồng hành</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 lg:justify-end">
          {heroPosters.map((poster, index) => (
            <article
              key={poster.title}
              style={poster.style}
              className={`relative flex min-h-[300px] w-[170px] flex-col justify-between overflow-hidden rounded-[28px] p-5 text-white shadow-2xl shadow-black/20 sm:w-[210px] ${
                index === 0 ? "translate-y-10" : ""
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_45%)]" />

              <div className="relative">
                <p className="text-2xl font-semibold italic leading-none">
                  {poster.eyebrow}
                </p>
              </div>

              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Feature highlight
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight">
                  {poster.title}
                </h2>
                <p className="mt-3 text-sm text-white/75">{poster.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}