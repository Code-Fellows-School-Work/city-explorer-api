const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Define a route for the proof of life check
app.get('/proof-of-life', (req, res) => {
  res.send('Server is alive!');
});

// Define a default route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, this is the root of the server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});