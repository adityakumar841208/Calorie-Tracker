import { useUser } from '@/hooks/useUser';
import { auth } from '@/lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Calendar, Flame, LogOut, Scale, Target, TrendingDown, TrendingUp, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function ProfileScreen() {
  const { user, profile, loading } = useUser();
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const [userWeight, setUserWeight] = useState<number>(0);

  useEffect(() => {
    const loadUserWeight = async () => {
      const weight = await AsyncStorage.getItem('userWeight');
      setUserWeight(parseFloat(weight || '0'));
    };
    loadUserWeight();
  }, []);

  const colors = {
    background: isDark ? '#0B0F14' : '#F7F9FB',
    card: isDark ? '#1F2937' : '#FFFFFF',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    text: isDark ? '#F8FAFC' : '#0F172A',
    subtext: isDark ? '#94A3B8' : '#64748B',
    purple: '#5B21B6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  const getGoalConfig = () => {
    if (!profile) {
      return {
        icon: Target,
        text: 'Not Set',
        color: colors.purple,
        gradient: [colors.purple, '#7C3AED']
      };
    }
    switch (profile.goal) {
      case 'lose':
        return {
          icon: TrendingDown,
          text: 'Lose Weight',
          color: colors.success,
          gradient: [colors.success, '#059669']
        };
      case 'gain':
        return {
          icon: TrendingUp,
          text: 'Gain Weight',
          color: colors.warning,
          gradient: [colors.warning, '#D97706']
        };
      default:
        return {
          icon: Target,
          text: 'Maintain Weight',
          color: colors.purple,
          gradient: [colors.purple, '#7C3AED']
        };
    }
  };

  const calculateBMI = () => {
    if (!userWeight || userWeight <= 0) return null;
    // Assuming average height of 170cm for demo
    const heightInMeters = 1.70;
    const bmi = userWeight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: colors.warning };
    if (bmi < 25) return { text: 'Normal', color: colors.success };
    if (bmi < 30) return { text: 'Overweight', color: colors.warning };
    return { text: 'Obese', color: colors.danger };
  };

  const goalConfig = getGoalConfig();
  const GoalIcon = goalConfig.icon;
  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;
  
  const memberSince = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

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
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={goalConfig.gradient as unknown as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.avatarContainer}>
          <User size={56} color="#FFF" strokeWidth={2} />
        </View>
        <Text style={styles.name}>
          {user?.email?.split('@')[0] || 'User'}
        </Text>
        <Text style={styles.email}>
          {user?.email || 'No email'}
        </Text>
        <View style={styles.memberBadge}>
          <Calendar size={14} color="#FFF" />
          <Text style={styles.memberText}>Member since {memberSince}</Text>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconContainer, { backgroundColor: `${goalConfig.color}20` }]}>
            <GoalIcon size={24} color={goalConfig.color} strokeWidth={2.5} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{goalConfig.text}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Goal</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconContainer, { backgroundColor: `${colors.purple}20` }]}>
            <Target size={24} color={colors.purple} strokeWidth={2.5} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{profile?.targetCalories || 0}</Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Daily Cal</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconContainer, { backgroundColor: `${colors.success}20` }]}>
            <Scale size={24} color={colors.success} strokeWidth={2.5} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {userWeight > 0 ? `${userWeight}kg` : '--'}
          </Text>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Weight</Text>
        </View>
      </View>

      {/* BMI Card */}
      {bmi && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Body Mass Index</Text>
            <View style={[styles.bmiCategoryBadge, { backgroundColor: `${bmiCategory?.color}20` }]}>
              <Text style={[styles.bmiCategoryText, { color: bmiCategory?.color }]}>
                {bmiCategory?.text}
              </Text>
            </View>
          </View>
          <View style={styles.bmiContent}>
            <Text style={[styles.bmiValue, { color: colors.text }]}>{bmi}</Text>
            <Text style={[styles.bmiUnit, { color: colors.subtext }]}>BMI</Text>
          </View>
          <Text style={[styles.bmiNote, { color: colors.subtext }]}>
            Based on weight {userWeight}kg and estimated height
          </Text>
        </View>
      )}

      {/* Goal Details Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Your Journey</Text>
        <View style={styles.journeyItem}>
          <View style={[styles.journeyIcon, { backgroundColor: `${goalConfig.color}20` }]}>
            <GoalIcon size={20} color={goalConfig.color} strokeWidth={2.5} />
          </View>
          <View style={styles.journeyContent}>
            <Text style={[styles.journeyTitle, { color: colors.text }]}>{goalConfig.text}</Text>
            <Text style={[styles.journeyDesc, { color: colors.subtext }]}>
              {profile?.targetCalories || 0} calories per day to reach your goal
            </Text>
          </View>
        </View>
        <View style={styles.journeyItem}>
          <View style={[styles.journeyIcon, { backgroundColor: `${colors.warning}20` }]}>
            <Flame size={20} color={colors.warning} strokeWidth={2.5} />
          </View>
          <View style={styles.journeyContent}>
            <Text style={[styles.journeyTitle, { color: colors.text }]}>Stay Consistent</Text>
            <Text style={[styles.journeyDesc, { color: colors.subtext }]}>
              Track your meals daily to see progress
            </Text>
          </View>
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.actionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/(onboarding)/goals')}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: `${colors.purple}20` }]}>
              <Target size={20} color={colors.purple} strokeWidth={2.5} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Change Goal</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.logoutButton, { backgroundColor: colors.danger }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FFF" strokeWidth={2.5} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <Text style={[styles.version, { color: colors.subtext }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header Gradient
  headerGradient: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 40,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  memberText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Card
  card: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  // BMI
  bmiCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bmiCategoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bmiContent: {
    alignItems: 'center',
    marginBottom: 12,
  },
  bmiValue: {
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 64,
  },
  bmiUnit: {
    fontSize: 14,
    fontWeight: '600',
  },
  bmiNote: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Journey
  journeyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  journeyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyContent: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  journeyDesc: {
    fontSize: 13,
  },

  // Actions
  actionsSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
  },
});
