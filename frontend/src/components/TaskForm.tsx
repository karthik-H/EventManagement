import { useState, useEffect } from 'react'
import { Task, TaskCreate, TaskUpdate, Event } from '../types'
import { createTask, updateTask } from '../services/api'

interface TaskFormProps {
  task?: Task | null
  events: Event[]
  onClose: () => void
  onSuccess: () => void
}

export default function TaskForm({ task, events, onClose, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Completed'>('To Do')
  const [eventId, setEventId] = useState<number>(events[0]?.id || 0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setStatus(task.status)
      setEventId(task.event_id)
    } else if (events.length > 0) {
      setEventId(events[0].id)
    }
  }, [task, events])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data: TaskCreate | TaskUpdate = {
        title,
        description: description || null,
        status,
        event_id: eventId,
      }

      if (task) {
        await updateTask(task.id, data)
      } else {
        await createTask(data as TaskCreate)
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error saving task:', error)
      alert(error.response?.data?.detail || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'To Do' | 'In Progress' | 'Completed')}
              required
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="eventId">Event *</label>
            <select
              id="eventId"
              value={eventId}
              onChange={(e) => setEventId(Number(e.target.value))}
              required
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

