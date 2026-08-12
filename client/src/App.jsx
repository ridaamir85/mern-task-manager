import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from './api.js'
import AuthForm from './components/AuthForm.jsx'
import TodoForm from './components/TodoForm.jsx'
import TodoItem from './components/TodoItem.jsx'

function readSession() {
  try {
    return JSON.parse(localStorage.getItem('mern-task-session'))
  } catch {
    return null
  }
}

export default function App() {
  const [session, setSession] = useState(readSession)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(Boolean(session))
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('mern-task-session')
    setSession(null)
    setTasks([])
    setError('')
  }, [])

  const loadTasks = useCallback(async () => {
    if (!session?.token) return
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/tasks', { token: session.token })
      setTasks(data.tasks)
    } catch (requestError) {
      setError(requestError.message)
      if (requestError.status === 401) logout()
    } finally {
      setLoading(false)
    }
  }, [logout, session?.token])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  function handleAuthenticated(data) {
    const nextSession = { token: data.token, user: data.user }
    localStorage.setItem('mern-task-session', JSON.stringify(nextSession))
    setSession(nextSession)
    setError('')
  }

  async function addTask(title) {
    setBusyId('create')
    setError('')
    try {
      const data = await apiRequest('/tasks', {
        method: 'POST',
        token: session.token,
        body: { title },
      })
      setTasks((current) => [data.task, ...current])
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setBusyId('')
    }
  }

  async function toggleTask(task) {
    setBusyId(task._id)
    setError('')
    try {
      const data = await apiRequest(`/tasks/${task._id}`, {
        method: 'PATCH',
        token: session.token,
        body: { completed: !task.completed },
      })
      setTasks((current) =>
        current.map((item) => (item._id === task._id ? data.task : item)),
      )
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusyId('')
    }
  }

  async function deleteTask(id) {
    setBusyId(id)
    setError('')
    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'DELETE',
        token: session.token,
      })
      setTasks((current) => current.filter((task) => task._id !== id))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusyId('')
    }
  }

  if (!session) return <AuthForm onAuthenticated={handleAuthenticated} />

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">MERN task manager</p>
          <h1>Welcome, {session.user.name}</h1>
          <p className="summary">
            {completedCount} of {tasks.length} tasks completed
          </p>
        </div>
        <button className="secondary-button" onClick={logout}>Log out</button>
      </header>

      <TodoForm onAddTodo={addTask} submitting={busyId === 'create'} />

      {error && <div className="error-message" role="alert">{error}</div>}

      {loading ? (
        <p className="status-message">Loading your saved tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-message">No tasks yet. Add your first task above.</p>
      ) : (
        <ul className="todo-list">
          {tasks.map((task) => (
            <TodoItem
              key={task._id}
              todo={task}
              busy={busyId === task._id}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
