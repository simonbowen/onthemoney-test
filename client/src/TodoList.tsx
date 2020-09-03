import React from 'react'
import './TodoList.css'
import Todo from './functional/Todo'
import {gql, useMutation} from "@apollo/client";

type TodoListProps = {
  Todos: Todo[]
}

const TOGGLE_DONE = gql`
  mutation ToggleMarkAsDone($id: String!) {
    toggleMarkAsDone(id: $id) {
      _id
      title
      done
    }
  }
`

const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!) {
   deleteTodo(id: $id) {
    _id
   }
  }
`

export default function TodoList({ Todos }: TodoListProps) {

  const [toggleMarkAsDone] = useMutation(TOGGLE_DONE)
  const [deleteTodo] = useMutation(DELETE_TODO)

  const handleCheckBoxChange = (todo: Todo) => toggleMarkAsDone({ variables: { id: todo._id }})
  const handleDelete = (todo: Todo) => deleteTodo({ variables: { id: todo._id }})

  if (Todos.length === 0) {
    return <div className={'alert alert-danger mt-4 text-center w100'}>No Todos</div>
  }

  return <ul className={'list-group mt-4'}>
    {Todos.map((todo, key) => {
      return (
          <li key={todo._id} className={`list-group-item ${todo.done ? "list-group-item--done" : ""}`}
          ><Todo
              todo={todo}
              handleCheckboxChange={() => handleCheckBoxChange(todo)}
              handleDelete={() => handleDelete(todo)}
          /></li>
      )
    })}

  </ul>
}