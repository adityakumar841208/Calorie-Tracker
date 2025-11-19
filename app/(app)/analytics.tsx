import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUser } from '@/hooks/useUser';
import { AnalyticsData, getWeeklyAnalytics } from '@/services/analyticsService';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = Math.max((SCREEN_WIDTH - 80) / 7 - 4, 30); // Minimum 30px width

export default function AnalyticsScreen() {
  const { user, profile } = useUser();
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '#2C2C2E' : '#E5E5E7',
    textPrimary: isDark ? '#F3F3F3' : '#111',
    textSecondary: isDark ? '#A5A5A7' : '#666',
    accent: '#007AFF',
    warn: '#FF3B30',
    success: '#34C759',
    orange: '#FF9500',
    purple: '#AF52DE',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  useEffect(() => {
    loadAnalytics();
  }, [user, selectedDate, viewMode]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getWeeklyAnalytics(user.uid, selectedDate);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDateRange = () => {
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 6);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (loading || !analytics) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const maxCalories = Math.max(...analytics.weeklyData.map((d) => d.calories), 1);
  const targetCalories = profile?.targetCalories || 2000;
  
  // Calculate macro percentages
  const totalMacros = analytics.averageProtein + analytics.averageCarbs + analytics.averageFat || 1;
  const proteinPercent = Math.round((analytics.averageProtein / totalMacros) * 100);
  const carbsPercent = Math.round((analytics.averageCarbs / totalMacros) * 100);
  const fatPercent = Math.round((analytics.averageFat / totalMacros) * 100);

  const isOnTrack = analytics.weeklyAverage <= targetCalories;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Header with Date Navigation */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Analytics
        </ThemedText>
        
        <View style={styles.dateNav}>
          <Pressable onPress={goToPreviousWeek} style={[styles.navButton, { backgroundColor: colors.card }]}>
            <ChevronLeft size={20} color={colors.textPrimary} />
          </Pressable>
          
          <Pressable onPress={goToToday} style={[styles.dateButton, { backgroundColor: colors.card }]}>
            <Calendar size={16} color={colors.accent} />
            <ThemedText style={[styles.dateText, { color: colors.textPrimary }]}>
              {formatDateRange()}
            </ThemedText>
          </Pressable>
          
          <Pressable 
            onPress={goToNextWeek} 
            style={[styles.navButton, { backgroundColor: colors.card }]}
            disabled={selectedDate >= new Date()}
          >
            <ChevronRight 
              size={20} 
              color={selectedDate >= new Date() ? colors.textSecondary : colors.textPrimary} 
            />
          </Pressable>
        </View>
      </ThemedView>

      {/* Summary Card */}
      <LinearGradient
        colors={isOnTrack ? ['#34C759', '#30D158'] : ['#FF9500', '#FF6B00']}
        style={styles.summaryCard}
      >
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <View>
              <ThemedText style={styles.summaryLabel}>Weekly Average</ThemedText>
              <ThemedText style={styles.summaryValue}>{analytics.weeklyAverage}</ThemedText>
              <ThemedText style={styles.summaryUnit}>calories/day</ThemedText>
            </View>
            {isOnTrack ? (
              <TrendingDown size={40} color="#FFF" />
            ) : (
              <TrendingUp size={40} color="#FFF" />
            )}
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <ThemedText style={styles.summaryStatValue}>{analytics.totalCalories}</ThemedText>
              <ThemedText style={styles.summaryStatLabel}>Total This Week</ThemedText>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStat}>
              <ThemedText style={styles.summaryStatValue}>{analytics.streakDays}</ThemedText>
              <ThemedText style={styles.summaryStatLabel}>Day Streak</ThemedText>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStat}>
              <ThemedText style={styles.summaryStatValue}>
                {Math.round((analytics.weeklyAverage / targetCalories) * 100)}%
              </ThemedText>
              <ThemedText style={styles.summaryStatLabel}>Of Target</ThemedText>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Weekly Progress Bar Chart */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle" style={{ color: colors.textPrimary }}>
            Daily Calories
          </ThemedText>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <ThemedText style={[styles.legendText, { color: colors.textSecondary }]}>
                On Track
              </ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.warn }]} />
              <ThemedText style={[styles.legendText, { color: colors.textSecondary }]}>
                Over
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.chart}>
          {analytics.weeklyData.map((day) => {
            const isOver = day.calories > targetCalories;
            const barHeight = (day.calories / maxCalories) * 150;
            
            return (
              <View key={day.date} style={styles.barContainer}>
                <ThemedText style={[styles.barValue, { color: colors.textSecondary }]}>
                  {day.calories > 0 ? day.calories : ''}
                </ThemedText>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, 3),
                      backgroundColor: day.calories === 0 
                        ? colors.border 
                        : isOver 
                          ? colors.warn 
                          : colors.success,
                      opacity: day.calories === 0 ? 0.3 : 1,
                    },
                  ]}
                />
                <ThemedText style={[styles.barLabel, { color: colors.textSecondary }]}>
                  {getDayLabel(day.date)}
                </ThemedText>
              </View>
            );
          })}
        </View>
        
        {/* Target Line */}
        <View style={styles.targetLineContainer}>
          <View style={[styles.targetLine, { borderColor: colors.accent }]} />
          <ThemedText style={[styles.targetLabel, { color: colors.accent }]}>
            Target: {targetCalories}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Macro Breakdown */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <ThemedText type="subtitle" style={{ color: colors.textPrimary, marginBottom: 20 }}>
          Average Macros
        </ThemedText>

        <View style={styles.macroContainer}>
          {[
            { 
              label: 'Carbs', 
              color: colors.accent, 
              value: analytics.averageCarbs,
              percent: carbsPercent,
              icon: '🍞',
              info: '4 cal/g'
            },
            { 
              label: 'Protein', 
              color: colors.success, 
              value: analytics.averageProtein,
              percent: proteinPercent,
              icon: '🥩',
              info: '4 cal/g'
            },
            { 
              label: 'Fat', 
              color: colors.orange, 
              value: analytics.averageFat,
              percent: fatPercent,
              icon: '🥑',
              info: '9 cal/g'
            },
          ].map((m) => (
            <View key={m.label} style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: m.color }]}>
                <ThemedText style={styles.macroIcon}>{m.icon}</ThemedText>
                <ThemedText style={styles.macroPercentage}>{m.percent}%</ThemedText>
              </View>
              <ThemedText style={[styles.macroLabel, { color: colors.textPrimary }]}>
                {m.label}
              </ThemedText>
              <ThemedText style={[styles.macroValue, { color: colors.textSecondary }]}>
                {m.value}g · {m.info}
              </ThemedText>
            </View>
          ))}
        </View>
        
        {/* Macro Info */}
        <View style={[styles.infoBox, { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F7' }]}>
          <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
            💡 Macronutrients provide energy: Carbs and Protein have 4 calories per gram, while Fat has 9 calories per gram.
          </ThemedText>
        </View>
      </ThemedView>

      {/* Nutrition Info Card */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <ThemedText type="subtitle" style={{ color: colors.textPrimary, marginBottom: 16 }}>
          What Are Calories?
        </ThemedText>
        
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={[styles.infoIconCircle, { backgroundColor: colors.accent + '20' }]}>
              <ThemedText style={styles.infoEmoji}>⚡</ThemedText>
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoTitle, { color: colors.textPrimary }]}>
                Energy Unit
              </ThemedText>
              <ThemedText style={[styles.infoDesc, { color: colors.textSecondary }]}>
                Calories measure the energy your body gets from food
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={[styles.infoIconCircle, { backgroundColor: colors.success + '20' }]}>
              <ThemedText style={styles.infoEmoji}>🎯</ThemedText>
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoTitle, { color: colors.textPrimary }]}>
                Balance is Key
              </ThemedText>
              <ThemedText style={[styles.infoDesc, { color: colors.textSecondary }]}>
                Consume fewer calories to lose weight, more to gain, equal to maintain
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={[styles.infoIconCircle, { backgroundColor: colors.orange + '20' }]}>
              <ThemedText style={styles.infoEmoji}>🍎</ThemedText>
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoTitle, { color: colors.textPrimary }]}>
                Quality Matters
              </ThemedText>
              <ThemedText style={[styles.infoDesc, { color: colors.textSecondary }]}>
                Not all calories are equal - focus on nutrient-dense whole foods
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      {/* Streak Card */}
      {analytics.streakDays > 0 && (
        <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <View style={styles.streakContainer}>
            <IconSymbol name="flame.fill" size={56} color={colors.warn} />
            <View style={styles.streakInfo}>
              <ThemedText type="title" style={{ color: colors.textPrimary, fontSize: 32 }}>
                {analytics.streakDays} {analytics.streakDays === 1 ? 'Day' : 'Days'}
              </ThemedText>
              <ThemedText style={[styles.streakLabel, { color: colors.textSecondary }]}>
                Current tracking streak! Keep it up! 🎉
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      )}
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
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  summaryContent: {
    padding: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '700',
    marginVertical: 4,
  },
  summaryUnit: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#FFF',
    opacity: 0.3,
    marginVertical: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStatValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },
  summaryStatLabel: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  summaryStatDivider: {
    width: 1,
    backgroundColor: '#FFF',
    opacity: 0.3,
  },
  
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
  },
  
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    paddingTop: 10,
  },
  barContainer: {
    alignItems: 'center',
    width: BAR_WIDTH + 6,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: 8,
    minHeight: 3,
  },
  barValue: {
    fontSize: 10,
    marginBottom: 4,
    fontWeight: '600',
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  targetLineContainer: {
    position: 'relative',
    marginTop: -90,
    alignItems: 'flex-end',
  },
  targetLine: {
    width: '100%',
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
  targetLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  macroPercentage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  macroLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 12,
  },
  
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  
  infoSection: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    gap: 14,
  },
  infoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 15,
    marginTop: 4,
  },
});
