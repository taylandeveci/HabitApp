import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { typography, spacing, borderRadius, shadows } from '../utils/theme';

interface StreakCounterProps {
  streak: number;
  valueAdded: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak, valueAdded }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );
  }, [streak]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${Math.min(valueAdded, 100)}%`, { duration: 1000 }),
  }));

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginHorizontal: spacing.md,
      marginBottom: spacing.lg,
      ...shadows.medium,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    fireIcon: {
      marginRight: spacing.sm,
    },
    streakNumber: {
      ...typography.heading1,
      color: theme.primary,
      fontWeight: 'bold',
    },
    streakLabel: {
      ...typography.caption,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    valueContainer: {
      marginTop: spacing.md,
    },
    valueLabel: {
      ...typography.body,
      color: theme.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: borderRadius.sm,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.accent,
      borderRadius: borderRadius.sm,
    },
    progressText: {
      ...typography.caption,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.streakContainer, animatedStyle]}>
        <Ionicons 
          name="flame" 
          size={32} 
          color={streak > 0 ? "#ff6b35" : theme.textSecondary} 
          style={styles.fireIcon}
        />
        <Text style={styles.streakNumber}>{streak}</Text>
      </Animated.View>
      <Text style={styles.streakLabel}>
        {streak === 0 ? 'Start your streak today!' : 
         streak === 1 ? 'Day streak' : 'Day streak'}
      </Text>
      
      <View style={styles.valueContainer}>
        <Text style={styles.valueLabel}>Value Added to Life</Text>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(valueAdded)}% Progress
        </Text>
      </View>
    </View>
  );
};
