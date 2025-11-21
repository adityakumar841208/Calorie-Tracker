import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useUser } from '@/hooks/useUser';
import { deleteFood, getTodayDate, logFood } from '@/services/dailyLogService';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Flame, Plus, Trash2, Utensils } from 'lucide-react-native';
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
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0B0B0C' : '#F8F9FB',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    border: isDark ? '#2C2C2E' : '#E5E5E7',
    textPrimary: isDark ? '#F3F3F3' : '#111',
    textSecondary: isDark ? '#A5A5A7' : '#666',
    purple: '#5B21B6',
    danger: '#FF3B30',
    shadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.08)',
  };

  const handleAddFood = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to log food.');
      return;
    }

    if (!foodName.trim() || !calories.trim() || !protein.trim() || !carbs.trim() || !fat.trim()) {
      Alert.alert('Missing fields', 'Please enter all nutrition information.');
      return;
    }

    const calorieValue = parseInt(calories, 10);
    const proteinValue = parseInt(protein, 10);
    const carbsValue = parseInt(carbs, 10);
    const fatValue = parseInt(fat, 10);
    const quantityValue = parseInt(quantity, 10);

    if (isNaN(calorieValue) || calorieValue <= 0 ||
        isNaN(proteinValue) || proteinValue < 0 ||
        isNaN(carbsValue) || carbsValue < 0 ||
        isNaN(fatValue) || fatValue < 0 ||
        isNaN(quantityValue) || quantityValue <= 0) {
      Alert.alert('Invalid input', 'Please enter valid numbers for all fields.');
      return;
    }

    setSubmitting(true);
    try {
      await logFood(user.uid, today, foodName.trim(), calorieValue, proteinValue, carbsValue, fatValue, quantityValue);
      setFoodName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      setQuantity('1');
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

  const totalNutrition = dailyLog?.items.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fat: acc.fat + (item.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: colors.textPrimary }]}>
            Food Log
          </ThemedText>
          <ThemedText style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </ThemedText>
        </View>

        {/* Dummy Image Upload Section */}
        <Pressable 
          style={[styles.uploadCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Coming Soon', 'AI food detection will be available soon!')}
        >
          <View style={[styles.uploadIconContainer, { backgroundColor: `${colors.purple}15` }]}>
            <Camera size={28} color={colors.purple} />
          </View>
          <View style={styles.uploadTextContainer}>
            <ThemedText style={[styles.uploadTitle, { color: colors.textPrimary }]}>
              Scan Food (Coming Soon)
            </ThemedText>
            <ThemedText style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
              AI-powered nutrition detection
            </ThemedText>
          </View>
        </Pressable>

        {/* Manual Entry Form */}
        <View style={[styles.formCard, { backgroundColor: colors.card }]}>
          <View style={styles.formHeader}>
            <Utensils size={22} color={colors.purple} />
            <ThemedText style={[styles.formTitle, { color: colors.textPrimary }]}>
              Manual Entry
            </ThemedText>
          </View>

          <TextInput
            placeholder="Food name (e.g., Soya cwunks)"
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

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Quantity
              </ThemedText>
              <TextInput
                placeholder="1"
                placeholderTextColor={colors.textSecondary}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
                style={[
                  styles.inputSmall,
                  {
                    color: colors.textPrimary,
                    backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5',
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>
            <View style={styles.inputHalf}>
              <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Calories
              </ThemedText>
              <TextInput
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                value={calories}
                onChangeText={setCalories}
                keyboardType="number-pad"
                style={[
                  styles.inputSmall,
                  {
                    color: colors.textPrimary,
                    backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5',
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputThird}>
              <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Protein (g)
              </ThemedText>
              <TextInput
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                value={protein}
                onChangeText={setProtein}
                keyboardType="number-pad"
                style={[
                  styles.inputSmall,
                  {
                    color: colors.textPrimary,
                    backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5',
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>
            <View style={styles.inputThird}>
              <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Carbs (g)
              </ThemedText>
              <TextInput
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="number-pad"
                style={[
                  styles.inputSmall,
                  {
                    color: colors.textPrimary,
                    backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5',
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>
            <View style={styles.inputThird}>
              <ThemedText style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Fat (g)
              </ThemedText>
              <TextInput
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                value={fat}
                onChangeText={setFat}
                keyboardType="number-pad"
                style={[
                  styles.inputSmall,
                  {
                    color: colors.textPrimary,
                    backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5',
                    borderColor: colors.border,
                  },
                ]}
              />
            </View>
          </View>

          <Pressable
            onPress={handleAddFood}
            disabled={submitting}
            style={[
              styles.addButton,
              { backgroundColor: colors.purple },
              submitting && { opacity: 0.6 },
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Plus size={20} color="#FFF" />
                <ThemedText style={styles.addButtonText}>Add Food</ThemedText>
              </>
            )}
          </Pressable>
        </View>

        {/* Today's Summary */}
        {!loading && dailyLog && dailyLog.items.length > 0 && (
          <LinearGradient
            colors={['#5B21B6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.summaryHeader}>
              <Flame size={20} color="#FFF" />
              <ThemedText style={styles.summaryTitle}>Today&apos;s Nutrition</ThemedText>
            </View>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <ThemedText style={styles.nutritionValue}>{totalNutrition.calories}</ThemedText>
                <ThemedText style={styles.nutritionLabel}>Calories</ThemedText>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionItem}>
                <ThemedText style={styles.nutritionValue}>{totalNutrition.protein}g</ThemedText>
                <ThemedText style={styles.nutritionLabel}>Protein</ThemedText>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionItem}>
                <ThemedText style={styles.nutritionValue}>{totalNutrition.carbs}g</ThemedText>
                <ThemedText style={styles.nutritionLabel}>Carbs</ThemedText>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionItem}>
                <ThemedText style={styles.nutritionValue}>{totalNutrition.fat}g</ThemedText>
                <ThemedText style={styles.nutritionLabel}>Fat</ThemedText>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Today's Log */}
        <View style={styles.logSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Food Items ({dailyLog?.items.length || 0})
          </ThemedText>

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.purple} />
            </View>
          ) : !dailyLog || dailyLog.items.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                No food logged yet today
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Add your first meal to get started!
              </ThemedText>
            </View>
          ) : (
            dailyLog.items.map((item, index) => (
              <View
                key={`${item.timestamp}-${index}`}
                style={[
                  styles.foodItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.foodMain}>
                  <View style={styles.foodHeader}>
                    <ThemedText style={[styles.foodName, { color: colors.textPrimary }]}>
                      {item.name}
                    </ThemedText>
                    <Pressable
                      onPress={() => handleDeleteFood(new Date(item.timestamp).getTime())}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={18} color={colors.danger} />
                    </Pressable>
                  </View>
                  <ThemedText style={[styles.foodQuantity, { color: colors.textSecondary }]}>
                    Quantity: {item.quantity}
                  </ThemedText>
                  <View style={styles.foodNutrition}>
                    <View style={styles.nutritionTag}>
                      <ThemedText style={[styles.nutritionTagText, { color: colors.purple }]}>
                        {item.calories} cal
                      </ThemedText>
                    </View>
                    <View style={styles.nutritionTag}>
                      <ThemedText style={[styles.nutritionTagText, { color: colors.textSecondary }]}>
                        P: {item.protein}g
                      </ThemedText>
                    </View>
                    <View style={styles.nutritionTag}>
                      <ThemedText style={[styles.nutritionTagText, { color: colors.textSecondary }]}>
                        C: {item.carbs}g
                      </ThemedText>
                    </View>
                    <View style={styles.nutritionTag}>
                      <ThemedText style={[styles.nutritionTagText, { color: colors.textSecondary }]}>
                        F: {item.fat}g
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
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
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
  },

  // Upload Card
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 13,
  },

  // Form Card
  formCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputThird: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputSmall: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  addButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Summary Card
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  nutritionLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  nutritionDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Log Section
  logSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  centerContent: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyCard: {
    padding: 32,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
  },

  // Food Item
  foodItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  foodMain: {
    flex: 1,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  foodQuantity: {
    fontSize: 13,
    marginBottom: 10,
  },
  foodNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nutritionTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(91, 33, 182, 0.08)',
  },
  nutritionTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
});
