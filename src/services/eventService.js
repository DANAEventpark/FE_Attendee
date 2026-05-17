import api from './api'

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

export const getSystemStats = async () => {
  const response = await api.get('/system-stats') 
  return response.data
}