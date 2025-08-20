import { useState, useEffect, useMemo } from 'react';
import { Habit, CategoryType } from '../types';
import { generateChartData, ChartDataPoint } from '../utils/dataAggregation';

export const useStats = (habits: Habit[]) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Get filtered habits based on selected category
  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'all') return habits;
    return habits.filter(habit => habit.category === selectedCategory);
  }, [habits, selectedCategory]);

  // Generate chart data for the selected time range
  const chartData = useMemo((): ChartDataPoint[] => {
    return generateChartData(filteredHabits, timeRange);
  }, [filteredHabits, timeRange]);

  // Calculate completion rate for a date range
  const calculateCompletionRate = (startDate: Date, endDate: Date): number => {
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    let totalCompletions = 0;
    let totalPossible = 0;

    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const completedCount = filteredHabits.filter(habit =>
        habit.completedDates.includes(dateString)
      ).length;

      totalCompletions += completedCount;
      totalPossible += filteredHabits.length;
    }

    return totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
  };

  // Calculate category progress percentages
  const categoryProgress = useMemo(() => {
    const categories: CategoryType[] = ['sports', 'study', 'finance', 'work', 'health', 'personal'];
    
    return categories.map(category => {
      const categoryHabits = habits.filter(habit => habit.category === category);
      const avgProgress = categoryHabits.length > 0
        ? categoryHabits.reduce((sum, habit) => sum + habit.progress, 0) / categoryHabits.length
        : 0;
      
      // Calculate change (mock data for demo - in real app, compare with previous period)
      const change = Math.random() * 10 - 5; // Random change between -5% and +5%
      
      return {
        category,
        progress: Math.round(avgProgress),
        change: Math.round(change * 100) / 100,
        count: categoryHabits.length,
      };
    }).filter(item => item.count > 0);
  }, [habits]);

  // Calculate weekly summary
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    
    const weeklyCompletions = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      return filteredHabits.filter(habit =>
        habit.completedDates.includes(dateString)
      ).length;
    });

    const totalWeeklyCompletions = weeklyCompletions.reduce((sum, count) => sum + count, 0);
    const maxPossibleCompletions = filteredHabits.length * 7;
    const weeklyRate = maxPossibleCompletions > 0 
      ? Math.round((totalWeeklyCompletions / maxPossibleCompletions) * 100)
      : 0;

    return {
      completions: weeklyCompletions,
      totalCompletions: totalWeeklyCompletions,
      completionRate: weeklyRate,
      bestDay: weeklyCompletions.indexOf(Math.max(...weeklyCompletions)),
    };
  }, [filteredHabits]);

  // Get available categories
  const availableCategories = useMemo(() => {
    const categories = new Set(habits.map(habit => habit.category));
    return Array.from(categories);
  }, [habits]);

  return {
    selectedCategory,
    setSelectedCategory,
    timeRange,
    setTimeRange,
    chartData,
    categoryProgress,
    weeklyStats,
    availableCategories,
    filteredHabits,
  };
};
