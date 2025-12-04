import { useColorScheme } from '@/hooks/use-color-scheme';
import { cancelReminderNotification, scheduleRepeatingReminder } from '@/services/notificationService';
import { updateReminder } from '@/services/reminderService';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditReminderScreen() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams<{ id: string; label: string; frequency: string }>();
  const [label, setLabel] = useState(params.label || '');
  const [frequency, setFrequency] = useState(params.frequency || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!params.id || !label.trim() || !frequency) return;

    const freq = parseInt(frequency, 10);
    if (isNaN(freq) || freq < 1) {
      alert('Frequency must be at least 1 minute');
      return;
    }

    setLoading(true);
    try {
      const updatedReminder = await updateReminder(params.id, { label: label.trim(), frequency: freq });
      
      // Cancel old notifications and schedule new ones
      if (updatedReminder) {
        await cancelReminderNotification(params.id);
        await scheduleRepeatingReminder(updatedReminder, true);
        alert('Reminder updated successfully!');
      }
      
      router.back();
    } catch (error) {
      console.error('Failed to update reminder:', error);
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
            Edit Reminder
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Form */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                ]}>
                Label
              </Text>
              <TextInput
                value={label}
                onChangeText={setLabel}
                placeholder="e.g., Water reminder"
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
              <Text
                style={[
                  styles.label,
                  { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                ]}>
                Frequency (minutes)
              </Text>
              <TextInput
                value={frequency}
                onChangeText={setFrequency}
                placeholder="e.g., 120"
                placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937',
                    borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  },
                ]}
              />
              <Text
                style={[
                  styles.hint,
                  { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' },
                ]}>
                How often you want to be reminded (in minutes)
              </Text>
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
            onPress={handleUpdate}
            disabled={!label.trim() || !frequency || loading}
            style={({ pressed }) => [
              styles.updateButton,
              {
                opacity: !label.trim() || !frequency || loading ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.updateButtonText}>Update Reminder</Text>
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
    gap: 24,
  },
  field: {
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
  hint: {
    fontSize: 13,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  updateButton: {
    backgroundColor: '#5B21B6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
