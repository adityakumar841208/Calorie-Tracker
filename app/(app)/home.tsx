import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useUser } from '@/hooks/useUser';
import { getTodayDate } from '@/services/dailyLogService';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Minus, TrendingDown, TrendingUp } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
  const { user, profile, loading: userLoading } = useUser();
  const today = getTodayDate();
  const { dailyLog, loading: logLoading } = useDailyLog(user?.uid || null, today);
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#161618' : '#FFFFFF',
    textPrimary: isDark ? '#EAEAEA' : '#111',
    textSecondary: isDark ? '#A3A3A3' : '#666',
    accent: '#007AFF',
    accentGradient: isDark ? ['#005FCC', '#0094FF'] : ['#007AFF', '#33B7FF'],
    divider: isDark ? '#2A2A2C' : '#E8E8E8',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  const loading = userLoading || logLoading;
  const targetCalories = profile?.targetCalories || 2000;
  
  // Calculate consumed calories from daily log items
  const consumed = dailyLog?.items.reduce((sum, item) => sum + (item.calories || 0), 0) || 0;
  const remaining = targetCalories - consumed;

  const getGoalIcon = () => {
    if (!profile) return <Activity size={20} color="#FFF" />;
    switch (profile.goal) {
      case 'lose':
        return <TrendingDown size={20} color="#FFF" />;
      case 'gain':
        return <TrendingUp size={20} color="#FFF" />;
      default:
        return <Minus size={20} color="#FFF" />;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View>
          <ThemedText type="title" style={{ color: colors.textPrimary }}>
            Dashboard
          </ThemedText>
          <ThemedText style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Calorie Summary */}
      <LinearGradient
        colors={colors.accentGradient as unknown as readonly [string, string]}
        style={styles.gradientCard}
      >
        <ThemedView style={styles.gradientContent}>
          <View style={styles.goalBadge}>
            {getGoalIcon()}
            <ThemedText style={styles.goalText}>
              {profile?.goal === 'lose' ? 'Weight Loss' : profile?.goal === 'gain' ? 'Weight Gain' : 'Maintain Weight'}
            </ThemedText>
          </View>

          <View style={styles.calorieCircleContainer}>
            <View style={[styles.calorieCircle, { borderColor: '#FFF' }]}>
              <ThemedText style={[styles.calorieRemaining, { color: '#FFF' }]}>
                {remaining}
              </ThemedText>
              <ThemedText style={{ color: '#FFF', opacity: 0.8 }}>remaining</ThemedText>
            </View>
          </View>

          <View style={styles.calorieStats}>
            <View style={styles.calorieStat}>
              <ThemedText style={[styles.statValue, { color: '#FFF' }]}>
                {consumed}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: '#FFF', opacity: 0.8 }]}>
                consumed
              </ThemedText>
            </View>
            <View style={styles.calorieStat}>
              <ThemedText style={[styles.statValue, { color: '#FFF' }]}>
                {targetCalories}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: '#FFF', opacity: 0.8 }]}>
                daily goal
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </LinearGradient>

      {/* Today's Log */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle" style={{ color: colors.textPrimary }}>
            Today's Meals
          </ThemedText>
          <ThemedText style={{ color: colors.textSecondary, fontSize: 13 }}>
            {dailyLog?.items.length || 0} items
          </ThemedText>
        </View>

        {(!dailyLog || dailyLog.items.length === 0) ? (
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            No meals logged today. Tap "Food Log" to add your first meal!
          </ThemedText>
        ) : (
          <View style={styles.mealsList}>
            {dailyLog.items.slice(0, 5).map((item, index) => (
              <ThemedView
                key={item.id}
                style={[
                  styles.mealItem,
                  { borderBottomColor: colors.divider },
                  index === dailyLog.items.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View>
                  <ThemedText type="defaultSemiBold" style={{ color: colors.textPrimary }}>
                    {item.name}
                  </ThemedText>
                </View>
                <ThemedText style={{ color: colors.textPrimary }}>
                  {item.calories} cal
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        )}
      </ThemedView>
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
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 14,
    marginTop: 4,
  },

  gradientCard: {
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 18,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientContent: {
    padding: 22,
    alignItems: 'center',
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  goalText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },

  calorieCircleContainer: {
    marginVertical: 20,
  },
  calorieCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieRemaining: {
    fontSize: 48,
    fontWeight: '700',
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  calorieStat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '600' },
  statLabel: { fontSize: 13 },

  card: {
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },

  mealsList: { marginTop: 8 },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  waterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 18,
  },
  waterDrop: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  waterText: {
    textAlign: 'center',
    fontSize: 14,
  },
  mealTime: { fontSize: 12 },
  divider: {
    height: 1,
    marginVertical: 10,
    marginHorizontal: 16,
    opacity: 0.6,
  },
});
