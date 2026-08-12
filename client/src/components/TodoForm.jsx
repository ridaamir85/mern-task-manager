import { useState } from 'react'

export default function TodoForm({ onAddTodo, submitting }) {
  const [title, setTitle] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    const created = await onAddTodo(cleanTitle)
    if (created) setTitle('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label htmlFor="todo-input">New task</label>
      <div className="input-row">
        <input
          id="todo-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you need to do?"
          maxLength="100"
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add task'}
        </button>
      </div>
    </form>
  )
}
