// server.js
// This is the file that actually STARTS the server

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Todo app running at http://localhost:${PORT}`);
});
