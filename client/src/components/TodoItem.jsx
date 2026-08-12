export default function TodoItem({ todo, busy, onToggle, onDelete }) {
  return (
    <li className={todo.completed ? 'todo-item completed' : 'todo-item'}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          disabled={busy}
          onChange={() => onToggle(todo)}
        />
        <span>{todo.title}</span>
      </label>
      <button className="delete-button" disabled={busy} onClick={() => onDelete(todo._id)}>
        {busy ? 'Working...' : 'Delete'}
      </button>
    </li>
  )
}
