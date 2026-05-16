const AboutPage = () => {
    return (
        /* Sử dụng màu nền kem #fdf5e6 bằng class custom và font chữ hệ thống */
        <div className="bg-[#fdf5e6] min-h-screen font-sans">
            
            {/* Phần Header xanh đen - Sử dụng màu #2d3e50 custom */}
            <div className="bg-[#2d3e50] text-white text-center py-[70px] px-5">
                <h1 className="text-[38px] font-bold mb-[15px]">Về DANAEventSpark</h1>
                <p className="text-base opacity-85 tracking-[0.5px]">Kết nối cộng đồng qua từng khoảnh khắc ý nghĩa</p>
            </div>

            {/* Phần nội dung Sứ mệnh */}
            <div className="max-w-[1200px] mx-auto py-[60px] px-5">
                <div className="flex flex-col lg:flex-row gap-[50px] items-start">
                    
                    {/* Khối bên trái: Chữ nghĩa thông tin */}
                    <div className="flex-[1.2] w-full">
                        <h2 className="text-[#2d3e50] text-3xl font-bold mb-[25px]">
                            Sứ mệnh của chúng tôi
                        </h2>
                        
                        <p className="text-[#4a5568] text-base leading-relaxed mb-5 text-justify">
                            EventSpark được ra đời với mong muốn tạo ra một không gian kết nối 
                            cộng đồng hiện đại, nơi mọi người có thể dễ dàng tìm kiếm và tham gia 
                            vào những hoạt động ý nghĩa xung quanh mình.
                        </p>
                        
                        <p className="text-[#4a5568] text-base leading-relaxed mb-5 text-justify">
                            Chúng tôi tin rằng mỗi sự kiện, dù lớn hay nhỏ, đều mang trong mình sức 
                            mạnh gắn kết và tạo nên những thay đổi tích cực cho xã hội.
                        </p>

                        {/* Khối 2 ô thẻ nhỏ ở dưới */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-[35px]">
                            {/* Thẻ Kết nối */}
                            <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
                                <div className="text-2xl mb-2.5">💛</div>
                                <h3 className="text-[#2d3e50] text-lg font-bold mb-2">Kết nối</h3>
                                <p className="text-[#718096] text-sm leading-normal">Gắn kết mọi người qua những sở thích chung.</p>
                            </div>

                            {/* Thẻ Sáng tạo */}
                            <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-5 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
                                <div className="text-2xl mb-2.5">☀️</div>
                                <h3 className="text-[#2d3e50] text-lg font-bold mb-2">Sáng tạo</h3>
                                <p className="text-[#718096] text-sm leading-normal">Không ngừng đổi mới trải nghiệm người dùng.</p>
                            </div>
                        </div>
                    </div>

                    {/* Khối bên phải: Hình ảnh minh họa */}
                    <div className="flex-[0.8] w-full">
                        <img 
                            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop" 
                            alt="Cộng đồng EventSpark" 
                            className="w-full h-auto rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] object-cover"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AboutPage;