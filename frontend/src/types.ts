export interface Event {
  id: number
  name: string
  description: string | null
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  tasks?: Task[]
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: 'To Do' | 'In Progress' | 'Completed'
  event_id: number
  created_at: string
  updated_at: string
}

export interface EventCreate {
  name: string
  description?: string | null
  start_date: string
  end_date: string
}

export interface EventUpdate {
  name?: string
  description?: string | null
  start_date?: string
  end_date?: string
}

export interface TaskCreate {
  title: string
  description?: string | null
  status?: 'To Do' | 'In Progress' | 'Completed'
  event_id: number
}

export interface TaskUpdate {
  title?: string
  description?: string | null
  status?: 'To Do' | 'In Progress' | 'Completed'
  event_id?: number
}

