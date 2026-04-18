import { foodLogStorage } from '@/utils/foodLogStorage';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface WeekData {
  date: string;
  day: string;
  calories: number;
}

export default function ReportsScreen() {
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  useFocusEffect(
    React.useCallback(() => {
      loadWeekData(currentWeekStart);
    }, [currentWeekStart])
  );

  const formatDateRange = (start: Date): string => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (d: Date) => {
      const month = d.toLocaleString('en-US', { month: 'short' });
      const date = d.getDate();
      return `${month} ${date}`;
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const loadWeekData = async (weekStart: Date) => {
    try {
      const stats = await foodLogStorage.getWeekStats(weekStart);

      const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const data: WeekData[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const calories = stats[dateStr] || 0;
        data.push({
          date: dateStr,
          day: dayAbbr[i],
          calories,
        });
      }

      setWeekData(data);
    } catch {
      Alert.alert('Error', 'Failed to load report data');
    }
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const maxCalories = Math.max(...weekData.map((d) => d.calories), 500);
  const totalCalories = weekData.reduce((sum, d) => sum + d.calories, 0);
  const avgCalories = Math.round(totalCalories / 7);
  const peakDay = weekData.length > 0 ? weekData.reduce((max, curr) =>
    curr.calories > max.calories ? curr : max
  ) : { date: '', day: 'N/A', calories: 0 };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity onPress={previousWeek} style={styles.navButton}>
            <Text style={styles.navButtonText}>Previous week</Text>
          </TouchableOpacity>
          <View style={styles.weekInfo}>
            <Text style={styles.weekDates}>{formatDateRange(currentWeekStart)}</Text>
          </View>
          <TouchableOpacity onPress={nextWeek} style={styles.navButton}>
            <Text style={styles.navButtonText}>Next week</Text>
          </TouchableOpacity>
        </View>

        {/* Chart Title */}
        <Text style={styles.chartTitle}>Calories by day</Text>

        {/* Bar Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {weekData.map((item, index) => {
              const barHeight = maxCalories > 0 ? (item.calories / maxCalories) * 200 : 0;
              return (
                <View key={index} style={styles.barWrapper}>
                  <Text style={styles.barValue}>{item.calories}</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor:
                          item.calories > 0 ? '#FF7043' : '#E8E8E8',
                      },
                    ]}
                  />
                  <Text style={styles.dayLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>WEEK TOTAL</Text>
            <Text style={styles.statValue}>{totalCalories}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DAILY AVERAGE</Text>
            <Text style={styles.statValue}>{avgCalories}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PEAK DAY</Text>
            <Text style={styles.statValue}>{peakDay.day}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  weekNavigation: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  weekInfo: {
    flex: 1.5,
    alignItems: 'center',
  },
  weekDates: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 240,
    paddingBottom: 10,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    marginVertical: 10,
    borderRadius: 4,
  },
  barValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 6,
    minHeight: 16,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});
