import { Search, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ value, onChange, timeFilter, onTimeFilterChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-6xl mx-auto px-4 -mt-10 relative z-10">
      
     
      <div className="w-full md:flex-1 bg-white rounded-2xl shadow-xl flex items-center px-6 py-4 border border-gray-100">
        <Search className="text-gray-300 mr-4 flex-shrink-0" size={22} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full outline-none text-gray-700 placeholder:text-gray-300 bg-transparent text-sm sm:text-base"
        />
      </div>


      <div className="bg-white px-5 py-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 text-gray-500 font-bold hover:bg-gray-50 transition-all text-sm whitespace-nowrap w-full md:w-auto">
        <CalendarDays size={18} className="text-[#e96a52] flex-shrink-0" />
        
        <select
          value={timeFilter}
          onChange={(e) => onTimeFilterChange(e.target.value)}
          className="bg-transparent outline-none text-gray-600 font-bold cursor-pointer text-sm pr-2"
        >
          <option value="upcoming">{t('search.upcoming', 'Sắp diễn ra')}</option>
          <option value="today">{t('search.today', 'Hôm nay')}</option>
          <option value="this_week">{t('search.this_week', 'Tuần này')}</option>
          <option value="this_month">{t('search.this_month', 'Tháng này')}</option>
          <option value="next_month">{t('search.next_month', 'Tháng sau')}</option>
          <option value="past">{t('search.past', 'Đã kết thúc')}</option>
        </select>
      </div>

    </div>
  );
};

export default SearchBar;