export default function Hero() {
  return (
    <section className="bg-[#14313F] text-white px-6 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="md:w-1/2">
        <span className="bg-[#E85D4E] px-5 py-2 rounded-full text-sm">
          Nền tảng sự kiện cộng đồng
        </span>

        <h1 className="text-5xl font-bold mt-6 leading-tight">
          Khám phá sự kiện
          <br />
          Xung quanh bạn
        </h1>

        <p className="mt-6 text-gray-300 leading-7">
          Từ âm nhạc, workshop đến hoạt động cộng đồng
          hấp dẫn diễn ra mỗi ngày.
        </p>

        <button className="mt-8 bg-[#E85D4E] px-6 py-3 rounded-xl hover:scale-105 duration-300">
          Khám phá ngay
        </button>

        <div className="flex gap-10 mt-12">
          <div>
            <h2 className="text-3xl font-bold">120</h2>
            <p className="text-gray-300">
              Sự kiện đang mở
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">500</h2>
            <p className="text-gray-300">
              Người đăng ký
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">25</h2>
            <p className="text-gray-300">
              Danh mục
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-5">
        <img
          className="w-44 h-72 rounded-3xl object-cover"
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
          alt=""
        />

        <img
          className="w-44 h-72 rounded-3xl object-cover mt-10"
          src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
          alt=""
        />
      </div>
    </section>
  );
}