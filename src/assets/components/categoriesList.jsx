const categories = [
  "Tất cả",
  "Âm nhạc",
  "Thể thao",
  "Ẩm thực",
  "Nghệ thuật",
  "Giáo dục",
];

export default function CategoriesList() {
  return (
    <div className="flex flex-wrap gap-4 px-6 md:px-16 mt-10">
      {categories.map((item, index) => (
        <button
          key={index}
          className={`px-5 py-2 rounded-full ${
            index === 0
              ? "bg-[#E85D4E] text-white"
              : "bg-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}