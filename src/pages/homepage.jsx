import { useEffect, useState } from "react";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaStar, 
  FaClock, 
  FaSearch,
  FaFilter
} from "react-icons/fa";

// Import Components
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import Footer from "../components/footer";

// Import Services
import getEvents from "../services/eventService";
import { getCategories } from "../services/categoryService";

export function Homepage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Lấy danh mục từ API
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Lỗi load danh mục:", error);
    }
  };

  // Lấy sự kiện từ API
  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getEvents(page);
      setEvents(response.data || []);
      setCurrentPage(response.current_page || 1);
      setLastPage(response.last_page || 1);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  return (
    <div className="bg-[#FDF2E9] min-h-screen font-sans text-[#14313F]">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. SEARCHBAR SECTION - Thiết kế đè lên Hero */}
      <section className="px-6 md:px-16 -mt-10 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {/* Ô Search */}
          <div className="bg-white rounded-2xl shadow-xl flex items-center px-6 py-4 w-full max-w-4xl border border-gray-100">
            <FaSearch className="text-gray-300 text-xl" />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện, địa điểm, ban tổ chức..."
              className="w-full px-4 outline-none text-gray-600 placeholder-gray-300 bg-transparent"
            />
          </div>

          {/* Nút Lọc */}
          <button className="bg-white rounded-2xl shadow-lg flex items-center gap-3 px-8 py-4 border border-gray-100 text-gray-400 hover:text-[#E85D4E] transition-all whitespace-nowrap">
            <FaFilter />
            <span className="font-medium">Lọc và sắp xếp</span>
          </button>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION - Dàn hàng ngang như Hình 2 */}
      <section className="flex flex-wrap justify-center gap-3 px-6 md:px-16 mt-10">
        {/* Nút "Tất cả" mặc định active */}
        <button className="px-8 py-2.5 rounded-full bg-[#E85D4E] text-white font-bold shadow-md shadow-orange-200 transition-all hover:scale-105 active:scale-95">
          Tất cả
        </button>
        
        {/* Render danh sách danh mục từ database */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="px-8 py-2.5 rounded-full bg-white border border-blue-50 text-gray-600 font-medium hover:border-[#E85D4E] hover:text-[#E85D4E] transition-all duration-300 shadow-sm active:scale-95 whitespace-nowrap"
          >
            {cat.name}
          </button>
        ))}
      </section>

      {/* 4. EVENT LIST SECTION */}
      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Các sự kiện đang diễn ra & sắp tới
        </h2>

        {loading ? (
          <div className="text-center py-20 text-xl font-medium animate-pulse text-gray-400">
            Đang tải dữ liệu sự kiện...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const deadline = new Date(event.registration_deadline);
              const diffDays = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 duration-500 flex flex-col h-full border border-gray-50"
                >
                  {/* Thumbnail */}
                  <div className="relative group overflow-hidden">
                    <img
                      className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                      src={event.image_url || "https://via.placeholder.com/500x300"}
                      alt={event.title}
                    />
                    {diffDays > 0 && diffDays <= 3 && (
                      <div className="absolute top-5 left-5 bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        Sắp hết hạn!
                      </div>
                    )}
                  </div>

                  {/* Body Card */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-orange-50 text-[#E85D4E] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                        {event.category?.name || "Sự kiện"}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <FaStar />
                        <span className="text-sm font-bold text-gray-800">
                          {event.avg_rating ? parseFloat(event.avg_rating).toFixed(1) : "5.0"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#14313F] line-clamp-2 leading-tight mb-6 h-14">
                      {event.title}
                    </h3>

                    <div className="space-y-4 text-sm text-gray-500 flex-grow">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-[#E85D4E]">
                          <FaCalendarAlt />
                        </div>
                        <span className="font-medium">
                          {new Date(event.start_time).toLocaleDateString("vi-VN", { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-xl text-[#E85D4E]">
                          <FaMapMarkerAlt />
                        </div>
                        <span className="truncate font-medium">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-xl ${diffDays < 3 ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                          <FaClock />
                        </div>
                        <span className="font-bold">
                          {diffDays > 0 ? `Còn ${diffDays} ngày để đăng ký` : "Hết hạn đăng ký"}
                        </span>
                      </div>
                    </div>

                    <button className="mt-8 w-full bg-[#14313F] text-white py-4 rounded-2xl font-bold hover:bg-[#E85D4E] transition-all duration-300 shadow-xl active:scale-95">
                      Xem chi tiết ngay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. PHÂN TRANG (PAGINATION) */}
        {!loading && lastPage > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-6 py-3 rounded-2xl bg-white border border-gray-200 disabled:opacity-30 hover:border-[#E85D4E] font-bold transition-all"
            >
              Trước
            </button>
            <div className="px-6 py-3 bg-white rounded-2xl border border-gray-100 font-black text-[#14313F]">
              {currentPage} / {lastPage}
            </div>
            <button
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-6 py-3 rounded-2xl bg-[#E85D4E] text-white font-bold disabled:opacity-30 hover:bg-[#d94d3f] shadow-lg transition-all"
            >
              Tiếp theo
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}