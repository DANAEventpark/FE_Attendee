import { useState, useEffect } from "react";
import logo from "../../assets/logoevent.png";
import api from "../../services/api"; // File cấu hình axios của bạn

export default function Navbar() {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await api.get("/me");
      
        if (response.data && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Lỗi xác thực người dùng:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUser();
  }, []);


  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
  
      localStorage.removeItem("token");
      setUser(null);
      window.location.href = "/"; 
    }
  };

  return (
    <header className="border-b border-white/10 bg-[#173846] text-white sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        
        {/* KHỐI LOGO */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white px-2 py-1 shadow-lg">
            <img
              src={logo}
              alt="DANAEventSpark"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <p className="text-base font-semibold leading-none">DANAEventSpark</p>
            <p className="mt-1 text-xs text-white/60">
              Khám phá sự kiện trong cộng đồng
            </p>
          </div>
        </div>

  
        <ul className="order-3 flex w-full flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/80 md:order-none md:w-auto">
          <li>
            <a href="#" className="hover:text-white transition-colors">
              Sự kiện
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition-colors">
              Danh mục
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition-colors">
              Về chúng tôi
            </a>
          </li>
        </ul>


        <div className="flex items-center gap-4">
          {user ? (

            <div className="flex items-center gap-4 animate-in fade-in duration-300">

              <div className="flex items-center gap-3 select-none">
                <span className="text-sm font-medium text-white/90">
                  {user.name}
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-300 text-[#173846]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

   
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-[#e96a52] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#d75c46] hover:shadow-md"
              >
                Đăng xuất
              </button>
            </div>
          ) : (

            <>
              <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#173846] transition hover:bg-[#f3ede5]">
                <a href="/login" className="text-[#173846]">
                  Đăng nhập
                </a>
              </button>
              <button className="rounded-2xl bg-[#e96a52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d75c46]">
                <a href="/register" className="text-white">
                  Đăng ký
                </a>
              </button>
            </>
          )}
        </div>

      </nav>
    </header>
  );
}