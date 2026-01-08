import { Task, Event } from '../types'
import { deleteTask } from '../services/api'
import TaskCard from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  events: Event[]
  onEdit: (task: Task) => void
  onDelete: () => void
  onCreateNew: () => void
}

export default function TaskList({ tasks, events, onEdit, onDelete, onCreateNew }: TaskListProps) {
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id)
        onDelete()
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('Failed to delete task')
      }
    }
  }

  const getEventName = (eventId: number) => {
    const event = events.find(e => e.id === eventId)
    return event?.name || 'Unknown Event'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Tasks</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          + Create New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create your first task to get started!</p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              eventName={getEventName(task.event_id)}
              onEdit={() => onEdit(task)}
              onDelete={() => handleDelete(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

