import { Link } from 'react-router-dom';

/**
 * HomePage — FE_Attendee
 * Placeholder cho trang chủ người tham dự
 * Sẽ được phát triển đầy đủ trong các REQ tiếp theo
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          🎉 DANAEventpark
        </h1>
        <p className="text-slate-400 text-lg">
          Nền tảng khám phá sự kiện tại Đà Nẵng
        </p>
        <span className="inline-block mt-4 px-4 py-2 bg-teal-600 text-white rounded-full text-sm">
          FE_Attendee — dev
        </span>
        <div className="flex gap-4 mt-8 justify-center">
          <Link 
            to="/login" 
            className="px-6 py-3 bg-[#E53E3E] text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Đăng nhập
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-3 border border-[#E53E3E] text-[#E53E3E] rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            Đăng ký
          </Link>
        </div>

      </div>
    </div>
  )
}

export default HomePage
