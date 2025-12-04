import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export interface Reminder {
  _id: string;
  uid: string;
  label: string;
  frequency: number; // in minutes
  enabled: boolean;
  createdAt: string;
}

export const getRemindersList = async (uid: string): Promise<Reminder[]> => {
  try {
    console.log('[reminderService] Fetching reminders for uid:', uid);
    const response = await fetch(`${BASE_URL}/api/reminders/${uid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reminders: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('[reminderService] Fetched reminders:', data);
    return data;
  } catch (error) {
    console.error('[reminderService] Error fetching reminders:', error);
    return [];
  }
};

export const createReminder = async (
  uid: string,
  label: string,
  frequency: number
): Promise<Reminder | null> => {
  try {
    console.log('[reminderService] Creating reminder:', { uid, label, frequency });
    const response = await fetch(`${BASE_URL}/api/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, label, frequency }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create reminder');
    }

    const data = await response.json();
    console.log('[reminderService] Created reminder:', data);
    return data.reminder || data;
  } catch (error) {
    console.error('[reminderService] Error creating reminder:', error);
    throw error;
  }
};

export const updateReminder = async (
  id: string,
  updates: Partial<Omit<Reminder, '_id' | 'uid' | 'createdAt'>>
): Promise<Reminder | null> => {
  try {
    console.log('[reminderService] Updating reminder:', { id, updates });
    const response = await fetch(`${BASE_URL}/api/reminders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update reminder');
    }

    const data = await response.json();
    console.log('[reminderService] Updated reminder:', data);
    return data.reminder || data;
  } catch (error) {
    console.error('[reminderService] Error updating reminder:', error);
    throw error;
  }
};

export const deleteReminder = async (id: string): Promise<boolean> => {
  try {
    console.log('[reminderService] Deleting reminder:', id);
    const response = await fetch(`${BASE_URL}/api/reminders/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete reminder');
    }

    console.log('[reminderService] Deleted reminder successfully');
    return true;
  } catch (error) {
    console.error('[reminderService] Error deleting reminder:', error);
    throw error;
  }
};
