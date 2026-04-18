import { foodLogStorage } from '@/utils/foodLogStorage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HomeScreen() {
  const [totalEntries, setTotalEntries] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [weekCalories, setWeekCalories] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    const logs = await foodLogStorage.getAllLogs();
    setTotalEntries(logs.length);

    const todayStats = await foodLogStorage.getTodayStats();
    setTodayCalories(todayStats.total);

    const weekStats = await foodLogStorage.getWeekStats();
    const weekTotal = Object.values(weekStats).reduce((sum, val) => sum + val, 0);
    setWeekCalories(weekTotal);
  };

  const navigateToFoodLog = () => router.push('/food-log');
  const navigateToReports = () => router.push('/reports');
  const navigateToAbout = () => router.push('/about');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Food Tracker</Text>
          <Text style={styles.subtitle}>Track your daily calorie intake</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ENTRIES</Text>
            <Text style={styles.statValue}>{totalEntries}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TODAY</Text>
            <Text style={styles.statValue}>{todayCalories}</Text>
            <Text style={styles.statUnit}>cal</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>THIS WEEK</Text>
            <Text style={styles.statValue}>{weekCalories}</Text>
            <Text style={styles.statUnit}>cal</Text>
          </View>
        </View>

        {/* Navigation Cards */}
        <View style={styles.cardsContainer}>
          {/* Food Log Card */}
          <TouchableOpacity
            style={[styles.card, styles.cardFoodLog]}
            onPress={navigateToFoodLog}>
            <Text style={styles.cardTitle}>Food Log</Text>
            <Text style={styles.cardDescription}>
              Create, update, and delete meals with calorie and timestamp details.
            </Text>
            <Text style={styles.cardAction}>Open →</Text>
          </TouchableOpacity>

          {/* Reports Card */}
          <TouchableOpacity
            style={[styles.card, styles.cardReports]}
            onPress={navigateToReports}>
            <Text style={styles.cardTitle}>Reports</Text>
            <Text style={styles.cardDescription}>
              Review weekly calorie totals with a day-by-day chart.
            </Text>
            <Text style={styles.cardAction}>Open →</Text>
          </TouchableOpacity>

          {/* About Card */}
          <TouchableOpacity
            style={[styles.card, styles.cardAbout]}
            onPress={navigateToAbout}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.cardDescription}>
              Read a quick explanation of what the app does and how data is stored.
            </Text>
            <Text style={styles.cardAction}>Open →</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statUnit: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  cardsContainer: {
    paddingBottom: 24,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  cardFoodLog: {
    backgroundColor: '#f0f8ff',
    borderLeftColor: '#2196F3',
  },
  cardReports: {
    backgroundColor: '#fff8f0',
    borderLeftColor: '#FF9500',
  },
  cardAbout: {
    backgroundColor: '#f0f8f5',
    borderLeftColor: '#4CAF50',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardAction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B35',
  },
});
