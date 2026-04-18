export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  timestamp: string; // ISO string
}

export interface DailyCalories {
  date: string; // YYYY-MM-DD format
  calories: number;
  dayOfWeek: string;
}
