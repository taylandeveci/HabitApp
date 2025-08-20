import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitPage, CompletionState, HabitId, TodoId, ISODate, Todo } from '../types';

interface HabitStore {
  habits: HabitPage[];
  completionState: CompletionState;
  lastOpenDate: string;
  
  // Actions
  addHabit: (habit: Omit<HabitPage, 'id' | 'createdAt'>) => void;
  updateHabit: (habitId: HabitId, updates: Partial<HabitPage>) => void;
  deleteHabit: (habitId: HabitId) => void;
  addTodo: (habitId: HabitId, todo: Omit<Todo, 'id'>) => void;
  updateTodo: (habitId: HabitId, todoId: TodoId, updates: Partial<Todo>) => void;
  deleteTodo: (habitId: HabitId, todoId: TodoId) => void;
  toggleTodoForToday: (habitId: HabitId, todoId: TodoId) => void;
  
  // Selectors
  getTodayProgress: (habitId: HabitId) => { completed: number; total: number; pct: number };
  isTodayDone: (habitId: HabitId) => boolean;
  calcStreak: (habitId: HabitId) => number;
  getToday: () => ISODate;
}

const getLocalISODate = (): ISODate => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      completionState: {},
      lastOpenDate: getLocalISODate(),

      addHabit: (habitData: Omit<HabitPage, 'id' | 'createdAt'>) => {
        const newHabit: HabitPage = {
          ...habitData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      updateHabit: (habitId: HabitId, updates: Partial<HabitPage>) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId ? { ...habit, ...updates } : habit
          ),
        }));
      },

      deleteHabit: (habitId: HabitId) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== habitId),
          completionState: Object.fromEntries(
            Object.entries(state.completionState).filter(([id]) => id !== habitId)
          ),
        }));
      },

      addTodo: (habitId: HabitId, todoData: Omit<Todo, 'id'>) => {
        const newTodo: Todo = {
          ...todoData,
          id: Date.now().toString(),
        };
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? { ...habit, todos: [...habit.todos, newTodo] }
              : habit
          ),
        }));
      },

      updateTodo: (habitId: HabitId, todoId: TodoId, updates: Partial<Todo>) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  todos: habit.todos.map((todo) =>
                    todo.id === todoId ? { ...todo, ...updates } : todo
                  ),
                }
              : habit
          ),
        }));
      },

      deleteTodo: (habitId: HabitId, todoId: TodoId) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? { ...habit, todos: habit.todos.filter((todo) => todo.id !== todoId) }
              : habit
          ),
        }));
      },

      toggleTodoForToday: (habitId: HabitId, todoId: TodoId) => {
        const today = getLocalISODate();
        set((state) => {
          const currentState = state.completionState[habitId]?.[today] || {};
          const isCompleted = currentState[todoId] || false;
          
          return {
            completionState: {
              ...state.completionState,
              [habitId]: {
                ...state.completionState[habitId],
                [today]: {
                  ...currentState,
                  [todoId]: !isCompleted,
                },
              },
            },
          };
        });
      },

      getTodayProgress: (habitId: HabitId) => {
        const state = get();
        const habit = state.habits.find((h) => h.id === habitId);
        if (!habit) return { completed: 0, total: 0, pct: 0 };

        const today = getLocalISODate();
        const todayCompletions = state.completionState[habitId]?.[today] || {};
        const activeTodos = habit.todos.filter((todo) => !todo.archived);
        
        const completed = activeTodos.filter((todo) => todayCompletions[todo.id]).length;
        const total = activeTodos.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, pct };
      },

      isTodayDone: (habitId: HabitId) => {
        const progress = get().getTodayProgress(habitId);
        return progress.pct === 100;
      },

      calcStreak: (habitId: HabitId) => {
        const state = get();
        const habitCompletions = state.completionState[habitId];
        if (!habitCompletions) return 0;

        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);

        while (true) {
          const dateStr = getLocalISODate();
          currentDate.setTime(today.getTime() - streak * 24 * 60 * 60 * 1000);
          const checkDateStr = currentDate.toISOString().split('T')[0];
          
          const dayCompletions = habitCompletions[checkDateStr];
          if (!dayCompletions) break;

          const habit = state.habits.find((h) => h.id === habitId);
          if (!habit) break;

          const activeTodos = habit.todos.filter((todo) => !todo.archived);
          const completedTodos = activeTodos.filter((todo) => dayCompletions[todo.id]);
          
          if (activeTodos.length === 0 || completedTodos.length !== activeTodos.length) {
            break;
          }

          streak++;
        }

        return streak;
      },

      getToday: getLocalISODate,
    }),
    {
      name: 'habit-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
