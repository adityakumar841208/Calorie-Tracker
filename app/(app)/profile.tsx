import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch } from 'react-native';

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

  const handleSettingPress = (id: string) => {
    // TODO: Handle navigation or action based on setting ID
    console.log('Setting pressed:', id);
  };

  const handleLogout = () => {
    // TODO: Clear auth state and storage
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.avatarContainer}>
          <IconSymbol name="person.crop.circle.fill" size={80} color="#007AFF" />
        </ThemedView>
        <ThemedText type="title">{MOCK_USER.name}</ThemedText>
        <ThemedText style={styles.email}>{MOCK_USER.email}</ThemedText>
      </ThemedView>

      {/* Settings Sections */}
      {SETTINGS_SECTIONS.map(section => (
        <ThemedView key={section.title} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {section.title}
          </ThemedText>

          <ThemedView style={styles.sectionContent}>
            {section.items.map(item => (
              <Pressable
                key={item.id}
                style={styles.settingItem}
                onPress={() => handleSettingPress(item.id)}
              >
                {item.icon && (
                  <IconSymbol name={item.icon} size={24} color="#666" style={styles.settingIcon} />
                )}
                <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                {item.type === 'toggle' ? (
                  <Switch
                    value={item.id === 'notifications' ? notificationsEnabled : darkMode}
                    onValueChange={value => {
                      if (item.id === 'notifications') {
                        setNotificationsEnabled(value);
                      } else if (item.id === 'darkMode') {
                        setDarkMode(value);
                      }
                    }}
                  />
                ) : (
                  <IconSymbol name="chevron.right" size={20} color="#666" />
                )}
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>
      ))}

      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </Pressable>

      <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  email: {
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
  },
});