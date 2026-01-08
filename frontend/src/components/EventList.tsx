import { Event } from '../types'
import { deleteEvent } from '../services/api'
import EventCard from './EventCard'

interface EventListProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: () => void
  onCreateNew: () => void
}

export default function EventList({ events, onEdit, onDelete, onCreateNew }: EventListProps) {
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event? All associated tasks will also be deleted.')) {
      try {
        await deleteEvent(id)
        onDelete()
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event')
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Events</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          + Create New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events yet. Create your first event to get started!</p>
        </div>
      ) : (
        <div>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => onEdit(event)}
              onDelete={() => handleDelete(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

