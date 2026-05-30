import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api'; 

const EventByCategoryPage = () => {
    const { id } = useParams(); 
    const [events, setEvents] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get(`/categories/${id}/events`);
                console.log("Dữ liệu nhận được:", res.data);

                if (res.data.success) {
                    setEvents(res.data.data);
                    setCategoryName(res.data.category_name || "Danh mục"); 
                }
            } catch (err) {
                console.error("Lỗi kết nối API:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-[#fdf5e6] min-h-screen flex items-center justify-center font-sans">
                <div className="text-[#2d3e50] text-lg font-medium animate-pulse">Đang tải sự kiện...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#fdf5e6] min-h-screen font-sans p-6 md:p-12">
            {/* Nút quay lại */}
            <div className="max-w-[1200px] mx-auto mb-6">
                <Link to="/categories" className="inline-block text-[#2d3e50] font-medium hover:underline transition-all">
                    ← Quay lại danh mục
                </Link>
            </div>

            {/* Tiêu đề trang */}
            <div className="max-w-[1200px] mx-auto mb-10">
                <h2 className="text-[#2d3e50] text-2xl md:text-3xl font-bold">
                    Sự kiện thuộc danh mục: <span className="text-gray-600 font-semibold">{categoryName}</span>
                </h2>
            </div>

            {/* Nội dung danh sách sự kiện */}
            <div className="max-w-[1200px] mx-auto">
                {events.length === 0 ? (
                    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center shadow-xs">
                        <p className="text-gray-500 text-lg">Hiện tại chưa có sự kiện nào diễn ra trong danh mục này.</p>
                    </div>
                ) : (
                    /* CHIA 3 CỘT Ở ĐÂY: 1 cột trên mobile, 2 cột trên tablet, và chuẩn 3 cột trên máy tính (md:grid-cols-3) */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between" key={event.id}>
                                
                                <div>
                                    {/* Badge Trạng thái */}
                                    <div className="absolute top-4 right-4 bg-[#2d3e50]/10 text-[#2d3e50] font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                                        {event.status}
                                    </div>
                                    
                                    {/* Thông tin sự kiện */}
                                    <div className="mt-4">
                                        <h3 className="text-[#2d3e50] text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{event.description}</p>
                                    </div>
                                </div>

                                {/* Chi tiết Meta ở dưới cùng card */}
                                <div className="border-t border-gray-100 pt-4 space-y-1.5 text-xs text-gray-500">
                                    <p>📍 <strong className="text-gray-700">Địa điểm:</strong> {event.location}</p>
                                    <p>📅 <strong className="text-gray-700">Thời gian:</strong> {new Date(event.start_time.replace(/-/g, '/')).toLocaleString('vi-VN')}</p>
                                    <p>👥 <strong className="text-gray-700">Giới hạn:</strong> {event.capacity} người</p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventByCategoryPage;