export default function Footer() {
  return (
    <footer className="bg-[#14313F] text-white text-center py-14 mt-16">
      <h2 className="text-3xl font-bold">
        EventSpark
      </h2>

      <p className="text-gray-300 mt-4">
        Nền tảng tổ chức và quản lý sự kiện hiện đại.
      </p>

      <div className="flex justify-center flex-wrap gap-10 mt-8">
        <span>Khám phá</span>
        <span>Danh mục</span>
        <span>Về chúng tôi</span>
        <span>Trung tâm trợ giúp</span>
      </div>

      <div className="border-t border-gray-500 mt-10 pt-6 text-gray-400">
        © EventSpark 2025. All rights reserved.
      </div>
    </footer>
  );
}