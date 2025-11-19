require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const userRoutes = require('./routes/users');
const dailyLogRoutes = require('./routes/dailyLogs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/daily-logs', dailyLogRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Calorie Tracker API is running' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
