import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaUserFriends,
} from "react-icons/fa";

export default function EventCard({ event }) {

  const deadline = new Date(event.registration_deadline);
  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  
  const rating = event.avg_rating || 0;
  const reviews = event.review_count || 0;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] duration-300 flex flex-col h-full border border-gray-100">
   
      <div className="relative">
        <img
          className="w-full h-52 object-cover"
          src={event.image_url || "https://via.placeholder.com/400x250"}
          alt={event.title}
        />
      
        {diffDays > 0 && diffDays <= 3 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg animate-pulse">
            Sắp hết hạn!
          </div>
        )}
      </div>


      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <span className="bg-purple-100 text-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {event.category?.name}
          </span>
          
  
          <div className="flex items-center gap-1 text-yellow-500">
            <FaStar />
            <span className="text-sm font-bold text-gray-700">{rating > 0 ? rating.toFixed(1) : "N/A"}</span>
            <span className="text-xs text-gray-400 font-normal">({reviews})</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-4 text-[#14313F] line-clamp-2 min-h-[56px]">
          {event.title}
        </h3>

        <div className="text-gray-500 mt-4 space-y-2.5 text-sm flex-grow">
          <p className="flex items-center gap-3">
            <FaCalendarAlt className="text-[#E85D4E]" />
            {new Date(event.start_time).toLocaleDateString("vi-VN")}
          </p>

          <p className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-[#E85D4E]" />
            <span className="truncate">{event.location}</span>
          </p>


          <p className={`flex items-center gap-3 font-medium ${diffDays < 0 ? 'text-red-500' : 'text-orange-600'}`}>
            <FaClock />
            {diffDays > 0 
              ? `Hạn đăng ký: Còn ${diffDays} ngày` 
              : diffDays === 0 ? "Hạn đăng ký: Hôm nay" : "Đã hết hạn đăng ký"}
          </p>

    
          <p className="flex items-center gap-3 text-blue-600">
            <FaUserFriends />
            <span>Còn trống: <b>{event.slots_left || event.capacity}</b> / {event.capacity} suất</span>
          </p>
        </div>

        <button className="mt-6 w-full bg-[#e85d4e] text-white py-3 rounded-xl font-bold hover:bg-[#d94d3f] transition-all shadow-lg shadow-red-100 active:scale-95">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}