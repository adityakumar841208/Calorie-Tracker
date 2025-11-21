import { useDailyLog } from '@/hooks/useDailyLog';
import { useUser } from '@/hooks/useUser';
import { getTodayDate } from '@/services/dailyLogService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { Activity, Calendar, Plus, Target, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
  const { user, profile, loading: userLoading } = useUser();
  const today = getTodayDate();
  const { dailyLog, loading: logLoading, refetch } = useDailyLog(user?.uid || null, today);
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  
  const [userWeight, setUserWeight] = useState<number>(0);
  const isFirstRender = useRef(true);

  // Refresh data when screen comes into focus (but not on initial mount)
  useFocusEffect(
    useCallback(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (user?.uid) {
        refetch();
      }
    }, [user?.uid])
  );

  useEffect(() => {
    const loadUserWeight = async () => {
      const weight = await AsyncStorage.getItem('userWeight');
      setUserWeight(parseFloat(weight || '0'));
    };
    loadUserWeight();
  }, []);

  const colors = {
    bg: isDark ? '#0B0F14' : '#F7F9FB',
    card: isDark ? '#1F2937' : '#FFFFFF',
    text: isDark ? '#F8FAFC' : '#0F172A',
    subtext: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  };

  const loading = userLoading || logLoading;
  const targetCalories = profile?.targetCalories || 2000;
  
  // Calculate consumed calories from daily log items
  const consumed = dailyLog?.items.reduce((sum, item) => sum + (item.calories || 0), 0) || 0;
  const remaining = targetCalories - consumed;
  const percentConsumed = Math.min((consumed / targetCalories) * 100, 100);

  // Format today's date
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGoalConfig = () => {
    if (!profile) {
      return {
        icon: Target,
        text: 'Set Your Goal',
        color: '#06B6D4',
        gradient: ['#06B6D4', '#0284C7']
      };
    }
    switch (profile.goal) {
      case 'lose':
        return {
          icon: TrendingDown,
          text: 'Weight Loss',
          color: '#10B981',
          gradient: ['#10B981', '#059669']
        };
      case 'gain':
        return {
          icon: TrendingUp,
          text: 'Weight Gain',
          color: '#F59E0B',
          gradient: ['#F59E0B', '#D97706']
        };
      default:
        return {
          icon: Target,
          text: 'Maintain Weight',
          color: '#06B6D4',
          gradient: ['#06B6D4', '#0284C7']
        };
    }
  };

  const goalConfig = getGoalConfig();
  const GoalIcon = goalConfig.icon;

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color="#5B21B6" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={isDark ? ['#0B0F14', '#1a1f2e', '#0B0F14'] : ['#F7F9FB', '#E0E7FF', '#F7F9FB']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header with Date */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hello, {user?.email?.split('@')[0] || 'there'}!
            </Text>
            <View style={styles.dateRow}>
              <Calendar size={14} color={colors.subtext} />
              <Text style={[styles.dateText, { color: colors.subtext }]}>
                {formatDate()}
              </Text>
            </View>
          </View>
        </View>

        {/* Calorie Progress Card */}
        <LinearGradient
          colors={goalConfig.gradient as unknown as readonly [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.goalBadge}>
            <GoalIcon size={16} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.goalText}>{goalConfig.text}</Text>
          </View>

          <View style={styles.calorieMain}>
            <Text style={styles.calorieNumber}>{remaining}</Text>
            <Text style={styles.calorieLabel}>calories remaining</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${percentConsumed}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(percentConsumed)}% of daily goal</Text>
          </View>

          <View style={styles.calorieStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{consumed}</Text>
              <Text style={styles.statLabel}>Consumed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{targetCalories}</Text>
              <Text style={styles.statLabel}>Target</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userWeight > 0 ? `${userWeight}kg` : '--'}</Text>
              <Text style={styles.statLabel}>Weight</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/(app)/food-log')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#5B21B620' }]}>
              <Plus size={20} color="#5B21B6" strokeWidth={2.5} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Add Meal</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/(app)/analytics')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#06B6D420' }]}>
              <Activity size={20} color="#06B6D4" strokeWidth={2.5} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Analytics</Text>
          </Pressable>
        </View>

        {/* Today's Meals */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Today&apos;s Meals</Text>
            <Text style={[styles.cardSubtitle, { color: colors.subtext }]}>
              {dailyLog?.items.length || 0} items
            </Text>
          </View>

          {(!dailyLog || dailyLog.items.length === 0) ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                No meals logged yet today.
              </Text>
              <Pressable 
                style={styles.emptyButton}
                onPress={() => router.push('/(app)/food-log')}
              >
                <Text style={styles.emptyButtonText}>Add Your First Meal</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.mealsList}>
              {dailyLog.items.slice(0, 5).map((item, index) => (
                <View
                  key={`${item.timestamp}-${index}`}
                  style={[
                    styles.mealItem,
                    { borderBottomColor: colors.border },
                    index === Math.min(dailyLog.items.length, 5) - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.mealInfo}>
                    <Text style={[styles.mealName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.mealTime, { color: colors.subtext }]}>
                      {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </Text>
                  </View>
                  <Text style={[styles.mealCalories, { color: goalConfig.color }]}>
                    {item.calories} cal
                  </Text>
                </View>
              ))}
              {dailyLog.items.length > 5 && (
                <Pressable 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/(app)/food-log')}
                >
                  <Text style={[styles.viewAllText, { color: '#5B21B6' }]}>
                    View all {dailyLog.items.length} meals →
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },

  // Header
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
  },

  // Progress Card
  progressCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  goalText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  calorieMain: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 64,
  },
  calorieLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },

  // Progress Bar
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Stats
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Card
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#5B21B6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Meals List
  mealsList: {
    gap: 4,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  mealTime: {
    fontSize: 12,
  },
  mealCalories: {
    fontSize: 15,
    fontWeight: '800',
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
