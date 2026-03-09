const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

const analyzeRoutes = require('./routes/analyze');
app.use('/analyze', analyzeRoutes);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'ChainScope API is running' });
});

// Your routes will go here
const addressRoutes = require('./routes/addressRoutes');
app.use('/api', addressRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});