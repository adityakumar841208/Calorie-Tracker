import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db';
import dailyLogRoutes from './routes/dailyLogs';
import reminderRoutes from './routes/reminders';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/daily-logs', dailyLogRoutes);
app.use('/api/reminders', reminderRoutes);

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
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
