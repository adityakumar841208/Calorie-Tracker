import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, useColorScheme } from 'react-native';

const MOCK_USER = {
  name: 'John Doe',
  email: 'john@example.com',
  goal: 'weight-loss',
  dailyCalories: 2000,
};

const SETTINGS_SECTIONS = [
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', title: 'Push Notifications', type: 'toggle' },
      { id: 'darkMode', title: 'Dark Mode', type: 'toggle' },
      { id: 'goals', title: 'Update Goals', type: 'link', icon: 'target' },
      { id: 'measurements', title: 'Units of Measurement', type: 'link', icon: 'ruler' },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'profile', title: 'Edit Profile', type: 'link', icon: 'person' },
      { id: 'password', title: 'Change Password', type: 'link', icon: 'key' },
      { id: 'privacy', title: 'Privacy Settings', type: 'link', icon: 'lock' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', title: 'Help & FAQ', type: 'link', icon: 'questionmark.circle' },
      { id: 'contact', title: 'Contact Support', type: 'link', icon: 'envelope' },
      { id: 'about', title: 'About', type: 'link', icon: 'info.circle' },
    ],
  },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '#2C2C2E' : '#E5E5E7',
    textPrimary: isDark ? '#F3F3F3' : '#111',
    textSecondary: isDark ? '#A5A5A7' : '#666',
    accent: '#007AFF',
    danger: '#FF3B30',
    shadow: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)',
  };

  const handleSettingPress = (id: string) => {
    console.log('Setting pressed:', id);
  };

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Profile Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <ThemedView style={styles.avatarContainer}>
          <IconSymbol name="person.crop.circle.fill" size={80} color={colors.accent} />
        </ThemedView>
        <ThemedText type="title" style={[styles.name, { color: colors.textPrimary }]}>
          {MOCK_USER.name}
        </ThemedText>
        <ThemedText style={[styles.email, { color: colors.textSecondary }]}>
          {MOCK_USER.email}
        </ThemedText>
      </ThemedView>

      {/* Settings Sections */}
      {SETTINGS_SECTIONS.map((section) => (
        <ThemedView key={section.title} style={styles.section}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {section.title}
          </ThemedText>

          <ThemedView
            style={[
              styles.sectionContent,
              { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
            ]}
          >
            {section.items.map((item, index) => {
              const isLast = index === section.items.length - 1;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.settingItem,
                    !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                  ]}
                  onPress={() => handleSettingPress(item.id)}
                >
                  {item.icon && (
                    <IconSymbol
                      name={item.icon}
                      size={22}
                      color={colors.accent}
                      style={styles.settingIcon}
                    />
                  )}
                  <ThemedText style={[styles.settingTitle, { color: colors.textPrimary }]}>
                    {item.title}
                  </ThemedText>
                  {item.type === 'toggle' ? (
                    <Switch
                      trackColor={{ false: colors.border, true: colors.accent }}
                      thumbColor={isDark ? '#FFF' : '#FFF'}
                      value={item.id === 'notifications' ? notificationsEnabled : darkMode}
                      onValueChange={(value) => {
                        if (item.id === 'notifications') {
                          setNotificationsEnabled(value);
                        } else if (item.id === 'darkMode') {
                          setDarkMode(value);
                        }
                      }}
                    />
                  ) : (
                    <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />
                  )}
                </Pressable>
              );
            })}
          </ThemedView>
        </ThemedView>
      ))}

      {/* Logout Button */}
      <Pressable
        style={[styles.logoutButton, { backgroundColor: colors.danger, shadowColor: colors.shadow }]}
        onPress={handleLogout}
      >
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </Pressable>

      <ThemedText style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    marginTop: 4,
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginHorizontal: 22,
    marginBottom: 10,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: 14,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  settingIcon: {
    marginRight: 14,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    marginHorizontal: 22,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 13,
  },
});
