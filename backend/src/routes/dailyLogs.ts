import express, { Request, Response } from 'express';
import { DailyLog } from '../models/DailyLog';

const router = express.Router();

// Add food item to daily log
router.post('/', async (req: Request, res: Response) => {
  try {
    const { uid, date, foodItem } = req.body;

    if (!uid || !date || !foodItem) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let dailyLog = await DailyLog.findOne({ uid, date });

    if (!dailyLog) {
      dailyLog = new DailyLog({ uid, date, items: [] });
    }

    dailyLog.items.push({
      ...foodItem,
      timestamp: new Date(),
    });

    await dailyLog.save();

    res.status(201).json({
      message: 'Food item logged successfully',
      dailyLog: {
        uid: dailyLog.uid,
        date: dailyLog.date,
        items: dailyLog.items,
      },
    });
  } catch (error: any) {
    console.error('Error logging food:', error);
    res.status(500).json({ error: error.message || 'Failed to log food item' });
  }
});

// Get daily log
router.get('/:uid/:date', async (req: Request, res: Response) => {
  try {
    const { uid, date } = req.params;

    const dailyLog = await DailyLog.findOne({ uid, date });

    if (!dailyLog) {
      return res.json({ uid, date, items: [] });
    }

    res.json({
      uid: dailyLog.uid,
      date: dailyLog.date,
      items: dailyLog.items,
    });
  } catch (error: any) {
    console.error('Error fetching daily log:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch daily log' });
  }
});

// Get multiple daily logs (for analytics)
router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const { uid, dates } = req.body;

    if (!uid || !dates || !Array.isArray(dates)) {
      return res.status(400).json({ error: 'Missing required fields or invalid dates' });
    }

    const dailyLogs = await DailyLog.find({
      uid,
      date: { $in: dates },
    });

    // Create a map for quick lookup
    const logsMap = new Map(dailyLogs.map(log => [log.date, log]));

    // Return logs in the same order as requested dates, with empty arrays for missing dates
    const result = dates.map(date => {
      const log = logsMap.get(date);
      return {
        uid,
        date,
        items: log ? log.items : [],
      };
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error fetching bulk logs:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch daily logs' });
  }
});

// Delete food item from daily log
router.delete('/:uid/:date/:timestamp', async (req: Request, res: Response) => {
  try {
    const { uid, date, timestamp } = req.params;

    const dailyLog = await DailyLog.findOne({ uid, date });

    if (!dailyLog) {
      return res.status(404).json({ error: 'Daily log not found' });
    }

    dailyLog.items = dailyLog.items.filter(
      (item) => item.timestamp.getTime() !== parseInt(timestamp)
    );

    await dailyLog.save();

    res.json({
      message: 'Food item deleted successfully',
      dailyLog: {
        uid: dailyLog.uid,
        date: dailyLog.date,
        items: dailyLog.items,
      },
    });
  } catch (error: any) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ error: error.message || 'Failed to delete food item' });
  }
});

export default router;
