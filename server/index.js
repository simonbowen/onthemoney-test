const { ApolloServer, gql, PubSub } = require('apollo-server')

const Datastore = require('nedb')

const TODO_ADDED = 'TODO_ADDED'
const TODO_UPDATED = 'TODO_UPDATED'
const TODO_DELETED = 'TODO_DELETED'

const db = new Datastore({ filename: './todos.data', autoload: true })
const pubsub = new PubSub()

const typeDefs = gql`
  type TodoDeleted {
    _id: String
  }
   
  type Todo {
    _id: String
    title: String
    done: Boolean
    date: String
  }

  type Subscription {
    todoAdded: Todo
    todoUpdated: Todo
    todoDeleted: TodoDeleted
  }
  
  type Query {
    todos: [Todo]
  }
  
  type Mutation {
    createTodo(title: String, done: Boolean): Todo
    toggleMarkAsDone(id: String): Todo
    deleteTodo(id: String): TodoDeleted 
  }
`

function find(db, opt) {
  return new Promise(function (resolve, reject) {
    db.find(opt, function (err, doc) {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}

const fetchTodos = async () => {
  const items = await find(db, {})
  return items.sort((a, b) => a.createdAt - b.createdAt)
}

const resolvers = {
  Query: {
    todos: () => {
      return fetchTodos()
    }
  },
  Mutation: {
    createTodo: (_, args) => {
      return db.insert({ ...args, createdAt: new Date }, function (err, doc) {
        pubsub.publish(TODO_ADDED, { todoAdded: doc })
      })
    },
    toggleMarkAsDone: (_, { id }) => {
      db.findOne({ _id: id }, function (err, doc) {
        const todo = { ...doc, done: !doc.done }
        db.update({ _id: doc._id }, todo)

        pubsub.publish(TODO_UPDATED, { todoUpdated: todo })
      })
    },
    deleteTodo: async (_, args) => {
      db.remove({ _id: args.id }, function (err, numRemoved) {
        pubsub.publish(TODO_DELETED, { todoDeleted: { _id: args.id} })
      })
    }
  },
  Subscription: {
    todoAdded: {
      subscribe: () => pubsub.asyncIterator([TODO_ADDED])
    },
    todoUpdated: {
      subscribe: () => pubsub.asyncIterator([TODO_UPDATED])
    },
    todoDeleted: {
      subscribe: () => pubsub.asyncIterator([TODO_DELETED])
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url , subscriptionsUrl}) => {
  console.log(`🚀  Server ready at ${url}`);
  console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`);
});