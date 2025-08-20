export type HabitId = string;
export type TodoId = string;
export type ISODate = string; // YYYY-MM-DD local

export interface Todo {
  id: TodoId;
  title: string;
  note?: string;
  archived?: boolean;
}

export interface HabitPage {
  id: HabitId;
  title: string;
  category: 'sports' | 'finance' | 'study' | 'work' | 'health' | 'custom';
  todos: Todo[];
  createdAt: string;
}

// Daily completion log (per habit, per day)
export interface CompletionState {
  [habitId: HabitId]: { [date: ISODate]: Record<TodoId, boolean> };
}

// Legacy Habit interface for backwards compatibility
export interface Habit {
  id: string;
  name: string;
  category: 'sports' | 'study' | 'finance' | 'work' | 'health' | 'personal';
  streak: number;
  completedDates: string[]; // ISO date strings
  target: number;
  progress: number;
  icon: string;
  color: string;
  createdAt: string;
  todos?: Todo[];
}

export interface UserStats {
  totalStreak: number;
  valueAdded: number;
  categoryProgress: Record<string, number>;
  totalHabits: number;
  completedToday: number;
}

export interface HabitTemplate {
  id: string;
  name: string;
  category: 'sports' | 'study' | 'finance' | 'work' | 'health' | 'personal';
  description: string;
  habits: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'progress' | 'createdAt'>[];
  icon: string;
  color: string;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export type CategoryType = 'sports' | 'study' | 'finance' | 'work' | 'health' | 'personal';
