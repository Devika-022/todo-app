// src/todos.js
// This is our "database" - just an array stored in memory for simplicity

let todos = [];
let nextId = 1;

// Get all todos
function getAllTodos() {
  return todos;
}

// Add a new todo
function addTodo(title) {
  const todo = {
    id: nextId++,
    title: title,
    completed: false
  };
  todos.push(todo);
  return todo;
}

// Delete a todo by id
function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === parseInt(id));
  if (index === -1) return null;
  const deleted = todos.splice(index, 1);
  return deleted[0];
}

// Reset todos (used in testing)
function resetTodos() {
  todos = [];
  nextId = 1;
}

module.exports = { getAllTodos, addTodo, deleteTodo, resetTodos };
