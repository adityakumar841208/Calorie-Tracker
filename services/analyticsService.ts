import { Platform } from 'react-native';

const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

export interface WeeklyData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AnalyticsData {
  weeklyData: WeeklyData[];
  weeklyAverage: number;
  totalCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  streakDays: number;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDateRange(endDate: Date, days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
}

export async function getWeeklyAnalytics(
  uid: string,
  endDate: Date = new Date()
): Promise<AnalyticsData> {
  const dates = getDateRange(endDate, 7);
  
  try {
    // Use bulk endpoint for better performance
    const response = await fetch(`${API_URL}/daily-logs/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, dates }),
    });

    const logs = response.ok ? await response.json() : dates.map(date => ({ date, items: [] }));

    // Process the data
    const weeklyData: WeeklyData[] = logs.map((log: any) => {
      const items = log.items || [];
      const calories = items.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
      const protein = items.reduce((sum: number, item: any) => sum + (item.protein || 0), 0);
      const carbs = items.reduce((sum: number, item: any) => sum + (item.carbs || 0), 0);
      const fat = items.reduce((sum: number, item: any) => sum + (item.fat || 0), 0);

      return {
        date: log.date,
        calories,
        protein,
        carbs,
        fat,
      };
    });

    // Calculate averages
    const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
    const daysWithData = weeklyData.filter(d => d.calories > 0).length || 1;
    const weeklyAverage = Math.round(totalCalories / 7);
    const averageProtein = Math.round(weeklyData.reduce((sum, day) => sum + day.protein, 0) / daysWithData);
    const averageCarbs = Math.round(weeklyData.reduce((sum, day) => sum + day.carbs, 0) / daysWithData);
    const averageFat = Math.round(weeklyData.reduce((sum, day) => sum + day.fat, 0) / daysWithData);

    // Calculate streak (consecutive days with logged food)
    let streakDays = 0;
    for (let i = weeklyData.length - 1; i >= 0; i--) {
      if (weeklyData[i].calories > 0) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      weeklyData,
      weeklyAverage,
      totalCalories,
      averageProtein,
      averageCarbs,
      averageFat,
      streakDays,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return empty data on error
    return {
      weeklyData: dates.map(date => ({ date, calories: 0, protein: 0, carbs: 0, fat: 0 })),
      weeklyAverage: 0,
      totalCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      streakDays: 0,
    };
  }
}

export async function getMonthlyAnalytics(
  uid: string,
  endDate: Date = new Date()
): Promise<AnalyticsData> {
  const dates = getDateRange(endDate, 30);
  
  const logsPromises = dates.map(date =>
    fetch(`${API_URL}/daily-logs/${uid}/${date}`)
      .then(res => res.json())
      .catch(() => ({ date, items: [] }))
  );

  const logs = await Promise.all(logsPromises);

  const weeklyData: WeeklyData[] = logs.map(log => {
    const items = log.items || [];
    const calories = items.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
    const protein = items.reduce((sum: number, item: any) => sum + (item.protein || 0), 0);
    const carbs = items.reduce((sum: number, item: any) => sum + (item.carbs || 0), 0);
    const fat = items.reduce((sum: number, item: any) => sum + (item.fat || 0), 0);

    return {
      date: log.date,
      calories,
      protein,
      carbs,
      fat,
    };
  });

  const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
  const daysWithData = weeklyData.filter(d => d.calories > 0).length || 1;
  const weeklyAverage = Math.round(totalCalories / daysWithData);
  const averageProtein = Math.round(weeklyData.reduce((sum, day) => sum + day.protein, 0) / daysWithData);
  const averageCarbs = Math.round(weeklyData.reduce((sum, day) => sum + day.carbs, 0) / daysWithData);
  const averageFat = Math.round(weeklyData.reduce((sum, day) => sum + day.fat, 0) / daysWithData);

  let streakDays = 0;
  for (let i = weeklyData.length - 1; i >= 0; i--) {
    if (weeklyData[i].calories > 0) {
      streakDays++;
    } else {
      break;
    }
  }

  return {
    weeklyData,
    weeklyAverage,
    totalCalories,
    averageProtein,
    averageCarbs,
    averageFat,
    streakDays,
  };
}
