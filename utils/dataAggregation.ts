import { Habit } from '../types';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  parseISO,
  isWithinInterval
} from 'date-fns';

export interface ChartDataPoint {
  x: Date;
  y: number;
}

// Helper function to compute percentage safely
export const computePercent = (completed: number, total: number): number => {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
};

// Group habits by day and calculate completion percentage
export const groupByDay = (
  habits: Habit[], 
  startDate: Date, 
  endDate: Date
): ChartDataPoint[] => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(day => {
    const dayString = format(day, 'yyyy-MM-dd');
    const completedCount = habits.filter(habit => 
      habit.completedDates.includes(dayString)
    ).length;
    
    return {
      x: day,
      y: computePercent(completedCount, habits.length)
    };
  });
};

// Group habits by week and calculate average completion percentage
export const groupByWeek = (
  habits: Habit[], 
  startDate: Date, 
  endDate: Date
): ChartDataPoint[] => {
  const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
  
  return weeks.map(weekStart => {
    const weekEnd = endOfWeek(weekStart);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    let totalCompletions = 0;
    let totalPossible = 0;
    
    daysInWeek.forEach(day => {
      if (isWithinInterval(day, { start: startDate, end: endDate })) {
        const dayString = format(day, 'yyyy-MM-dd');
        const completedCount = habits.filter(habit => 
          habit.completedDates.includes(dayString)
        ).length;
        
        totalCompletions += completedCount;
        totalPossible += habits.length;
      }
    });
    
    return {
      x: weekStart,
      y: computePercent(totalCompletions, totalPossible)
    };
  });
};

// Group habits by month and calculate average completion percentage
export const groupByMonth = (
  habits: Habit[], 
  startDate: Date, 
  endDate: Date
): ChartDataPoint[] => {
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  
  return months.map(monthStart => {
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    let totalCompletions = 0;
    let totalPossible = 0;
    
    daysInMonth.forEach(day => {
      if (isWithinInterval(day, { start: startDate, end: endDate })) {
        const dayString = format(day, 'yyyy-MM-dd');
        const completedCount = habits.filter(habit => 
          habit.completedDates.includes(dayString)
        ).length;
        
        totalCompletions += completedCount;
        totalPossible += habits.length;
      }
    });
    
    return {
      x: monthStart,
      y: computePercent(totalCompletions, totalPossible)
    };
  });
};

// Downsample data if there are too many points
export const downsampleData = (data: ChartDataPoint[], maxPoints: number = 100): ChartDataPoint[] => {
  if (data.length <= maxPoints) return data;
  
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
};

// Generate chart data based on time range
export const generateChartData = (
  habits: Habit[], 
  timeRange: 'week' | 'month' | 'year'
): ChartDataPoint[] => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = now;
  let data: ChartDataPoint[];
  
  switch (timeRange) {
    case 'week':
      startDate = startOfWeek(now, { weekStartsOn: 1 }); // Start from Monday
      data = groupByDay(habits, startDate, endDate);
      break;
      
    case 'month':
      startDate = startOfMonth(now);
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
      data = groupByWeek(habits, startDate, endDate);
      break;
      
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1); // Start of year
      data = groupByMonth(habits, startDate, endDate);
      break;
      
    default:
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      data = groupByDay(habits, startDate, endDate);
  }
  
  // Downsample if necessary
  return downsampleData(data);
};
