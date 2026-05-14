import { FaSearch, FaFilter } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="px-6 md:px-16 -mt-10 relative z-10">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        
       
        <div className="bg-white rounded-2xl shadow-lg flex items-center px-6 py-4 w-full max-w-3xl border border-gray-100">
          <FaSearch className="text-gray-300 text-xl" />
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện, địa điểm, ban tổ chức..."
            className="w-full px-4 outline-none text-gray-600 placeholder-gray-300"
          />
        </div>

        <button className="bg-white rounded-2xl shadow-lg flex items-center gap-3 px-8 py-4 border border-gray-100 text-gray-400 hover:text-[#E85D4E] transition-all">
          <FaFilter />
          <span className="font-medium">Lọc và sắp xếp</span>
        </button>

      </div>
    </div>
  );
}