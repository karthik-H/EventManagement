import { Task } from '../types'

interface TaskCardProps {
  task: Task
  eventName: string
  onEdit: () => void
  onDelete: () => void
}

export default function TaskCard({ task, eventName, onEdit, onDelete }: TaskCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'status-todo'
      case 'In Progress':
        return 'status-in-progress'
      case 'Completed':
        return 'status-completed'
      default:
        return 'status-todo'
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{task.title}</div>
          <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
            Event: {eventName}
          </div>
        </div>
        <div className="card-actions">
          <span className={`status-badge ${getStatusClass(task.status)}`}>
            {task.status}
          </span>
          <button className="btn btn-secondary" onClick={onEdit} style={{ marginLeft: '10px' }}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <p style={{ color: '#666', marginTop: '10px' }}>{task.description}</p>
      )}
    </div>
  )
}

