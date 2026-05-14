export default function CategoriesList({ categories }) {
  // Nếu categories trống, dùng tạm list này để giống hình 2
  const list = categories?.length > 0 ? categories : [
    { id: 1, name: "Âm nhạc" },
    { id: 2, name: "Thể thao" },
    { id: 3, name: "Ẩm thực" },
    { id: 4, name: "Nghệ thuật" },
    { id: 5, name: "Giáo dục" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 px-6 md:px-16 mt-8">
      {/* Nút Tất cả (Active) */}
      <button className="px-8 py-2.5 rounded-full bg-[#E85D4E] text-white font-medium shadow-md shadow-orange-200">
        Tất cả
      </button>

      {/* Các danh mục khác */}
      {list.map((item) => (
        <button
          key={item.id}
          className="px-8 py-2.5 rounded-full bg-white border border-blue-100 text-gray-600 hover:border-[#E85D4E] hover:text-[#E85D4E] transition-all duration-300"
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}