import axios from "axios";


const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

const getEvents = async (page = 1) => {
  try {
    const response = await api.get("/events", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi fetch events:", error);
    throw error;
  }
};

export default getEvents;