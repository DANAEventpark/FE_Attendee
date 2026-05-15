import api from './api'

export const getEvents = async (page = 1) => {
  const response = await api.get(`/events?page=${page}`)
  return response.data
}