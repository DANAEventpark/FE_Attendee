import client from '@/api/client'


// Đảm bảo thứ tự nhận vào đúng là: page -> search -> categoryId -> timeFilter
export const getEvents = async (page = 1, search = '', categoryId = 'all', timeFilter = 'upcoming') => {
  const response = await client.get('/events', {

    params: {
      page: page,
      search: search,
      category_id: categoryId, 
      time_filter: timeFilter  
    }
  })
  return response.data
}

export const getSystemStats = async () => {
  const response = await client.get('/system-stats') 
  return response.data
}