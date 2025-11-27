import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUser } from '@/hooks/useUser';
import { AnalyticsData, getWeeklyAnalytics } from '@/services/analyticsService';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { Calendar, ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = Math.max((SCREEN_WIDTH - 80) / 7 - 4, 30); // Minimum 30px width

export default function AnalyticsScreen() {
  const { user, profile } = useUser();
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const { height } = useWindowDimensions();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const isFirstRender = useRef(true);

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
    cyan: '#06B6D4',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  useEffect(() => {
    loadAnalytics();
  }, [user, selectedDate, viewMode]);

  // Refresh data when screen comes into focus (but not on initial mount)
  useFocusEffect(
    useCallback(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (user) {
        loadAnalytics();
      }
    }, [user])
  );

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
        <ActivityIndicator size="large" color="#5B21B6" />
      </View>
    );
  }

  const maxCalories = Math.max(...analytics.weeklyData.map((d) => d.calories), 1);
  const targetCalories = profile?.targetCalories || 2000;
  
  // Calculate responsive max for chart (add 20% padding above highest value or target)
  const chartMax = Math.max(maxCalories, targetCalories) * 1.2;
  const CHART_HEIGHT = 160; // Reduced from 180 for better fit
  
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
      <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
        
        <View style={styles.dateNav}>
          <Pressable onPress={goToPreviousWeek} style={[styles.navButton, { backgroundColor: colors.card }]}>
            <ChevronLeft size={20} color={colors.text} />
          </Pressable>
          
          <Pressable onPress={goToToday} style={[styles.dateButton, { backgroundColor: colors.card }]}>
            <Calendar size={16} color={colors.purple} />
            <ThemedText style={[styles.dateText, { color: colors.text }]}>
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
              color={selectedDate >= new Date() ? colors.subtext : colors.text} 
            />
          </Pressable>
        </View>
      </ThemedView>

      {/* Summary Card */}
      <LinearGradient
        colors={isOnTrack ? ['#10B981', '#059669'] : ['#F59E0B', '#D97706']}
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
          <ThemedText type="subtitle" style={{ color: colors.text }}>
            Daily Calories
          </ThemedText>
        </View>

        <View style={styles.chartWrapper}>
          <View style={[styles.chart, { height: CHART_HEIGHT + 40 }]}>
            {analytics.weeklyData.map((day, index) => {
              const isOver = day.calories > targetCalories;
              const isToday = index === analytics.weeklyData.length - 1;
              const normalizedHeight = chartMax > 0 ? (day.calories / chartMax) : 0;
              const barHeight = Math.max(normalizedHeight * CHART_HEIGHT, 4);
              
              return (
                <View key={day.date} style={styles.barContainer}>
                  <View style={[styles.barWrapper, { height: CHART_HEIGHT }]}>
                    <LinearGradient
                      colors={day.calories === 0 
                        ? [colors.border, colors.border] 
                        : isOver 
                          ? ['#EF4444', '#DC2626'] 
                          : ['#10B981', '#059669']}
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          opacity: day.calories === 0 ? 0.3 : 1,
                          borderWidth: isToday ? 2 : 0,
                          borderColor: colors.purple,
                        },
                      ]}
                    >
                      {day.calories > 0 && barHeight > 30 && (
                        <ThemedText style={styles.barInnerValue}>
                          {day.calories}
                        </ThemedText>
                      )}
                    </LinearGradient>
                  </View>
                  <ThemedText style={[styles.barLabel, { 
                    color: isToday ? colors.purple : colors.subtext,
                    fontWeight: isToday ? '700' : '500'
                  }]}>
                    {getDayLabel(day.date)}
                  </ThemedText>
                </View>
              );
            })}
          </View>
          
          {/* Target Line with better positioning */}
          <View style={[styles.targetLineContainer, { 
            bottom: (targetCalories / chartMax) * CHART_HEIGHT + 40 
          }]}>
            <View style={[styles.targetLine, { borderColor: colors.purple }]} />
            <View style={[styles.targetBadge, { backgroundColor: colors.purple }]}>
              <ThemedText style={styles.targetBadgeText}>
                Target {targetCalories}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Legend at bottom */}
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <ThemedText style={[styles.legendText, { color: colors.subtext }]}>
              On Track
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <ThemedText style={[styles.legendText, { color: colors.subtext }]}>
              Over Target
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.purple, borderWidth: 2, borderColor: colors.purple }]} />
            <ThemedText style={[styles.legendText, { color: colors.subtext }]}>
              Today
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Macro Breakdown */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <ThemedText type="subtitle" style={{ color: colors.text, marginBottom: 20 }}>
          Average Macros
        </ThemedText>

        <View style={styles.macroContainer}>
          {[
            { 
              label: 'Carbs', 
              color: colors.purple, 
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
              color: colors.warning, 
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
              <ThemedText style={[styles.macroLabel, { color: colors.text }]}>
                {m.label}
              </ThemedText>
              <ThemedText style={[styles.macroValue, { color: colors.subtext }]}>
                {m.value}g · {m.info}
              </ThemedText>
            </View>
          ))}
        </View>
        
        {/* Macro Info */}
        <View style={[styles.infoBox, { backgroundColor: isDark ? '#1F2937' : '#E0E7FF' }]}>
          <ThemedText style={[styles.infoText, { color: colors.subtext }]}>
            💡 Macronutrients provide energy: Carbs and Protein have 4 calories per gram, while Fat has 9 calories per gram.
          </ThemedText>
        </View>
      </ThemedView>

      {/* Nutrition Info Card */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <ThemedText type="subtitle" style={{ color: colors.text, marginBottom: 16 }}>
          What Are Calories?
        </ThemedText>
        
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={[styles.infoIconCircle, { backgroundColor: colors.purple + '20' }]}>
              <ThemedText style={styles.infoEmoji}>⚡</ThemedText>
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoTitle, { color: colors.text }]}>
                Energy Unit
              </ThemedText>
              <ThemedText style={[styles.infoDesc, { color: colors.subtext }]}>
                Calories measure the energy your body gets from food
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={[styles.infoIconCircle, { backgroundColor: colors.success + '20' }]}>
              <ThemedText style={styles.infoEmoji}>🎯</ThemedText>
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoTitle, { color: colors.text }]}>
                Balance is Key
              </ThemedText>
              <ThemedText style={[styles.infoDesc, { color: colors.subtext }]}>
                Consume fewer calories to lose weight, more to gain, equal to maintain
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={[styles.infoIconCircle, { backgroundColor: colors.warning + '20' }]}>
              <ThemedText style={styles.infoEmoji}>🍎</ThemedText>
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoTitle, { color: colors.text }]}>
                Quality Matters
              </ThemedText>
              <ThemedText style={[styles.infoDesc, { color: colors.subtext }]}>
                Not all calories are equal - focus on nutrient-dense whole foods
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      {/* Streak Card - LeetCode Style */}
      <LinearGradient
        colors={analytics.streakDays > 0 ? ['#F59E0B', '#D97706'] : [colors.card, colors.card]}
        style={[styles.streakCard, { marginHorizontal: 16, marginVertical: 12 }]}
      >
        <View style={styles.streakHeader}>
          <View style={styles.streakTitleRow}>
            <IconSymbol name="flame.fill" size={32} color="#FFF" />
            <View>
              <ThemedText style={styles.streakTitle}>Daily Streak</ThemedText>
              <ThemedText style={styles.streakSubtitle}>
                {analytics.streakDays > 0 
                  ? "You're on fire! Keep going! 🔥" 
                  : "Start your journey today!"}
              </ThemedText>
            </View>
          </View>
          <View style={styles.streakBadge}>
            <ThemedText style={styles.streakNumber}>{analytics.streakDays}</ThemedText>
            <ThemedText style={styles.streakDaysText}>days</ThemedText>
          </View>
        </View>

        {/* Weekly Grid Visualization */}
        <View style={styles.streakGrid}>
          {analytics.weeklyData.slice().reverse().map((day, index) => {
            const hasData = day.calories > 0;
            const intensity = hasData ? Math.min((day.calories / targetCalories), 1) : 0;
            
            return (
              <View key={day.date} style={styles.streakGridItem}>
                <View
                  style={[
                    styles.streakBox,
                    {
                      backgroundColor: hasData 
                        ? `rgba(16, 185, 129, ${0.3 + intensity * 0.7})`
                        : 'rgba(255, 255, 255, 0.2)',
                      borderWidth: hasData ? 0 : 1,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  ]}
                >
                  {hasData && <ThemedText style={styles.streakCheckmark}>✓</ThemedText>}
                </View>
                <ThemedText style={styles.streakBoxLabel}>
                  {getDayLabel(day.date).substring(0, 1)}
                </ThemedText>
              </View>
            );
          })}
        </View>

        {/* Motivational Message */}
        {analytics.streakDays >= 7 && (
          <View style={styles.streakAchievement}>
            <ThemedText style={styles.achievementText}>
              🎉 Amazing! {analytics.streakDays} days of consistency!
            </ThemedText>
          </View>
        )}
        {analytics.streakDays >= 30 && (
          <View style={styles.streakAchievement}>
            <ThemedText style={styles.achievementText}>
              🏆 Legendary! You've built a habit!
            </ThemedText>
          </View>
        )}
        {analytics.streakDays === 0 && (
          <View style={[styles.streakAchievement, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <ThemedText style={styles.achievementText}>
              💪 Start today and build momentum!
            </ThemedText>
          </View>
        )}
      </LinearGradient>
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
  
  chartWrapper: {
    position: 'relative',
    paddingVertical: 16,
    minHeight: 220,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '85%',
    maxWidth: 45,
    minWidth: 28,
    borderRadius: 10,
    minHeight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  barInnerValue: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  barLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '500',
  },
  targetLineContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  targetLine: {
    flex: 1,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
  },
  targetBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  targetBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
  
  streakCard: {
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  streakTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  streakSubtitle: {
    color: '#FFF',
    fontSize: 13,
    opacity: 0.9,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  streakNumber: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
  },
  streakDaysText: {
    color: '#FFF',
    fontSize: 11,
    opacity: 0.9,
    fontWeight: '600',
  },
  streakGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 16,
  },
  streakGridItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  streakCheckmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  streakBoxLabel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.8,
  },
  streakAchievement: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  achievementText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
  }
});
