import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/lib/firebase';
import { createReminder, deleteReminder, getRemindersList, Reminder, updateReminder } from '@/services/reminderService';
import { Bell, Plus, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

interface ReminderSidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReminderSidebar({ visible, onClose }: ReminderSidebarProps) {
  const colorScheme = useColorScheme();
  const [slideAnim] = useState(new Animated.Value(400));
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formFrequency, setFormFrequency] = useState('');

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
      loadReminders();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const loadReminders = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      const data = await getRemindersList(uid);
      setReminders(data);
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReminder = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !formLabel.trim() || !formFrequency) return;

    const frequency = parseInt(formFrequency, 10);
    if (isNaN(frequency) || frequency < 1) {
      alert('Frequency must be at least 1 minute');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateReminder(editingId, { label: formLabel.trim(), frequency });
      } else {
        await createReminder(uid, formLabel.trim(), frequency);
      }
      setFormLabel('');
      setFormFrequency('');
      setEditingId(null);
      setShowAddForm(false);
      loadReminders();
    } catch (error) {
      console.error('Failed to save reminder:', error);
      alert('Failed to save reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    setLoading(true);
    try {
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
      await updateReminder(reminder._id, { enabled: !reminder.enabled });
      loadReminders();
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      alert('Failed to update reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (reminder: Reminder) => {
    setEditingId(reminder._id);
    setFormLabel(reminder.label);
    setFormFrequency(reminder.frequency.toString());
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setFormLabel('');
    setFormFrequency('');
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            },
          ]}
          onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              },
            ]}>
            <View style={styles.headerLeft}>
              <Bell size={24} color="#5B21B6" strokeWidth={2} />
              <Text
                style={[
                  styles.headerTitle,
                  { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
                ]}>
                Reminders
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {loading && reminders.length === 0 ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color="#5B21B6" />
              </View>
            ) : reminders.length === 0 && !showAddForm ? (
              <View style={styles.centered}>
                <Bell size={48} color={colorScheme === 'dark' ? '#4B5563' : '#9CA3AF'} strokeWidth={1.5} />
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
                        backgroundColor: colorScheme === 'dark' ? '#374151' : '#F9FAFB',
                        borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
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
                        onPress={() => startEdit(reminder)}
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

            {/* Add/Edit Form */}
            {showAddForm && (
              <View
                style={[
                  styles.form,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#374151' : '#F9FAFB',
                    borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  },
                ]}>
                <Text
                  style={[
                    styles.formTitle,
                    { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
                  ]}>
                  {editingId ? 'Edit Reminder' : 'New Reminder'}
                </Text>
                <TextInput
                  value={formLabel}
                  onChangeText={setFormLabel}
                  placeholder="Label (e.g., Water reminder)"
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
                <TextInput
                  value={formFrequency}
                  onChangeText={setFormFrequency}
                  placeholder="Frequency (minutes)"
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
                <View style={styles.formActions}>
                  <Pressable
                    onPress={cancelForm}
                    style={({ pressed }) => [
                      styles.formButton,
                      {
                        backgroundColor: pressed
                          ? colorScheme === 'dark'
                            ? '#4B5563'
                            : '#E5E7EB'
                          : colorScheme === 'dark'
                            ? '#1F2937'
                            : '#F3F4F6',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.formButtonText,
                        { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                      ]}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSaveReminder}
                    disabled={!formLabel.trim() || !formFrequency}
                    style={({ pressed }) => [
                      styles.formButton,
                      styles.formButtonPrimary,
                      {
                        opacity: !formLabel.trim() || !formFrequency ? 0.5 : pressed ? 0.8 : 1,
                      },
                    ]}>
                    <Text style={styles.formButtonTextPrimary}>
                      {editingId ? 'Update' : 'Create'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Add Button */}
          {!showAddForm && (
            <Pressable
              onPress={() => setShowAddForm(true)}
              style={({ pressed }) => [
                styles.addButton,
                {
                  opacity: pressed ? 0.8 : 1,
                },
              ]}>
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.addButtonText}>Add Reminder</Text>
            </Pressable>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  sidebar: {
    width: '85%',
    maxWidth: 400,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: '600',
  },
  reminderFrequency: {
    fontSize: 13,
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
  form: {
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    gap: 12,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formButtonPrimary: {
    backgroundColor: '#5B21B6',
  },
  formButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  formButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#5B21B6',
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
