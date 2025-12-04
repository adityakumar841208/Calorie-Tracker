import CustomHeader from '@/components/CustomHeader';
import NavigationSidebar from '@/components/NavigationSidebar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/lib/firebase';
import { Tabs, router } from 'expo-router';
import { BarChart2, LineChart, PlusCircle, UserCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/(auth)/login');
      } else {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#5B21B6',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#94A3B8' : '#64748B',
          headerShown: false,
          tabBarStyle: { 
            height: Platform.OS === 'ios' ? 85 : 65,
            paddingBottom: Platform.OS === 'ios' ? 25 : 8,
            paddingTop: 8,
            backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: -2,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Dashboard',
            headerShown: true,
            header: () => (
              <CustomHeader title="Dashboard" onMenuPress={() => setSidebarVisible(true)} />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 36,
                borderRadius: 12,
                backgroundColor: focused
                  ? colorScheme === 'dark'
                    ? 'rgba(91, 33, 182, 0.2)'
                    : 'rgba(91, 33, 182, 0.1)'
                  : 'transparent',
              }}>
                <BarChart2 size={22} color={color} strokeWidth={2.5} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="food-log"
          options={{
            title: 'Food Log',
            headerShown: true,
            header: () => (
              <CustomHeader title="Food Log" onMenuPress={() => setSidebarVisible(true)} />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 36,
                borderRadius: 12,
                backgroundColor: focused
                  ? colorScheme === 'dark'
                    ? 'rgba(91, 33, 182, 0.2)'
                    : 'rgba(91, 33, 182, 0.1)'
                  : 'transparent',
              }}>
                <PlusCircle size={22} color={color} strokeWidth={2.5} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            headerShown: true,
            header: () => (
              <CustomHeader title="Analytics" onMenuPress={() => setSidebarVisible(true)} />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 36,
                borderRadius: 12,
                backgroundColor: focused
                  ? colorScheme === 'dark'
                    ? 'rgba(91, 33, 182, 0.2)'
                    : 'rgba(91, 33, 182, 0.1)'
                  : 'transparent',
              }}>
                <LineChart size={22} color={color} strokeWidth={2.5} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: true,
            header: () => (
              <CustomHeader title="Profile" onMenuPress={() => setSidebarVisible(true)} />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 36,
                borderRadius: 12,
                backgroundColor: focused
                  ? colorScheme === 'dark'
                    ? 'rgba(91, 33, 182, 0.2)'
                    : 'rgba(91, 33, 182, 0.1)'
                  : 'transparent',
              }}>
                <UserCircle size={22} color={color} strokeWidth={2.5} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="reminders"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <NavigationSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </>
  );
}