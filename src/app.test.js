// src/app.test.js

// "supertest" lets us make fake HTTP requests to our app
// without actually starting the server in a browser
const request = require('supertest');
const app = require('./app');
const { resetTodos } = require('./todos');

// beforeEach = "Before EACH test, do this"
// We reset todos so every test starts with a clean empty list
// This way tests don't affect each other
beforeEach(() => {
  resetTodos();
});

// ─────────────────────────────────────────
// TEST GROUP 1: Getting todos (GET /todos)
// ─────────────────────────────────────────
describe('GET /todos', () => {

  // Test 1: When there are no todos, we should get an empty list
  test('should return empty array when no todos exist', async () => {
    const response = await request(app).get('/todos');
    
    expect(response.status).toBe(200);        // Status should be 200 (OK)
    expect(response.body).toEqual([]);         // Body should be empty array
  });

  // Test 2: After adding a todo, we should get it back
  test('should return all todos', async () => {
    // First add a todo
    await request(app)
      .post('/todos')
      .send({ title: 'Learn CI/CD' });

    // Then get all todos
    const response = await request(app).get('/todos');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);              // Should have 1 todo
    expect(response.body[0].title).toBe('Learn CI/CD'); // Title should match
  });

});

// ─────────────────────────────────────────
// TEST GROUP 2: Adding todos (POST /todos)
// ─────────────────────────────────────────
describe('POST /todos', () => {

  // Test 3: Adding a valid todo should work
  test('should create a new todo', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ title: 'Buy groceries' });   // Send a todo with title

    expect(response.status).toBe(201);                     // 201 = Created
    expect(response.body.title).toBe('Buy groceries');     // Title matches
    expect(response.body.completed).toBe(false);           // Not completed yet
    expect(response.body.id).toBeDefined();                // Has an ID
  });

  // Test 4: Adding a todo WITHOUT a title should fail
  test('should return 400 if title is missing', async () => {
    const response = await request(app)
      .post('/todos')
      .send({});   // Empty body - no title!

    expect(response.status).toBe(400);                     // 400 = Bad Request
    expect(response.body.error).toBe('Title is required'); // Error message
  });

});

// ─────────────────────────────────────────
// TEST GROUP 3: Deleting todos (DELETE /todos/:id)
// ─────────────────────────────────────────
describe('DELETE /todos/:id', () => {

  // Test 5: Deleting an existing todo should work
  test('should delete a todo', async () => {
    // First create a todo
    const created = await request(app)
      .post('/todos')
      .send({ title: 'Delete me' });

    const id = created.body.id;

    // Now delete it
    const response = await request(app).delete(`/todos/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Deleted');

    // Confirm it's actually gone
    const getAllResponse = await request(app).get('/todos');
    expect(getAllResponse.body.length).toBe(0);
  });

  // Test 6: Deleting a todo that doesn't exist should fail
  test('should return 404 if todo not found', async () => {
    const response = await request(app).delete('/todos/9999');

    expect(response.status).toBe(404);                   // 404 = Not Found
    expect(response.body.error).toBe('Todo not found');
  });

});
