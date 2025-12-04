import express, { Request, Response } from 'express';
import { Reminder } from '../models/Reminder';

const router = express.Router();

// Get all reminders for a user
router.get('/:uid', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const reminders = await Reminder.find({ uid }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch reminders' });
  }
});

// Create a new reminder
router.post('/', async (req: Request, res: Response) => {
  try {
    const { uid, label, frequency, enabled } = req.body;

    if (!uid || !label || !frequency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (frequency < 1) {
      return res.status(400).json({ error: 'Frequency must be at least 1 minute' });
    }

    const reminder = new Reminder({ uid, label, frequency, enabled: enabled ?? true });
    await reminder.save();

    res.status(201).json({
      message: 'Reminder created successfully',
      reminder,
    });
  } catch (error: any) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: error.message || 'Failed to create reminder' });
  }
});

// Update a reminder
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.frequency && updates.frequency < 1) {
      return res.status(400).json({ error: 'Frequency must be at least 1 minute' });
    }

    const reminder = await Reminder.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json({
      message: 'Reminder updated successfully',
      reminder,
    });
  } catch (error: any) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: error.message || 'Failed to update reminder' });
  }
});

// Delete a reminder
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reminder = await Reminder.findByIdAndDelete(id);

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    res.json({
      message: 'Reminder deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ error: error.message || 'Failed to delete reminder' });
  }
});

export default router;
