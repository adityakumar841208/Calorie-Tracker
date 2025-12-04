import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/lib/firebase';
import { router } from 'expo-router';
import { Bell, ChevronRight, Home, LogOut, Moon, Settings, TrendingUp, User, X } from 'lucide-react-native';
import React from 'react';
import {
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface NavigationSidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function NavigationSidebar({ visible, onClose }: NavigationSidebarProps) {
  const colorScheme = useColorScheme();
  const [slideAnim] = React.useState(new Animated.Value(-400));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      route: '/(app)/home',
      color: '#5B21B6',
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      route: '/(app)/analytics',
      color: '#059669',
    },
    {
      icon: Bell,
      label: 'Reminders',
      route: '/(app)/reminders',
      color: '#DC2626',
    },
    {
      icon: User,
      label: 'Profile',
      route: '/(app)/profile',
      color: '#2563EB',
    },
    {
      icon: Settings,
      label: 'Settings',
      route: '/(app)/settings',
      color: '#64748B',
    },
  ];

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
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
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  { color: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937' },
                ]}>
                Menu
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' },
                ]}>
                {auth.currentUser?.email}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} strokeWidth={2} />
            </Pressable>
          </View>

          {/* Navigation Items */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.menuSection}>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Pressable
                    key={index}
                    onPress={() => handleNavigation(item.route)}
                    style={({ pressed }) => [
                      styles.menuItem,
                      {
                        backgroundColor: pressed
                          ? colorScheme === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.03)'
                          : 'transparent',
                      },
                    ]}>
                    <View style={styles.menuItemLeft}>
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
                        <Icon size={20} color={item.color} strokeWidth={2} />
                      </View>
                      <Text
                        style={[
                          styles.menuItemText,
                          { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                        ]}>
                        {item.label}
                      </Text>
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

            {/* Quick Actions Section */}
            <View style={styles.divider} />
            <View style={styles.menuSection}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' },
                ]}>
                Quick Actions
              </Text>
              <Pressable
                onPress={() => {
                  onClose();
                  // Navigate to sleep schedule settings
                  router.push('/(app)/settings/sleep-schedule' as any);
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  {
                    backgroundColor: pressed
                      ? colorScheme === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.03)'
                      : 'transparent',
                  },
                ]}>
                <View style={styles.menuItemLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          colorScheme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                      },
                    ]}>
                    <Moon size={20} color="#8B5CF6" strokeWidth={2} />
                  </View>
                  <Text
                    style={[
                      styles.menuItemText,
                      { color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' },
                    ]}>
                    Sleep Schedule
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          </ScrollView>

          {/* Footer */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              },
            ]}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                {
                  backgroundColor: pressed
                    ? colorScheme === 'dark'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(239, 68, 68, 0.1)'
                    : 'transparent',
                },
              ]}>
              <LogOut size={20} color="#EF4444" strokeWidth={2} />
              <Text style={[styles.logoutText, { color: '#EF4444' }]}>Logout</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '85%',
    maxWidth: 320,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
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
  },
  menuSection: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
