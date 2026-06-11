import axios from 'axios';

// Thay đổi URL theo cổng backend Laravel của bạn (thường là 8000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; 

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data.data; 
    } catch (error) {
        console.error("Lỗi khi fetch danh mục:", error);
        throw error;
    }
};