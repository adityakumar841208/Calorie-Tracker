import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Reminder } from './reminderService';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#5B21B6',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

// Check if current time is within sleep hours
function isWithinSleepHours(wakeTime: Date, sleepTime: Date): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const wakeHour = wakeTime.getHours();
  const wakeMinute = wakeTime.getMinutes();
  const wakeTimeInMinutes = wakeHour * 60 + wakeMinute;

  const sleepHour = sleepTime.getHours();
  const sleepMinute = sleepTime.getMinutes();
  const sleepTimeInMinutes = sleepHour * 60 + sleepMinute;

  // If sleep time is later than wake time (e.g., sleep at 11 PM, wake at 7 AM)
  if (sleepTimeInMinutes > wakeTimeInMinutes) {
    // We're in sleep hours if current time is after sleep time OR before wake time
    return currentTimeInMinutes >= sleepTimeInMinutes || currentTimeInMinutes < wakeTimeInMinutes;
  } else {
    // Sleep time is earlier than wake time (crosses midnight)
    return currentTimeInMinutes >= sleepTimeInMinutes && currentTimeInMinutes < wakeTimeInMinutes;
  }
}

// Calculate next trigger time based on frequency and sleep schedule
function calculateNextTrigger(
  frequency: number,
  respectSleepSchedule: boolean,
  wakeTime?: Date,
  sleepTime?: Date
): number {
  let triggerTime = frequency * 60; // Convert minutes to seconds

  // If respecting sleep schedule and currently in sleep hours, calculate time until wake
  if (respectSleepSchedule && wakeTime && sleepTime) {
    if (isWithinSleepHours(wakeTime, sleepTime)) {
      const now = new Date();
      const nextWake = new Date();
      nextWake.setHours(wakeTime.getHours(), wakeTime.getMinutes(), 0, 0);

      // If wake time already passed today, set to tomorrow
      if (nextWake <= now) {
        nextWake.setDate(nextWake.getDate() + 1);
      }

      const timeUntilWake = Math.floor((nextWake.getTime() - now.getTime()) / 1000);
      triggerTime = Math.max(triggerTime, timeUntilWake);
    }
  }

  return triggerTime;
}

// Schedule a notification for a reminder
export async function scheduleReminderNotification(
  reminder: Reminder,
  respectSleepSchedule: boolean = true,
  wakeTime?: Date,
  sleepTime?: Date
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('Cannot schedule notification: permissions not granted');
      return null;
    }

    // Cancel any existing notifications for this reminder
    await cancelReminderNotification(reminder._id);

    if (!reminder.enabled) {
      console.log('Reminder is disabled, not scheduling notification');
      return null;
    }

    const trigger = calculateNextTrigger(
      reminder.frequency,
      respectSleepSchedule,
      wakeTime,
      sleepTime
    );

    console.log(`Scheduling notification for "${reminder.label}" in ${trigger} seconds (${trigger / 60} minutes)`);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Reminder',
        body: `It's time for: ${reminder.label}`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          reminderId: reminder._id,
          label: reminder.label,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: trigger,
        channelId: Platform.OS === 'android' ? 'reminders' : undefined,
      },
    });

    console.log(`Notification scheduled with ID: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling reminder notification:', error);
    return null;
  }
}

// Schedule repeating notifications for a reminder
export async function scheduleRepeatingReminder(
  reminder: Reminder,
  respectSleepSchedule: boolean = true,
  wakeTime?: Date,
  sleepTime?: Date
): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('Cannot schedule repeating reminder: permissions not granted');
      return;
    }

    // Cancel any existing notifications
    await cancelReminderNotification(reminder._id);

    if (!reminder.enabled) {
      console.log('Reminder is disabled, not scheduling');
      return;
    }

    // Schedule the first notification
    const notificationId = await scheduleReminderNotification(
      reminder,
      respectSleepSchedule,
      wakeTime,
      sleepTime
    );

    if (notificationId) {
      // Store notification ID with reminder ID for tracking
      console.log(`Repeating reminder set up for "${reminder.label}"`);
    }
  } catch (error) {
    console.error('Error scheduling repeating reminder:', error);
  }
}

// Cancel a reminder notification
export async function cancelReminderNotification(reminderId: string): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.reminderId === reminderId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log(`Cancelled notification for reminder: ${reminderId}`);
      }
    }
  } catch (error) {
    console.error('Error canceling reminder notification:', error);
  }
}

// Cancel all reminder notifications
export async function cancelAllReminderNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All reminder notifications cancelled');
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

// Reschedule all reminders (useful when app restarts or settings change)
export async function rescheduleAllReminders(
  reminders: Reminder[],
  respectSleepSchedule: boolean = true,
  wakeTime?: Date,
  sleepTime?: Date
): Promise<void> {
  try {
    console.log(`Rescheduling ${reminders.length} reminders...`);
    
    for (const reminder of reminders) {
      if (reminder.enabled) {
        await scheduleRepeatingReminder(reminder, respectSleepSchedule, wakeTime, sleepTime);
      }
    }
    
    console.log('All reminders rescheduled');
  } catch (error) {
    console.error('Error rescheduling all reminders:', error);
  }
}

// Handle notification received when app is in foreground
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Handle notification response (when user taps notification)
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Get all scheduled notifications (for debugging)
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}
