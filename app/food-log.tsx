import { FoodLog } from '@/types/foodLog';
import { WebDeleteConfirmation } from '@/utils/DeleteConfirmation';
import { foodLogStorage } from '@/utils/foodLogStorage';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function FoodLogScreen() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    visible: boolean;
    id: string;
    name: string;
  }>({ visible: false, id: '', name: '' });

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );

  const loadLogs = async () => {
    try {
      const allLogs = await foodLogStorage.getAllLogs();
      // Sort by timestamp descending
      const sortedLogs = allLogs.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(sortedLogs);
    } catch {
      Alert.alert('Error', 'Failed to load food logs');
    }
  };

  const handleDeletePress = (log: FoodLog) => {
    if (Platform.OS === 'web') {
      setDeleteConfirmation({ visible: true, id: log.id, name: log.name });
    } else {
      Alert.alert(
        'Delete entry',
        `Remove ${log.name} from the log?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => handleDelete(log.id),
          },
        ]
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await foodLogStorage.deleteLog(id);
      setDeleteConfirmation({ visible: false, id: '', name: '' });
      await loadLogs();
      Alert.alert('Success', 'Entry deleted successfully');
    } catch {
      Alert.alert('Error', 'Failed to delete entry');
    }
  };

  const handleConfirmDelete = () => {
    handleDelete(deleteConfirmation.id);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: FoodLog }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryContent}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.entryMeta}>{formatDate(item.timestamp)}</Text>
      </View>
      <Text style={styles.calories}>{item.calories} cal</Text>
      <View style={styles.actions}>
        <Link href={{ pathname: '/edit-food-log', params: { id: item.id } }} asChild>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePress(item)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No food logs yet</Text>
      <Text style={styles.emptySubtext}>Add your first entry to get started</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved food logs</Text>
        <Link href="/add-food-log" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />

      {/* Delete Confirmation Modal for Web */}
      {Platform.OS === 'web' && deleteConfirmation.visible && (
        <WebDeleteConfirmation
          title="Delete entry"
          message={`Remove ${deleteConfirmation.name} from the log?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmation({ visible: false, id: '', name: '' })}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  entryContent: {
    marginBottom: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  entryMeta: {
    fontSize: 12,
    color: '#999',
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 12,
    alignSelf: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 13,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffe6e6',
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#c41e3a',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
  },
});
