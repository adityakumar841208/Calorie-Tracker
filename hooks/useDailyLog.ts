import { DailyLog, getDailyLog, getTodayDate } from '@/services/dailyLogService';
import { useEffect, useState } from 'react';

export function useDailyLog(uid: string | null, date?: string) {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || getTodayDate();

  const fetchLog = async () => {
    if (!uid) {
      setDailyLog(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const log = await getDailyLog(uid, targetDate);
      setDailyLog(log);
    } catch (err: any) {
      console.error('Error fetching daily log:', err);
      setError(err.message || 'Failed to fetch daily log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, targetDate]);

  return {
    dailyLog,
    loading,
    error,
    refetch: fetchLog,
  };
}
