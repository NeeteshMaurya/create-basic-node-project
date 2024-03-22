const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();

require('dotenv').config();
const routes = require('./routes');

// Apply CORS middleware
app.use(cors());

// Apply your routes
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
