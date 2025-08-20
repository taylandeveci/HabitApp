import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, UserStats, HabitTemplate } from '../types';

const STORAGE_KEYS = {
  HABITS: '@habits',
  USER_STATS: '@user_stats',
  THEME: '@theme_preference',
  USER_PROFILE: '@user_profile',
} as const;

// Habits Storage
export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
    throw error;
  }
};

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const habitsJson = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    return habitsJson ? JSON.parse(habitsJson) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

// User Stats Storage
export const saveUserStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user stats:', error);
    throw error;
  }
};

export const loadUserStats = async (): Promise<UserStats | null> => {
  try {
    const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    return statsJson ? JSON.parse(statsJson) : null;
  } catch (error) {
    console.error('Error loading user stats:', error);
    return null;
  }
};

// Theme Storage
export const saveThemePreference = async (isDark: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
  } catch (error) {
    console.error('Error saving theme preference:', error);
    throw error;
  }
};

export const loadThemePreference = async (): Promise<boolean | null> => {
  try {
    const themeJson = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return themeJson ? JSON.parse(themeJson) : null;
  } catch (error) {
    console.error('Error loading theme preference:', error);
    return null;
  }
};

// User Profile Storage
export const saveUserProfile = async (profile: { name: string; avatar?: string }): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const loadUserProfile = async (): Promise<{ name: string; avatar?: string } | null> => {
  try {
    const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

// Export/Import functionality
export const exportData = async (): Promise<string> => {
  try {
    const habits = await loadHabits();
    const stats = await loadUserStats();
    const profile = await loadUserProfile();
    const theme = await loadThemePreference();
    
    return JSON.stringify({
      habits,
      stats,
      profile,
      theme,
      exportDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const importData = async (dataString: string): Promise<void> => {
  try {
    const data = JSON.parse(dataString);
    
    if (data.habits) await saveHabits(data.habits);
    if (data.stats) await saveUserStats(data.stats);
    if (data.profile) await saveUserProfile(data.profile);
    if (data.theme !== undefined) await saveThemePreference(data.theme);
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};
