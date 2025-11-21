import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

// Create user profile
router.post('/', async (req: Request, res: Response) => {
  try {
    const { uid, goal, targetCalories, weight } = req.body;

    if (!uid || !goal || !targetCalories || !weight) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(409).json({ error: 'User profile already exists' });
    }

    const user = new User({ uid, goal, targetCalories, weight });
    await user.save();

    res.status(201).json({
      message: 'User profile created successfully',
      user: {
        uid: user.uid,
        goal: user.goal,
        targetCalories: user.targetCalories,
        weight: user.weight,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ error: error.message || 'Failed to create user profile' });
  }
});

// Get user profile
router.get('/:uid', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({
      uid: user.uid,
      goal: user.goal,
      targetCalories: user.targetCalories,
      weight: user.weight,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user profile' });
  }
});

// Update user profile
router.patch('/:uid', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({
      message: 'User profile updated successfully',
      user: {
        uid: user.uid,
        goal: user.goal,
        targetCalories: user.targetCalories,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: error.message || 'Failed to update user profile' });
  }
});

export default router;
