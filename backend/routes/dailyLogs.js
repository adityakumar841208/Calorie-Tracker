const express = require('express');
const DailyLog = require('../models/DailyLog');

const router = express.Router();

// Add food item to daily log
router.post('/', async (req, res) => {
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
  } catch (error) {
    console.error('Error logging food:', error);
    res.status(500).json({ error: error.message || 'Failed to log food item' });
  }
});

// Get daily log
router.get('/:uid/:date', async (req, res) => {
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
  } catch (error) {
    console.error('Error fetching daily log:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch daily log' });
  }
});

// Delete food item from daily log
router.delete('/:uid/:date/:timestamp', async (req, res) => {
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
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ error: error.message || 'Failed to delete food item' });
  }
});

module.exports = router;
