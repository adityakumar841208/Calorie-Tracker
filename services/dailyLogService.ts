import { Platform } from 'react-native';

const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

export interface FoodItem {
  id?: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: Date;
}

export interface DailyLog {
  uid: string;
  date: string;
  items: FoodItem[];
}

function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

export async function getDailyLog(uid: string, date: string): Promise<DailyLog | null> {
  const response = await fetch(`${API_URL}/daily-logs/${uid}/${date}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch daily log');
  }
  
  const data = await response.json();
  return data.items.length > 0 ? data : null;
}

export async function logFood(
  uid: string,
  date: string,
  name: string,
  calories: number
): Promise<void> {
  const response = await fetch(`${API_URL}/daily-logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid,
      date,
      foodItem: { name, calories },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to log food');
  }
}

export async function deleteFood(uid: string, date: string, timestamp: number): Promise<void> {
  const response = await fetch(`${API_URL}/daily-logs/${uid}/${date}/${timestamp}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete food item');
  }
}

export { getTodayDate };

