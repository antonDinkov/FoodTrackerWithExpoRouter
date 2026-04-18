import { FoodLog } from '@/types/foodLog';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'food_logs';

export const foodLogStorage = {
  async getAllLogs(): Promise<FoodLog[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading food logs:', error);
      return [];
    }
  },

  async addLog(foodLog: Omit<FoodLog, 'id'>): Promise<FoodLog> {
    try {
      const logs = await this.getAllLogs();
      const newLog: FoodLog = {
        ...foodLog,
        id: Date.now().toString(),
      };
      logs.push(newLog);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return newLog;
    } catch (error) {
      console.error('Error adding food log:', error);
      throw error;
    }
  },

  async updateLog(id: string, updates: Partial<Omit<FoodLog, 'id'>>): Promise<FoodLog | null> {
    try {
      const logs = await this.getAllLogs();
      const index = logs.findIndex((log) => log.id === id);
      if (index === -1) return null;

      logs[index] = { ...logs[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return logs[index];
    } catch (error) {
      console.error('Error updating food log:', error);
      throw error;
    }
  },

  async deleteLog(id: string): Promise<boolean> {
    try {
      const logs = await this.getAllLogs();
      const filteredLogs = logs.filter((log) => log.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLogs));
      return true;
    } catch (error) {
      console.error('Error deleting food log:', error);
      throw error;
    }
  },

  async getLogById(id: string): Promise<FoodLog | null> {
    try {
      const logs = await this.getAllLogs();
      return logs.find((log) => log.id === id) || null;
    } catch (error) {
      console.error('Error getting food log:', error);
      return null;
    }
  },

  async getTodayStats(): Promise<{ total: number; count: number }> {
    try {
      const logs = await this.getAllLogs();
      const today = new Date().toDateString();
      const todayLogs = logs.filter((log) => new Date(log.timestamp).toDateString() === today);
      return {
        total: todayLogs.reduce((sum, log) => sum + log.calories, 0),
        count: todayLogs.length,
      };
    } catch (error) {
      console.error('Error getting today stats:', error);
      return { total: 0, count: 0 };
    }
  },

  async getWeekStats(date: Date = new Date()): Promise<Record<string, number>> {
    try {
      const logs = await this.getAllLogs();
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekLogs = logs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      const dailyTotals: Record<string, number> = {};

      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        dailyTotals[dateStr] = 0;
      }

      weekLogs.forEach((log) => {
        const dateStr = log.timestamp.split('T')[0];
        dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + log.calories;
      });

      return dailyTotals;
    } catch (error) {
      console.error('Error getting week stats:', error);
      return {};
    }
  },
};
