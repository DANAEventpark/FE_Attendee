import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-5 flex flex-col md:flex-row gap-5 justify-between -mt-8 relative z-50">
      <div className="flex items-center gap-4 flex-1">
        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Tìm kiếm sự kiện, địa điểm..."
          className="outline-none w-full"
        />
      </div>

      <button className="bg-gray-100 px-5 py-3 rounded-xl">
        Lọc và sắp xếp
      </button>
    </div>
  );
}