import axios from 'axios'
import { Event, Task, EventCreate, EventUpdate, TaskCreate, TaskUpdate } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Event APIs
export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/events')
  return response.data
}

export const getEvent = async (id: number): Promise<Event> => {
  const response = await api.get<Event>(`/events/${id}`)
  return response.data
}

export const createEvent = async (data: EventCreate): Promise<Event> => {
  const response = await api.post<Event>('/events', data)
  return response.data
}

export const updateEvent = async (id: number, data: EventUpdate): Promise<Event> => {
  const response = await api.put<Event>(`/events/${id}`, data)
  return response.data
}

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`)
}

// Task APIs
export const getTasks = async (eventId?: number): Promise<Task[]> => {
  const params = eventId ? { event_id: eventId } : {}
  const response = await api.get<Task[]>('/tasks', { params })
  return response.data
}

export const getTask = async (id: number): Promise<Task> => {
  const response = await api.get<Task>(`/tasks/${id}`)
  return response.data
}

export const createTask = async (data: TaskCreate): Promise<Task> => {
  const response = await api.post<Task>('/tasks', data)
  return response.data
}

export const updateTask = async (id: number, data: TaskUpdate): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${id}`, data)
  return response.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}

