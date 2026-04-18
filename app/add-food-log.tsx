import { foodLogStorage } from '@/utils/foodLogStorage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddEditFoodLogScreen() {
  const params = useLocalSearchParams();
  const isEditMode = !!params.id;
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(false);

  const loadFoodLog = useCallback(async (id: string) => {
    try {
      const log = await foodLogStorage.getLogById(id);
      if (log) {
        setFoodName(log.name);
        setCalories(log.calories.toString());
        setTimestamp(formatDateTimeForInput(new Date(log.timestamp)));
      }
    } catch {
      Alert.alert('Error', 'Failed to load food log');
    }
  }, []);

  useEffect(() => {
    if (params.id) {
      loadFoodLog(params.id as string);
    } else {
      // Set current date and time
      const now = new Date();
      setTimestamp(formatDateTimeForInput(now));
    }
  }, [loadFoodLog, params.id]);

  const formatDateTimeForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const parseDateTime = (dateTimeStr: string): Date => {
    try {
      // Format: YYYY-MM-DD HH:mm
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hours, minutes] = timePart.split(':');

      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
      return date;
    } catch {
      return new Date();
    }
  };

  const handleSuccess = (message: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.alert(message);
      }
      router.replace('/food-log');
      return;
    }

    Alert.alert('Success', message, [
      {
        text: 'OK',
        onPress: () => router.replace('/food-log'),
      },
    ]);
  };

  const handleSave = async () => {
    if (!foodName.trim()) {
      Alert.alert('Validation', 'Please enter food name');
      return;
    }

    if (!calories.trim()) {
      Alert.alert('Validation', 'Please enter calories');
      return;
    }

    const caloriesNum = parseInt(calories);
    if (isNaN(caloriesNum) || caloriesNum < 0) {
      Alert.alert('Validation', 'Please enter a valid calorie number');
      return;
    }

    setLoading(true);
    try {
      const dateObj = parseDateTime(timestamp);
      const isoTimestamp = dateObj.toISOString();

      if (isEditMode) {
        await foodLogStorage.updateLog(params.id as string, {
          name: foodName.trim(),
          calories: caloriesNum,
          timestamp: isoTimestamp,
        });
        handleSuccess('Entry updated successfully');
      } else {
        await foodLogStorage.addLog({
          name: foodName.trim(),
          calories: caloriesNum,
          timestamp: isoTimestamp,
        });
        handleSuccess('Entry added successfully');
      }
    } catch {
      Alert.alert('Error', 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            {/* Food Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Food Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Apple, Pizza, Salad"
                value={foodName}
                onChangeText={setFoodName}
                editable={!loading}
                placeholderTextColor="#ccc"
              />
            </View>

            {/* Calories */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 120"
                value={calories}
                onChangeText={setCalories}
                keyboardType="number-pad"
                editable={!loading}
                placeholderTextColor="#ccc"
              />
            </View>

            {/* Date & Time */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date & Time</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD HH:mm"
                value={timestamp}
                onChangeText={setTimestamp}
                editable={!loading}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.hint}>Format: YYYY-MM-DD HH:mm</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}>
                <Text style={styles.saveButtonText}>
                  {isEditMode ? 'Save changes' : 'Add entry'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => router.back()}
                disabled={loading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#f9f9f9',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1a1a1a',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
});
