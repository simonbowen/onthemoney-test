import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import TodoList from './TodoList'
import logo from './logo.svg'

export const TODOS = gql`
  query GetTodos {
    todos {
      _id
      title
      done
    }
  }
`

const ADD_TODO = gql`
  mutation AddTodo($title: String!, $done: Boolean) {
    createTodo(title: $title, done: $done) {
      _id
      title
      done
    } 
  }  
`

const TODOS_SUBSCRIPTION = gql`
  subscription OnTodoAdded {
    todoAdded {
      _id
      title
      done
    }
  }
`

const TODO_UPDATED_SUBSCRIPTION = gql`
  subscription OnTodoUpdated {
    todoUpdated {
      _id
      title
      done
    }
  }
`

const TODO_DELETED_SUBSCRIPTION = gql`
  subscription TodoDeleted {
    todoDeleted {
      _id
    }
  }
`

function App() {

  const [input, setInput] = useState('')

  const { subscribeToMore, loading, data: todos } = useQuery(TODOS)

  const subscribeToNewTodos = () => subscribeToMore({
    document: TODOS_SUBSCRIPTION,
    updateQuery: (currentToDos, { subscriptionData }) => {
      if (!subscriptionData.data) return currentToDos;
      const newToDo = subscriptionData.data.todoAdded;
      const updatedToDos = currentToDos.todos.concat(newToDo)

      return { todos: updatedToDos }
    }
  })

  const subscribeToUpdatedTodos = () => subscribeToMore({
    document: TODO_UPDATED_SUBSCRIPTION,
    updateQuery: (currentToDos, { subscriptionData }) => {
      if (!subscriptionData.data) return currentToDos;
      return { todos: currentToDos }
    }
  })

  const subscribeToDeletedTodo = () => subscribeToMore({
    document: TODO_DELETED_SUBSCRIPTION,
    updateQuery: (currentToDos, { subscriptionData }) => {
      if (!subscriptionData.data) return currentToDos;
      const { todoDeleted: { _id } } = subscriptionData.data

      return { todos: currentToDos.todos.filter((item: Todo) => item._id !== _id) }
    }
  })

  const [addTodo] = useMutation(ADD_TODO)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeypress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!input) return

      await addTodo({ variables: { title: input, done: false}})
      setInput('')
    }
  }

  React.useEffect(() => subscribeToNewTodos(), []);
  React.useEffect(() => subscribeToUpdatedTodos(), [])
  React.useEffect(() => subscribeToDeletedTodo(), []);

  if (loading) {
    return <div/>
  }

  return (
    <div className={'container'}>
      <div style={{ textAlign: 'center' }} className={'mt-4'}>
        <img src={logo} alt="Logo" style={{ maxWidth: '200px'}} />
      </div>

      <input
        className={'form-control mt-4'}
        type="text"
        value={input}
        onChange={handleInput}
        onKeyPress={handleKeypress}
        placeholder={'Type and Press Enter'}
      />

      <TodoList Todos={todos.todos} />
    </div>
  )
}

export default App;
