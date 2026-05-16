import logo from "../../assets/logoevent.png";

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#173846] text-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
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
            <a href="/" className="text-white">
              Sự kiện
            </a>
          </li>
          <li>
            <a href="/categories" className="text-white">
              Danh mục
            </a>
          </li>
          <li>
            <a href="/about" className="text-white">
              Về chúng tôi
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#173846] transition hover:bg-[#f3ede5]">
            <a href="/login" className="text-[#173846]">
              Đăng nhập
            </a>
          </button>
          <button className="rounded-2xl bg-[#e96a52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d75c46]">
            <a href="/register" className="text-white">Đăng ký</a>
          </button>
        </div>
      </nav>
    </header>
  );
}
