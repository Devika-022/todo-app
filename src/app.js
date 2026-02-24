// src/app.js
// This creates our web server and defines the API routes

const express = require('express');
const { getAllTodos, addTodo, deleteTodo } = require('./todos');

const app = express();

// This lets our app understand JSON data sent by users
app.use(express.json());

// Serve a simple HTML frontend
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>My Todo App</title>
      <style>
        body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
        input { padding: 8px; width: 300px; }
        button { padding: 8px 16px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        li { margin: 10px 0; display: flex; justify-content: space-between; }
        .delete { background: #f44336; padding: 4px 10px; color: white; border: none; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>📝 My Todo App</h1>
      <input type="text" id="todoInput" placeholder="Enter a todo..." />
      <button onclick="addTodo()">Add</button>
      <ul id="todoList"></ul>

      <script>
        async function loadTodos() {
          const res = await fetch('/todos');
          const todos = await res.json();
          const list = document.getElementById('todoList');
          list.innerHTML = todos.map(t =>
            '<li>' + t.title + '<button class="delete" onclick="deleteTodo(' + t.id + ')">Delete</button></li>'
          ).join('');
        }

        async function addTodo() {
          const input = document.getElementById('todoInput');
          if (!input.value.trim()) return;
          await fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: input.value })
          });
          input.value = '';
          loadTodos();
        }

        async function deleteTodo(id) {
          await fetch('/todos/' + id, { method: 'DELETE' });
          loadTodos();
        }

        loadTodos();
      </script>
    </body>
    </html>
  `);
});

// API Route 1: GET /todos → return all todos
app.get('/todos', (req, res) => {
  res.json(getAllTodos());
});

// API Route 2: POST /todos → add a new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = addTodo(title);
  res.status(201).json(todo);
});

// API Route 3: DELETE /todos/:id → delete a todo
app.delete('/todos/:id', (req, res) => {
  const todo = deleteTodo(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json({ message: 'Deleted', todo });
});

module.exports = app;

