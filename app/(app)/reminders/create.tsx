import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/lib/firebase';
import { requestNotificationPermissions, scheduleRepeatingReminder } from '@/services/notificationService';
import { createReminder } from '@/services/reminderService';
import { router } from 'expo-router';
import { ChevronLeft, Clock, Info, Repeat } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FREQUENCY_PRESETS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
  { label: '4 hours', value: 240 },
  { label: '6 hours', value: 360 },
];

export default function CreateReminderScreen() {
  const colorScheme = useColorScheme();
  const [label, setLabel] = useState('');
  const [frequency, setFrequency] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [respectSleepSchedule, setRespectSleepSchedule] = useState(true);
  const [loading, setLoading] = useState(false);  const handleCreate = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !label.trim() || !frequency) return;

    const freq = parseInt(frequency, 10);
    if (isNaN(freq) || freq < 1) {
      alert('Frequency must be at least 1 minute');
      return;
    }

    setLoading(true);
    try {
      // Request notification permissions
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        alert('Notification permissions are required for reminders to work. Please enable them in your device settings.');
        setLoading(false);
        return;
      }

      // Create the reminder
      const newReminder = await createReminder(uid, label.trim(), freq);
      
      // Schedule notifications if reminder was created successfully
      if (newReminder) {
        // TODO: Get sleep schedule from user settings
        await scheduleRepeatingReminder(newReminder, respectSleepSchedule);
        alert(`Reminder "${label}" created! You'll be notified every ${freq} ${freq === 1 ? 'minute' : 'minutes'}.`);
      }
      
      router.back();
    } catch (error) {
      console.error('Failed to create reminder:', error);
      alert('Failed to create reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (value: number) => {
    setSelectedPreset(value);
    setFrequency(value.toString());
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#111827' : '#F9FAFB' },
      ]}
      edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
            New Reminder
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Form */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Info Card */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.1)',
                  borderColor: colorScheme === 'dark' ? 'rgba(37, 99, 235, 0.3)' : 'rgba(37, 99, 235, 0.2)',
                },
              ]}>
              <Info size={20} color="#2563EB" strokeWidth={2} />
              <Text
                style={[
                  styles.infoText,
                  { color: colorScheme === 'dark' ? '#BFDBFE' : '#1E40AF' },
                ]}>
                Create custom reminders to help you stay on track with your health goals.
              </Text>
            </View>

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                ]}>
                Reminder Name
              </Text>
              <TextInput
                value={label}
                onChangeText={setLabel}
                placeholder="e.g., Drink Water, Take Break, Exercise"
                placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                style={[
                  styles.input,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937',
                    borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  },
                ]}
              />
            </View>

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Repeat size={18} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} strokeWidth={2} />
                <Text
                  style={[
                    styles.label,
                    { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                  ]}>
                  Frequency
                </Text>
              </View>
              
              {/* Preset Buttons */}
              <View style={styles.presetGrid}>
                {FREQUENCY_PRESETS.map((preset) => (
                  <Pressable
                    key={preset.value}
                    onPress={() => handlePresetSelect(preset.value)}
                    style={({ pressed }) => [
                      styles.presetButton,
                      {
                        backgroundColor:
                          selectedPreset === preset.value
                            ? '#5B21B6'
                            : pressed
                            ? colorScheme === 'dark'
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.03)'
                            : colorScheme === 'dark'
                            ? '#374151'
                            : '#F3F4F6',
                        borderColor:
                          selectedPreset === preset.value
                            ? '#5B21B6'
                            : colorScheme === 'dark'
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.1)',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.presetText,
                        {
                          color:
                            selectedPreset === preset.value
                              ? '#FFFFFF'
                              : colorScheme === 'dark'
                              ? '#E5E7EB'
                              : '#374151',
                        },
                      ]}>
                      {preset.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Custom Input */}
              <View style={styles.customInputContainer}>
                <Clock size={18} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} strokeWidth={2} />
                <TextInput
                  value={frequency}
                  onChangeText={(text) => {
                    setFrequency(text);
                    setSelectedPreset(null);
                  }}
                  placeholder="Or enter custom minutes"
                  placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  keyboardType="numeric"
                  style={[
                    styles.customInput,
                    {
                      backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                      color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937',
                      borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                  ]}
                />
              </View>
            </View>

            {/* Sleep Schedule Option */}
            <View
              style={[
                styles.optionCard,
                {
                  backgroundColor: colorScheme === 'dark' ? '#374151' : '#F9FAFB',
                  borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                },
              ]}>
              <View style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                    <Clock size={18} color="#8B5CF6" strokeWidth={2} />
                  </View>
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
                      ]}>
                      Respect Sleep Schedule
                    </Text>
                    <Text
                      style={[
                        styles.optionHint,
                        { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' },
                      ]}>
                      Pause during sleep hours
                    </Text>
                  </View>
                </View>
                <Switch
                  value={respectSleepSchedule}
                  onValueChange={setRespectSleepSchedule}
                  trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
                  thumbColor={respectSleepSchedule ? '#8B5CF6' : '#F3F4F6'}
                />
              </View>
            </View>
          </View>
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
            onPress={handleCreate}
            disabled={!label.trim() || !frequency || loading}
            style={({ pressed }) => [
              styles.createButton,
              {
                opacity: !label.trim() || !frequency || loading ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Create Reminder</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  },
  form: {
    padding: 16,
    gap: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  field: {
    gap: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionHint: {
    fontSize: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  createButton: {
    backgroundColor: '#5B21B6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
