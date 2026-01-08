import { useState, useEffect } from 'react'
import EventList from './components/EventList'
import TaskList from './components/TaskList'
import EventForm from './components/EventForm'
import TaskForm from './components/TaskForm'
import { Event, Task } from './types'
import { getEvents, getTasks } from './services/api'

function App() {
  const [activeTab, setActiveTab] = useState<'events' | 'tasks'>('events')
  const [events, setEvents] = useState<Event[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [eventsData, tasksData] = await Promise.all([
        getEvents(),
        getTasks()
      ])
      setEvents(eventsData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventCreated = () => {
    setShowEventForm(false)
    setEditingEvent(null)
    loadData()
  }

  const handleTaskCreated = () => {
    setShowTaskForm(false)
    setEditingTask(null)
    loadData()
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDeleteEvent = async () => {
    await loadData()
  }

  const handleDeleteTask = async () => {
    await loadData()
  }

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Event Management System</h1>
          <p>Organize your events and tasks efficiently</p>
        </div>
      </div>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
        </div>

        {activeTab === 'events' && (
          <EventList
            events={events}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onCreateNew={() => {
              setEditingEvent(null)
              setShowEventForm(true)
            }}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            events={events}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onCreateNew={() => {
              setEditingTask(null)
              setShowTaskForm(true)
            }}
          />
        )}

        {showEventForm && (
          <EventForm
            event={editingEvent}
            onClose={() => {
              setShowEventForm(false)
              setEditingEvent(null)
            }}
            onSuccess={handleEventCreated}
          />
        )}

        {showTaskForm && (
          <TaskForm
            task={editingTask}
            events={events}
            onClose={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
            onSuccess={handleTaskCreated}
          />
        )}
      </div>
    </div>
  )
}

export default App

