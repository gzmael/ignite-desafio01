const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const user = users.find(findUser => findUser.username === username)

  if(!user) {
    return response.status(401).json({
      error: "Invalid User"
    })
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  const existsUser = users.find(user => user.username === username)

  if (existsUser) {
    return response.status(400).json({
      error: "User already exists"
    })
  }

  const user = {
    id: uuid(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { title, deadline } = request.body

  const indexUser = users.findIndex(userFind => userFind.id === user.id)
  const newTodo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  users[indexUser].todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body

  const userIndex = users.findIndex(userFind => userFind.username === user.username)

  const { todos } = user

  const todoIndex = todos.findIndex(todo => todo.id === id)

  if(todoIndex === -1) {
    return response.status(404).json({
      error: "To-do not found"
    })
  }

  const newTodo = {
    ...todos[todoIndex],
    title,
    deadline
  }

  todos[todoIndex] = newTodo
  users[userIndex].todos = todos

  return response.status(200).json(newTodo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params

  const userIndex = users.findIndex(userFind => userFind.username === user.username)

  const { todos } = user

  const todoIndex = todos.findIndex(todo => todo.id === id)

  if(todoIndex === -1) {
    return response.status(404).json({
      error: "To-do not found"
    })
  }

  const newTodo = {
    ...todos[todoIndex],
    done: true
  }

  todos[todoIndex] = newTodo
  users[userIndex].todos = todos

  return response.status(200).json(newTodo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params

  const userIndex = users.findIndex(userFind => userFind.username === user.username)

  const { todos } = user

  const todoIndex = todos.findIndex(todo => todo.id === id)

  if(todoIndex === -1) {
    return response.status(404).json({
      error: "To-do not found"
    })
  }

  todos.splice(todoIndex, 1)
  users[userIndex].todos = todos

  return response.status(204).send()
});

module.exports = app;