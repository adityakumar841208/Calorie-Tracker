import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useUser } from '@/hooks/useUser';
import { auth } from '@/lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { LogOut, Minus, Target, TrendingDown, TrendingUp, User } from 'lucide-react-native';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

export default function ProfileScreen() {
  const { user, profile, loading } = useUser();
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

  const getGoalIcon = () => {
    if (!profile) return <Target size={20} color={colors.accent} />;
    switch (profile.goal) {
      case 'lose':
        return <TrendingDown size={20} color={colors.accent} />;
      case 'gain':
        return <TrendingUp size={20} color={colors.accent} />;
      default:
        return <Minus size={20} color={colors.accent} />;
    }
  };

  const getGoalText = () => {
    if (!profile) return 'Not Set';
    switch (profile.goal) {
      case 'lose':
        return 'Lose Weight';
      case 'gain':
        return 'Gain Weight';
      default:
        return 'Maintain Weight';
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth.signOut();
              await AsyncStorage.clear();
              router.replace('/');
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Profile Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}>
          <User size={48} color={colors.accent} />
        </View>
        <ThemedText type="title" style={[styles.name, { color: colors.textPrimary }]}>
          {user?.email?.split('@')[0] || 'User'}
        </ThemedText>
        <ThemedText style={[styles.email, { color: colors.textSecondary }]}>
          {user?.email || 'No email'}
        </ThemedText>
      </ThemedView>

      {/* Goal Card */}
      <ThemedView style={[styles.goalCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <ThemedText type="subtitle" style={[styles.goalCardTitle, { color: colors.textPrimary }]}>
          Your Goal
        </ThemedText>
        <View style={styles.goalInfo}>
          <View style={styles.goalIconContainer}>
            {getGoalIcon()}
          </View>
          <View style={styles.goalDetails}>
            <ThemedText style={[styles.goalText, { color: colors.textPrimary }]}>
              {getGoalText()}
            </ThemedText>
            <ThemedText style={[styles.goalSubtext, { color: colors.textSecondary }]}>
              {profile?.targetCalories || 0} calories/day
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Logout Button */}
      <Pressable
        style={[styles.logoutButton, { backgroundColor: colors.danger }]}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#FFF" />
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </Pressable>

      <ThemedText style={[styles.version, { color: colors.textSecondary }]}>
        Version 1.0.0
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    marginTop: 4,
    fontSize: 14,
  },
  goalCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 14,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  goalCardTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  goalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalDetails: {
    flex: 1,
  },
  goalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  goalSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    marginHorizontal: 22,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
