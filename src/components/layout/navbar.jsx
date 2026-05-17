import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logoevent.png";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {

  const navigate = useNavigate();

  // LẤY USER TỪ ZUSTAND
  const user = useAuthStore((state) => state.user);

  // LOGOUT FUNCTION
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {

    logout();

    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#173846] text-white">

      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">

          <div className="rounded-2xl bg-white px-2 py-1 shadow-lg">
            <img
              src={logo}
              alt="DANAEventSpark"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div>
            <p className="text-base font-semibold leading-none">
              DANAEventSpark
            </p>

            <p className="mt-1 text-xs text-white/60">
              Khám phá sự kiện trong cộng đồng
            </p>
          </div>

        </Link>

        {/* MENU */}
        <ul className="order-3 flex w-full flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/80 md:order-none md:w-auto">

          <li>
            <Link
              to="/events"
              className="transition-colors hover:text-white"
            >
              Sự kiện
            </Link>
          </li>

          <li>
            <Link
              to="/categories"
              className="transition-colors hover:text-white"
            >
              Danh mục
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="transition-colors hover:text-white"
            >
              Về chúng tôi
            </Link>
          </li>

        </ul>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {user ? (

            <div className="flex items-center gap-4">

              {/* USER */}
              <div className="flex items-center gap-3">

                {/* AVATAR */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#173846] font-bold uppercase">
                  {user.name?.charAt(0)}
                </div>

                {/* NAME */}
                <div className="hidden md:block">

                  <p className="text-sm font-semibold text-white">
                    {user.name}
                  </p>

                  <p className="text-xs text-white/60">
                    {user.role_id === 1
                      ? "Người tham dự"
                      : "Ban tổ chức"}
                  </p>

                </div>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-[#e96a52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d75c46]"
              >
                Đăng xuất
              </button>

            </div>

          ) : (

            <>
              <Link
                to="/login"
                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#173846] transition hover:bg-[#f3ede5]"
              >
                Đăng nhập
              </Link>

              <Link
                to="/register"
                className="rounded-2xl bg-[#e96a52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d75c46]"
              >
                Đăng ký
              </Link>
            </>

          )}

        </div>

      </nav>

    </header>
  );
}