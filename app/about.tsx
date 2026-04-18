import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Food Tracker</Text>
          <Text style={styles.description}>
            Food Tracker is a simple and intuitive mobile application designed to help you monitor
            your daily calorie intake. Whether you&apos;re trying to maintain a healthy lifestyle or
            track specific dietary goals, this app makes it easy to log your meals and analyze
            your eating patterns.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Add & Edit Entries:</Text> Easily log meals with
                food name, calorie count, and timestamp
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Daily Tracking:</Text> View your total calories
                consumed today and throughout the week
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Weekly Reports:</Text> Visualize your calorie
                consumption patterns with interactive daily charts
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Quick Stats:</Text> See total entries, today&apos;s
                calories, and weekly totals at a glance
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Full CRUD Support:</Text> Create, read, update,
                and delete entries with confirmation dialogs
              </Text>
            </View>
          </View>
        </View>

        {/* Data Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage</Text>
          <Text style={styles.description}>
            Your food log data is stored locally on your device using AsyncStorage. This means:
          </Text>
          <View style={styles.storageList}>
            <View style={styles.storageItem}>
              <Text style={styles.storageBullet}>✓</Text>
              <Text style={styles.storageText}>
                <Text style={styles.storageBold}>Private & Secure:</Text> Your data never leaves
                your device
              </Text>
            </View>
            <View style={styles.storageItem}>
              <Text style={styles.storageBullet}>✓</Text>
              <Text style={styles.storageText}>
                <Text style={styles.storageBold}>Always Available:</Text> Access your logs
                offline without internet connection
              </Text>
            </View>
            <View style={styles.storageItem}>
              <Text style={styles.storageBullet}>✓</Text>
              <Text style={styles.storageText}>
                <Text style={styles.storageBold}>Persistent:</Text> Your data persists across
                app sessions
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.stepTitle}>1. Log Your Meals</Text>
          <Text style={styles.stepDescription}>
            Go to the Food Log screen and tap &quot;+ Add&quot; to create a new entry. Enter the food name,
            calorie count, and timestamp.
          </Text>

          <Text style={styles.stepTitle}>2. Track Your Progress</Text>
          <Text style={styles.stepDescription}>
            The home screen displays your quick stats: total entries, calories consumed today,
            and this week&apos;s total.
          </Text>

          <Text style={styles.stepTitle}>3. Review Reports</Text>
          <Text style={styles.stepDescription}>
            Check the Reports screen to see your weekly calorie distribution across days. Use the
            navigation buttons to view previous or upcoming weeks.
          </Text>

          <Text style={styles.stepTitle}>4. Manage Entries</Text>
          <Text style={styles.stepDescription}>
            Edit or delete entries from the Food Log screen. Each action is confirmed to prevent
            accidental changes.
          </Text>
        </View>

        {/* Version Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Version</Text>
          <Text style={styles.versionText}>Food Tracker v1.0.0</Text>
          <Text style={styles.versionText}>Built with Expo, React Native & TypeScript</Text>
        </View>

        <View style={styles.footer} />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
  },
  featureBullet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
    marginTop: 2,
  },
  featureText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
    flex: 1,
  },
  featureBold: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  storageList: {
    marginTop: 12,
    gap: 12,
  },
  storageItem: {
    flexDirection: 'row',
    gap: 12,
  },
  storageBullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 2,
  },
  storageText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
    flex: 1,
  },
  storageBold: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
  },
  versionText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 6,
  },
  footer: {
    height: 20,
  },
});
