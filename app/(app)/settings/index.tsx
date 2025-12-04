import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { Bell, ChevronLeft, ChevronRight, Moon, User } from 'lucide-react-native';
import React from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();

  const settingsItems = [
    {
      icon: Moon,
      label: 'Sleep Schedule',
      description: 'Set your wake and sleep times',
      route: '/(app)/settings/sleep-schedule',
      color: '#8B5CF6',
    },
    {
      icon: Bell,
      label: 'Notification Preferences',
      description: 'Customize reminder notifications',
      route: '/(app)/settings/notifications',
      color: '#DC2626',
    },
    {
      icon: User,
      label: 'Account Settings',
      description: 'Manage your account details',
      route: '/(app)/settings/account',
      color: '#2563EB',
    },
  ];

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
          Settings
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsList}>
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={index}
                onPress={() => router.push(item.route as any)}
                style={({ pressed }) => [
                  styles.settingsItem,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}>
                <View style={styles.settingsItemLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          colorScheme === 'dark'
                            ? `${item.color}20`
                            : `${item.color}15`,
                      },
                    ]}>
                    <Icon size={22} color={item.color} strokeWidth={2} />
                  </View>
                  <View style={styles.settingsItemContent}>
                    <Text
                      style={[
                        styles.settingsItemLabel,
                        { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
                      ]}>
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.settingsItemDescription,
                        { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' },
                      ]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <ChevronRight
                  size={20}
                  color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  strokeWidth={2}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
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
  settingsList: {
    gap: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsItemContent: {
    flex: 1,
    gap: 4,
  },
  settingsItemLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsItemDescription: {
    fontSize: 13,
  },
});
