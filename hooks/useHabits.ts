import { useState, useEffect, useCallback } from 'react';
import { Habit, UserStats, CategoryType } from '../types';
import { saveHabits, loadHabits, saveUserStats, loadUserStats } from '../utils/storage';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalStreak: 0,
    valueAdded: 0,
    categoryProgress: {},
    totalHabits: 0,
    completedToday: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load habits and stats on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedHabits, loadedStats] = await Promise.all([
          loadHabits(),
          loadUserStats(),
        ]);
        
        setHabits(loadedHabits);
        if (loadedStats) {
          setStats(loadedStats);
        }
        
        // Calculate stats if not available
        if (!loadedStats && loadedHabits.length > 0) {
          const calculatedStats = calculateStats(loadedHabits);
          setStats(calculatedStats);
          await saveUserStats(calculatedStats);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats from habits
  const calculateStats = useCallback((habitList: Habit[]): UserStats => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habitList.filter(habit => 
      habit.completedDates.includes(today)
    ).length;

    const totalStreak = Math.max(...habitList.map(h => h.streak), 0);
    
    const categoryProgress: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};
    
    habitList.forEach(habit => {
      if (!categoryProgress[habit.category]) {
        categoryProgress[habit.category] = 0;
        categoryTotals[habit.category] = 0;
      }
      categoryProgress[habit.category] += habit.progress;
      categoryTotals[habit.category] += 1;
    });

    // Calculate average progress per category
    Object.keys(categoryProgress).forEach(category => {
      categoryProgress[category] = Math.round(
        (categoryProgress[category] / categoryTotals[category]) * 100
      ) / 100;
    });

    const valueAdded = habitList.reduce((sum, habit) => sum + habit.progress, 0) / habitList.length || 0;

    return {
      totalStreak,
      valueAdded: Math.round(valueAdded * 100) / 100,
      categoryProgress,
      totalHabits: habitList.length,
      completedToday,
    };
  }, []);

  // Add new habit
  const addHabit = useCallback(async (habitData: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'progress' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      completedDates: [],
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    
    const newStats = calculateStats(updatedHabits);
    setStats(newStats);
    
    await Promise.all([
      saveHabits(updatedHabits),
      saveUserStats(newStats),
    ]);
  }, [habits, calculateStats]);

  // Complete habit for today
  const completeHabit = useCallback(async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        if (habit.completedDates.includes(today)) {
          return habit; // Already completed today
        }
        
        const updatedCompletedDates = [...habit.completedDates, today];
        const newStreak = calculateStreak(updatedCompletedDates);
        const newProgress = Math.min((updatedCompletedDates.length / 30) * 100, 100); // 30-day progress
        
        return {
          ...habit,
          completedDates: updatedCompletedDates,
          streak: newStreak,
          progress: newProgress,
        };
      }
      return habit;
    });

    setHabits(updatedHabits);
    
    const newStats = calculateStats(updatedHabits);
    setStats(newStats);
    
    await Promise.all([
      saveHabits(updatedHabits),
      saveUserStats(newStats),
    ]);
  }, [habits, calculateStats]);

  // Uncomplete habit for today
  const uncompleteHabit = useCallback(async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const updatedCompletedDates = habit.completedDates.filter(date => date !== today);
        const newStreak = calculateStreak(updatedCompletedDates);
        const newProgress = Math.min((updatedCompletedDates.length / 30) * 100, 100);
        
        return {
          ...habit,
          completedDates: updatedCompletedDates,
          streak: newStreak,
          progress: newProgress,
        };
      }
      return habit;
    });

    setHabits(updatedHabits);
    
    const newStats = calculateStats(updatedHabits);
    setStats(newStats);
    
    await Promise.all([
      saveHabits(updatedHabits),
      saveUserStats(newStats),
    ]);
  }, [habits, calculateStats]);

  // Delete habit
  const deleteHabit = useCallback(async (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    setHabits(updatedHabits);
    
    const newStats = calculateStats(updatedHabits);
    setStats(newStats);
    
    await Promise.all([
      saveHabits(updatedHabits),
      saveUserStats(newStats),
    ]);
  }, [habits, calculateStats]);

  // Update habit
  const updateHabit = useCallback(async (updatedHabit: Habit) => {
    const updatedHabits = habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    setHabits(updatedHabits);
    
    const newStats = calculateStats(updatedHabits);
    setStats(newStats);
    
    await Promise.all([
      saveHabits(updatedHabits),
      saveUserStats(newStats),
    ]);
  }, [habits, calculateStats]);

  // Get habits by category
  const getHabitsByCategory = useCallback((category: CategoryType): Habit[] => {
    return habits.filter(habit => habit.category === category);
  }, [habits]);

  // Check if habit is completed today
  const isCompletedToday = useCallback((habitId: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.completedDates.includes(today) : false;
  }, [habits]);

  // Calculate streak from completed dates
  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;
    
    const sortedDates = completedDates.sort().reverse();
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    habits,
    stats,
    loading,
    addHabit,
    completeHabit,
    uncompleteHabit,
    deleteHabit,
    updateHabit,
    getHabitsByCategory,
    isCompletedToday,
  };
};
