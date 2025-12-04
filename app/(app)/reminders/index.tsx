import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/lib/firebase';
import { cancelReminderNotification, rescheduleAllReminders, scheduleRepeatingReminder } from '@/services/notificationService';
import { deleteReminder, getRemindersList, Reminder, updateReminder } from '@/services/reminderService';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Bell, ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RemindersScreen() {
  const colorScheme = useColorScheme();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  const loadReminders = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      const data = await getRemindersList(uid);
      setReminders(data);
      
      // Reschedule all enabled reminders when screen loads
      const enabledReminders = data.filter(r => r.enabled);
      if (enabledReminders.length > 0) {
        await rescheduleAllReminders(enabledReminders, true);
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    setLoading(true);
    try {
      await cancelReminderNotification(id);
      await deleteReminder(id);
      loadReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      alert('Failed to delete reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (reminder: Reminder) => {
    setLoading(true);
    try {
      const updatedReminder = await updateReminder(reminder._id, { enabled: !reminder.enabled });
      
      if (updatedReminder) {
        if (updatedReminder.enabled) {
          // Schedule notifications when enabling
          await scheduleRepeatingReminder(updatedReminder, true);
        } else {
          // Cancel notifications when disabling
          await cancelReminderNotification(updatedReminder._id);
        }
      }
      
      loadReminders();
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      alert('Failed to update reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#111827' : '#F9FAFB' },
      ]}
      edges={['top']}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          },
        ]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} strokeWidth={2} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Bell size={24} color="#5B21B6" strokeWidth={2} />
          <Text
            style={[
              styles.headerTitle,
              { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
            ]}>
            Reminders
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading && reminders.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#5B21B6" />
          </View>
        ) : reminders.length === 0 ? (
          <View style={styles.centered}>
            <Bell size={64} color={colorScheme === 'dark' ? '#4B5563' : '#9CA3AF'} strokeWidth={1.5} />
            <Text
              style={[
                styles.emptyText,
                { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' },
              ]}>
              No reminders yet
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { color: colorScheme === 'dark' ? '#6B7280' : '#9CA3AF' },
              ]}>
              Create your first reminder to stay on track
            </Text>
          </View>
        ) : (
          <View style={styles.reminderList}>
            {reminders.map((reminder) => (
              <View
                key={reminder._id}
                style={[
                  styles.reminderCard,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  },
                ]}>
                <View style={styles.reminderContent}>
                  <View style={styles.reminderInfo}>
                    <Text
                      style={[
                        styles.reminderLabel,
                        { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
                      ]}>
                      {reminder.label}
                    </Text>
                    <Text
                      style={[
                        styles.reminderFrequency,
                        { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' },
                      ]}>
                      Every {reminder.frequency} {reminder.frequency === 1 ? 'minute' : 'minutes'}
                    </Text>
                  </View>
                  <Switch
                    value={reminder.enabled}
                    onValueChange={() => handleToggleEnabled(reminder)}
                    trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
                    thumbColor={reminder.enabled ? '#5B21B6' : '#F3F4F6'}
                  />
                </View>
                <View style={styles.reminderActions}>
                  <Pressable
                    onPress={() => router.push({
                      pathname: '/(app)/reminders/edit',
                      params: { id: reminder._id, label: reminder.label, frequency: reminder.frequency.toString() }
                    })}
                    style={({ pressed }) => [
                      styles.actionButton,
                      {
                        backgroundColor: pressed
                          ? colorScheme === 'dark'
                            ? 'rgba(91, 33, 182, 0.2)'
                            : 'rgba(91, 33, 182, 0.1)'
                          : 'transparent',
                      },
                    ]}>
                    <Text style={[styles.actionButtonText, { color: '#5B21B6' }]}>Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteReminder(reminder._id)}
                    style={({ pressed }) => [
                      styles.actionButton,
                      {
                        backgroundColor: pressed
                          ? colorScheme === 'dark'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(239, 68, 68, 0.1)'
                          : 'transparent',
                      },
                    ]}>
                    <Trash2 size={16} color="#EF4444" strokeWidth={2} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <Pressable
        onPress={() => router.push('/(app)/reminders/create')}
        style={({ pressed }) => [
          styles.fab,
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}>
        <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    gap: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  reminderList: {
    gap: 12,
  },
  reminderCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  reminderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderInfo: {
    flex: 1,
    gap: 4,
  },
  reminderLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  reminderFrequency: {
    fontSize: 14,
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
