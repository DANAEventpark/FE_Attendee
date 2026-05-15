import { Search, Filter } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">

      {/* SEARCH */}

      <div className="w-full md:w-[720px] lg:w-[780px] bg-white rounded-2xl shadow-xl flex items-center px-6 py-4 border border-gray-100">

        <Search className="text-gray-300 mr-4" size={22} />

        <input
          type="text"
          placeholder="Tìm kiếm sự kiện, địa điểm..."
          className="w-full outline-none text-gray-700 placeholder:text-gray-300"
        />

      </div>

      {/* FILTER */}

      <button className="bg-white px-6 py-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 text-gray-500 font-bold hover:bg-gray-50 transition-all">

        <Filter size={18} className="text-[#E76241]" />

        Lọc

      </button>

    </div>
  );
};

export default SearchBar;