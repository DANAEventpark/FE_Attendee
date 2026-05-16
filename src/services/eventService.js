import api from './api'

// Đảm bảo thứ tự nhận vào đúng là: page -> search -> categoryId -> timeFilter
export const getEvents = async (page = 1, search = '', categoryId = 'all', timeFilter = 'upcoming') => {
  const response = await api.get('/events', {
    params: {
      page: page,
      search: search,
      category_id: categoryId, 
      time_filter: timeFilter  
    }
  })
  return response.data
}