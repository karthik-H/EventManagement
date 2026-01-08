import { Event } from '../types'

interface EventCardProps {
  event: Event
  onEdit: () => void
  onDelete: () => void
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const taskCount = event.tasks?.length || 0

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{event.name}</div>
        <div className="card-actions">
          <button className="btn btn-secondary" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      {event.description && (
        <p style={{ marginBottom: '15px', color: '#666' }}>{event.description}</p>
      )}

      <div className="date-info">
        <div>
          <strong>Start:</strong> {formatDate(event.start_date)}
        </div>
        <div>
          <strong>End:</strong> {formatDate(event.end_date)}
        </div>
        <div style={{ marginTop: '10px' }}>
          <strong>Tasks:</strong> {taskCount}
        </div>
      </div>
    </div>
  )
}

