import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/lib/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SleepScheduleScreen() {
  const colorScheme = useColorScheme();
  const [enabled, setEnabled] = useState(true);
  const [wakeTime, setWakeTime] = useState(new Date());
  const [sleepTime, setSleepTime] = useState(new Date());
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default times: wake at 7 AM, sleep at 11 PM
    const defaultWake = new Date();
    defaultWake.setHours(7, 0, 0, 0);
    setWakeTime(defaultWake);

    const defaultSleep = new Date();
    defaultSleep.setHours(23, 0, 0, 0);
    setSleepTime(defaultSleep);

    loadSleepSchedule();
  }, []);

  const loadSleepSchedule = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      // TODO: Fetch sleep schedule from API
      // const schedule = await getSleepSchedule(uid);
      // if (schedule) {
      //   setEnabled(schedule.enabled);
      //   setWakeTime(new Date(schedule.wakeTime));
      //   setSleepTime(new Date(schedule.sleepTime));
      // }
    } catch (error) {
      console.error('Failed to load sleep schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      // TODO: Save sleep schedule to API
      // await saveSleepSchedule(uid, {
      //   enabled,
      //   wakeTime: wakeTime.toISOString(),
      //   sleepTime: sleepTime.toISOString(),
      // });
      alert('Sleep schedule saved successfully!');
      router.back();
    } catch (error) {
      console.error('Failed to save sleep schedule:', error);
      alert('Failed to save sleep schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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
        <Text
          style={[
            styles.headerTitle,
            { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
          ]}>
          Sleep Schedule
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
              borderColor: colorScheme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
            },
          ]}>
          <Moon size={24} color="#8B5CF6" strokeWidth={2} />
          <Text
            style={[
              styles.infoText,
              { color: colorScheme === 'dark' ? '#E9D5FF' : '#6B21A8' },
            ]}>
            Reminders won&apos;t notify you during your sleep hours to ensure uninterrupted rest.
          </Text>
        </View>

        {/* Enable/Disable */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            },
          ]}>
          <View style={styles.cardRow}>
            <Text
              style={[
                styles.cardLabel,
                { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
              ]}>
              Enable Sleep Schedule
            </Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
              thumbColor={enabled ? '#8B5CF6' : '#F3F4F6'}
            />
          </View>
          <Text
            style={[
              styles.cardHint,
              { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' },
            ]}>
            Pause reminders during your sleep hours
          </Text>
        </View>

        {/* Wake Time */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            },
          ]}>
          <View style={styles.timeSection}>
            <View style={styles.timeSectionHeader}>
              <View style={[styles.timeIconContainer, { backgroundColor: 'rgba(251, 146, 60, 0.15)' }]}>
                <Sun size={20} color="#FB923C" strokeWidth={2} />
              </View>
              <Text
                style={[
                  styles.cardLabel,
                  { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
                ]}>
                Wake Time
              </Text>
            </View>
            <Pressable
              onPress={() => setShowWakePicker(true)}
              disabled={!enabled}
              style={({ pressed }) => [
                styles.timeButton,
                {
                  backgroundColor: pressed
                    ? colorScheme === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)'
                    : 'transparent',
                  opacity: enabled ? 1 : 0.5,
                },
              ]}>
              <Text
                style={[
                  styles.timeText,
                  { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                ]}>
                {formatTime(wakeTime)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Sleep Time */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            },
          ]}>
          <View style={styles.timeSection}>
            <View style={styles.timeSectionHeader}>
              <View style={[styles.timeIconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <Moon size={20} color="#8B5CF6" strokeWidth={2} />
              </View>
              <Text
                style={[
                  styles.cardLabel,
                  { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
                ]}>
                Sleep Time
              </Text>
            </View>
            <Pressable
              onPress={() => setShowSleepPicker(true)}
              disabled={!enabled}
              style={({ pressed }) => [
                styles.timeButton,
                {
                  backgroundColor: pressed
                    ? colorScheme === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)'
                    : 'transparent',
                  opacity: enabled ? 1 : 0.5,
                },
              ]}>
              <Text
                style={[
                  styles.timeText,
                  { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                ]}>
                {formatTime(sleepTime)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Time Pickers */}
        {showWakePicker && (
          <DateTimePicker
            value={wakeTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowWakePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setWakeTime(selectedDate);
              }
            }}
          />
        )}

        {showSleepPicker && (
          <DateTimePicker
            value={sleepTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowSleepPicker(Platform.OS === 'ios');
              if (selectedDate) {
                setSleepTime(selectedDate);
              }
            }}
          />
        )}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          },
        ]}>
        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={({ pressed }) => [
            styles.saveButton,
            {
              opacity: loading ? 0.5 : pressed ? 0.8 : 1,
            },
          ]}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Schedule</Text>
          )}
        </Pressable>
      </View>
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardHint: {
    fontSize: 13,
    marginTop: 8,
  },
  timeSection: {
    gap: 12,
  },
  timeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  timeText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
