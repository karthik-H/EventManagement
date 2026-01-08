import { useState, useEffect } from 'react'
import { Event, EventCreate, EventUpdate } from '../types'
import { createEvent, updateEvent } from '../services/api'

interface EventFormProps {
  event?: Event | null
  onClose: () => void
  onSuccess: () => void
}

export default function EventForm({ event, onClose, onSuccess }: EventFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (event) {
      setName(event.name)
      setDescription(event.description || '')
      // Format dates for datetime-local input
      setStartDate(new Date(event.start_date).toISOString().slice(0, 16))
      setEndDate(new Date(event.end_date).toISOString().slice(0, 16))
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data: EventCreate | EventUpdate = {
        name,
        description: description || null,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
      }

      if (event) {
        await updateEvent(event.id, data)
      } else {
        await createEvent(data as EventCreate)
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error saving event:', error)
      alert(error.response?.data?.detail || 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Event Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label htmlFor="startDate">Start Date *</label>
            <input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : event ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

