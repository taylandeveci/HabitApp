import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { HabitPage } from '../types';
import { typography, spacing, borderRadius, shadows } from '../utils/theme';

interface CategoryCardProps {
  habit: HabitPage;
  progress: { completed: number; total: number; pct: number };
  isDone: boolean;
  onPress: () => void;
}

const getCategoryIcon = (category: string): any => {
  switch (category) {
    case 'sports': return 'fitness';
    case 'study': return 'book';
    case 'finance': return 'card';
    case 'work': return 'briefcase';
    case 'health': return 'medical';
    case 'custom': return 'apps';
    default: return 'list';
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'sports': return '#FF6B35';
    case 'study': return '#4ECDC4';
    case 'finance': return '#45B7D1';
    case 'work': return '#96CEB4';
    case 'health': return '#FFEAA7';
    case 'custom': return '#DDA0DD';
    default: return '#95A5A6';
  }
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  habit,
  progress,
  isDone,
  onPress,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
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
      backgroundColor: getCategoryColor(habit.category) + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      ...typography.body,
      color: theme.text,
      fontWeight: '600',
    },
    categoryPill: {
      backgroundColor: getCategoryColor(habit.category) + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: borderRadius.sm,
      marginTop: spacing.xs / 2,
      alignSelf: 'flex-start',
    },
    categoryText: {
      ...typography.caption,
      color: getCategoryColor(habit.category),
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    progressSection: {
      marginTop: spacing.sm,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    progressFill: {
      height: '100%',
      backgroundColor: getCategoryColor(habit.category),
      borderRadius: 3,
    },
    chip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      alignSelf: 'flex-start',
    },
    chipCompleted: {
      backgroundColor: theme.success + '20',
    },
    chipIncomplete: {
      backgroundColor: theme.border + '40',
    },
    chipText: {
      ...typography.caption,
      fontWeight: '500',
    },
    chipTextCompleted: {
      color: theme.success,
    },
    chipTextIncomplete: {
      color: theme.textSecondary,
    },
  });

  const renderChip = () => {
    if (isDone) {
      return (
        <View style={[styles.chip, styles.chipCompleted]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark" size={12} color={theme.success} />
            <Text style={[styles.chipText, styles.chipTextCompleted, { marginLeft: 4 }]}>
              Done
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.chip, styles.chipIncomplete]}>
        <Text style={[styles.chipText, styles.chipTextIncomplete]}>
          {progress.completed}/{progress.total} today
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getCategoryIcon(habit.category)} 
              size={20} 
              color={getCategoryColor(habit.category)} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{habit.title}</Text>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{habit.category}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress.pct}%` }
            ]} 
          />
        </View>
        {renderChip()}
      </View>
    </TouchableOpacity>
  );
};
