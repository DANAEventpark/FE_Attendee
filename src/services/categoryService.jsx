import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data; 
  } catch (error) {
    console.error("Lỗi lấy categories:", error);
    throw error;
  }
};