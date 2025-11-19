import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useUser } from '@/hooks/useUser';
import { deleteFood, getTodayDate, logFood } from '@/services/dailyLogService';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

export default function FoodLogScreen() {
  const { user } = useUser();
  const today = getTodayDate();
  const { dailyLog, refetch, loading } = useDailyLog(user?.uid || null, today);

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  const handleAddFood = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to log food.');
      return;
    }

    if (!foodName.trim() || !calories.trim()) {
      Alert.alert('Missing fields', 'Please enter food name and calories.');
      return;
    }

    const calorieValue = parseInt(calories, 10);
    if (isNaN(calorieValue) || calorieValue <= 0) {
      Alert.alert('Invalid calories', 'Please enter a valid calorie amount.');
      return;
    }

    setSubmitting(true);
    try {
      await logFood(user.uid, today, foodName.trim(), calorieValue);
      setFoodName('');
      setCalories('');
      await refetch();
      Alert.alert('Success', 'Food logged successfully!');
    } catch (error: any) {
      console.error('Error logging food:', error);
      Alert.alert('Error', error.message || 'Failed to log food.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFood = async (timestamp: number) => {
    if (!user) return;

    Alert.alert(
      'Delete Food',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFood(user.uid, today, timestamp);
              await refetch();
              Alert.alert('Success', 'Food item deleted successfully!');
            } catch (error: any) {
              console.error('Error deleting food:', error);
              Alert.alert('Error', error.message || 'Failed to delete food.');
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: colors.textPrimary }]}>
            Food Log
          </ThemedText>
          <ThemedText style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </ThemedText>
        </ThemedView>

        {/* Add Food Form */}
        <ThemedView
          style={[
            styles.addFoodCard,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <ThemedText style={[styles.cardTitle, { color: colors.textPrimary }]}>
            Add Food
          </ThemedText>

          <TextInput
            placeholder="Food name"
            placeholderTextColor={colors.textSecondary}
            value={foodName}
            onChangeText={setFoodName}
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5',
                borderColor: colors.border,
              },
            ]}
          />

          <TextInput
            placeholder="Calories"
            placeholderTextColor={colors.textSecondary}
            value={calories}
            onChangeText={setCalories}
            keyboardType="number-pad"
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5',
                borderColor: colors.border,
              },
            ]}
          />

          <Pressable
            onPress={handleAddFood}
            disabled={submitting}
            style={[
              styles.addButton,
              { backgroundColor: colors.accent },
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <ThemedText style={styles.addButtonText}>Add Food</ThemedText>
            )}
          </Pressable>
        </ThemedView>

        {/* Today's Log */}
        <ThemedView style={styles.logSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Today's Log
          </ThemedText>

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : !dailyLog || dailyLog.items.length === 0 ? (
            <ThemedView
              style={[
                styles.emptyCard,
                { backgroundColor: colors.card, shadowColor: colors.shadow },
              ]}
            >
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                No food logged yet today
              </ThemedText>
            </ThemedView>
          ) : (
            <>
              <ThemedView
                style={[
                  styles.totalCard,
                  { backgroundColor: colors.accent, shadowColor: colors.shadow },
                ]}
              >
                <ThemedText style={styles.totalLabel}>Total Calories</ThemedText>
                <ThemedText style={styles.totalValue}>
                  {dailyLog.items.reduce((sum, item) => sum + (item.calories || 0), 0)} cal
                </ThemedText>
              </ThemedView>

              {dailyLog.items.map((item, index) => (
                <ThemedView
                  key={`${item.timestamp}-${index}`}
                  style={[
                    styles.foodItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.foodInfo}>
                    <ThemedText style={[styles.foodName, { color: colors.textPrimary }]}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={[styles.foodCalories, { color: colors.textSecondary }]}>
                      {item.calories} cal
                    </ThemedText>
                  </View>
                  <Pressable
                    onPress={() => handleDeleteFood(new Date(item.timestamp).getTime())}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color={colors.danger} />
                  </Pressable>
                </ThemedView>
              ))}
            </>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 14,
    marginTop: 4,
  },
  addFoodCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  addButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  centerContent: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyCard: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
  },
  totalCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  totalLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  totalValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
  },
  foodCalories: {
    fontSize: 14,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
});
