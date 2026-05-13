import {
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:scale-105 duration-300">
      <img
        className="w-full h-56 object-cover"
        src={event.image}
        alt=""
      />

      <div className="p-5">
        <span className="bg-purple-500 text-white text-sm px-4 py-1 rounded-full">
          {event.category}
        </span>

        <h3 className="text-xl font-bold mt-4">
          {event.title}
        </h3>

        <div className="text-gray-600 mt-4 space-y-2">
          <p className="flex items-center gap-2">
            <FaCalendarAlt />
            {event.date}
          </p>

          <p className="flex items-center gap-2">
            <FaMapMarkerAlt />
            {event.location}
          </p>
        </div>

        <p className="mt-4 font-semibold">
          Còn {event.slots} suất
        </p>

        <button className="mt-5 w-full bg-[#E85D4E] text-white py-3 rounded-xl">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}