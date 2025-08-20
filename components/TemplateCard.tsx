import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { HabitTemplate } from '../types';
import { typography, spacing, borderRadius, shadows } from '../utils/theme';

interface TemplateCardProps {
  template: HabitTemplate;
  onSelect: (template: HabitTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const { theme } = useTheme();

  const handlePress = () => {
    onSelect(template);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderRadius: 16, // borderRadius.lg
      padding: 16, // 16dp
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.small,
      minHeight: 240, // Minimum height, flexible content
      justifyContent: 'space-between',
      flex: 1, // Important for grid layout
      marginVertical: 4, // 4dp vertical margin
    },
    content: {
      flex: 1, // Takes available space
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12, // 12dp
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: template.color + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12, // 12dp
      marginTop: 2, // Slight offset for better alignment
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16, // text-base
      fontWeight: '600', // font-semibold
      lineHeight: 20, // leading-tight
      color: theme.text,
      marginBottom: 4, // 4dp
    },
    description: {
      fontSize: 12, // text-xs
      lineHeight: 16,
      color: theme.textSecondary,
      height: 32, // Exactly 2 lines (16 * 2)
    },
    habitsContainer: {
      flex: 1, // Takes remaining space
      marginBottom: 12, // 12dp
    },
    sectionTitle: {
      fontSize: 12, // text-xs
      fontWeight: '600', // font-semibold
      color: theme.text,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8, // 8dp
    },
    habitItem: {
      fontSize: 12, // text-xs
      lineHeight: 16,
      color: theme.textSecondary,
      marginBottom: 4, // 4dp
    },
    moreText: {
      fontSize: 11, // text-xs smaller
      color: template.color,
      fontWeight: '500',
      fontStyle: 'italic',
    },
    selectButton: {
      backgroundColor: template.color + '15',
      borderWidth: 1,
      borderColor: template.color + '40',
      borderRadius: 12, // borderRadius.md
      paddingVertical: 12, // 12dp
      paddingHorizontal: 16, // 16dp
      alignItems: 'center',
      marginTop: 'auto', // Sticks to bottom
    },
    selectButtonText: {
      fontSize: 14, // text-sm
      fontWeight: '600', // font-semibold
      color: template.color,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={template.icon as any} 
              size={20} 
              color={template.color} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {template.name}
            </Text>
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {template.description}
            </Text>
          </View>
        </View>

        <View style={styles.habitsContainer}>
          <Text style={styles.sectionTitle}>Included Habits</Text>
          {template.habits.slice(0, 3).map((habit, index) => (
            <Text key={index} style={styles.habitItem} numberOfLines={1} ellipsizeMode="tail">
              • {habit.name}
            </Text>
          ))}
          {template.habits.length > 3 && (
            <Text style={styles.moreText}>
              +{template.habits.length - 3} more habits
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.selectButton} onPress={handlePress} activeOpacity={0.8}>
        <Text style={styles.selectButtonText}>Select Template</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
