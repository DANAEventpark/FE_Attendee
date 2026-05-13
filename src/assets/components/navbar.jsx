export default function Navbar() {
  return (
    <nav className="bg-[#14313F] text-white px-6 md:px-16 py-5 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        DANAEventSpark
      </h1>

      <ul className="hidden md:flex gap-10">
        <li className="cursor-pointer hover:text-orange-300">
          Sự kiện
        </li>

        <li className="cursor-pointer hover:text-orange-300">
          Danh mục
        </li>

        <li className="cursor-pointer hover:text-orange-300">
          Về chúng tôi
        </li>
      </ul>

      <div className="flex gap-3">
        <button className="bg-white text-black px-4 py-2 rounded-xl">
          Đăng nhập
        </button>

        <button className="bg-[#E85D4E] px-4 py-2 rounded-xl">
          Đăng ký
        </button>
      </div>
    </nav>
  );
}