import React from 'react'
import './Todo.css'

type TodoProps = {
  todo: Todo,
  handleCheckboxChange: React.ChangeEventHandler<HTMLInputElement>,
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function Todo(props: TodoProps) {
  return (
    <div className="Todo" style={{ textDecoration: props.todo.done ? 'line-through' : 'none' }}>
      <div className={'p4 d-flex align-items-center h100'}>
        <input type={"checkbox"} className={'mr-4'} checked={props.todo.done} onChange={props.handleCheckboxChange} />
        <div>{props.todo.title}</div>
      </div>
      <div>
        <button className={'btn btn-danger ml-2'} onClick={props.handleDelete}>Delete</button>
      </div>
    </div>
  )
}

export default Todo