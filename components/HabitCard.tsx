import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Habit } from '../types';
import { typography, spacing, borderRadius, shadows } from '../utils/theme';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onPress?: () => void;
  onComplete: () => void;
  onUncomplete: () => void;
  onDelete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onPress,
  onComplete,
  onUncomplete,
  onDelete,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    
    // Call the onPress prop if provided (for navigation)
    if (onPress) {
      onPress();
    }
  };

  const handleCheckPress = () => {
    if (isCompleted) {
      onUncomplete();
    } else {
      onComplete();
    }
  };

  const handleLongPress = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressWidth = (habit.progress / 100) * 100;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: isCompleted ? theme.success + '20' : theme.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginVertical: spacing.xs,
      marginHorizontal: spacing.md,
      borderWidth: isCompleted ? 2 : 1,
      borderColor: isCompleted ? theme.success : theme.border,
      ...shadows.small,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: habit.color + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    habitName: {
      ...typography.body,
      color: theme.text,
      fontWeight: '600',
    },
    habitCategory: {
      ...typography.caption,
      color: theme.textSecondary,
      textTransform: 'capitalize',
      marginTop: spacing.xs / 2,
    },
    checkContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isCompleted ? theme.success : theme.border,
      backgroundColor: isCompleted ? theme.success : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressContainer: {
      marginTop: spacing.sm,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    progressText: {
      ...typography.caption,
      color: theme.textSecondary,
    },
    streakText: {
      ...typography.caption,
      color: habit.streak > 0 ? theme.primary : theme.textSecondary,
      fontWeight: '600',
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: habit.color,
      borderRadius: 3,
      width: `${progressWidth}%`,
    },
    target: {
      ...typography.small,
      color: theme.textSecondary,
      marginTop: spacing.xs,
    },
  });

  return (
    <TouchableOpacity 
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={habit.icon as any} 
                size={20} 
                color={habit.color} 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitCategory}>{habit.category}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.checkContainer}
            onPress={handleCheckPress}
          >
            {isCompleted && (
              <Ionicons name="checkmark" size={16} color={theme.surface} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Progress: {Math.round(habit.progress)}%
            </Text>
            <Text style={styles.streakText}>
              🔥 {habit.streak} day{habit.streak !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
          <Text style={styles.target}>
            Target: {habit.target} {habit.category === 'sports' ? 'sessions' : 'minutes'} daily
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
