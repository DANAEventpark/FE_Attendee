import { useState, useEffect } from 'react';
import api from '@/services/api'; 
import CategoryCard from '@/components/CategoryCard/CategoryCard';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/categories')
            .then(res => {
                setCategories(res.data.data); 
            })
            .catch(err => console.log("Lỗi: ", err));
    }, []);

    return (
        /* Nền trang màu kem nhạt đồng bộ */
        <div className="bg-[#fdf5e6] min-h-screen font-sans">
            
            {/* 1. Phần Header xanh đen dùng màu chủ đạo #2d3e50 */}
            <div className="bg-[#2d3e50] text-white text-center py-[70px] px-5">
                <h1 className="text-[38px] font-bold mb-[15px]">Khám phá theo danh mục</h1>
                <p className="text-base opacity-85 tracking-[0.5px]">Tìm kiếm sự kiện theo sở thích và đam mê của bạn</p>
            </div>

            {/* 2. Phần danh sách nội dung bên dưới */}
            <div className="max-w-[1200px] mx-auto py-[60px] px-5">
                {/* Đã chỉnh sửa: Chia 3 cột (md:grid-cols-3) và tăng khoảng cách gap-8 giúp các card thoáng giống hình */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {categories.map((item) => (
                        <CategoryCard 
                            key={item.id} 
                            id={item.id} 
                            name={item.name} 
                            count={item.events_count} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;