import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHabits } from '../../hooks/useHabits';
import { useStats } from '../../hooks/useStats';
import { ProgressChart } from '../../components/ProgressChart';
import { CategoryType } from '../../types';
import { getCategoryColor, getCategoryIcon } from '../../utils/templates';
import { typography, spacing, borderRadius, shadows } from '../../utils/theme';

export default function ChartsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { habits } = useHabits();
  const { 
    selectedCategory, 
    setSelectedCategory, 
    timeRange, 
    setTimeRange, 
    chartData, 
    categoryProgress,
    availableCategories 
  } = useStats(habits);

  // Calculate tab bar height including safe area
  const BASE_TAB_HEIGHT = 60;
  const TAB_PADDING = 8;
  const tabBarHeight = BASE_TAB_HEIGHT + Math.max(insets.bottom, TAB_PADDING) + TAB_PADDING;

  const allCategories: (CategoryType | 'all')[] = ['all', ...availableCategories];
  const timeRanges: Array<{ key: 'week' | 'month' | 'year', label: string }> = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    selectorContainer: {
      backgroundColor: theme.surface,
      margin: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.small,
    },
    selectorTitle: {
      ...typography.body,
      color: theme.text,
      marginBottom: spacing.sm,
      fontWeight: '600',
    },
    categorySelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.md,
    },
    categoryChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryChipSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryChipText: {
      ...typography.caption,
      color: theme.text,
      textTransform: 'capitalize',
      marginLeft: spacing.xs,
    },
    categoryChipTextSelected: {
      color: theme.surface,
    },
    timeRangeSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
      backgroundColor: theme.background,
      marginHorizontal: spacing.xs,
    },
    timeRangeButtonSelected: {
      backgroundColor: theme.primary,
    },
    timeRangeButtonText: {
      ...typography.caption,
      color: theme.text,
      fontWeight: '600',
    },
    timeRangeButtonTextSelected: {
      color: theme.surface,
    },
    progressContainer: {
      backgroundColor: theme.surface,
      margin: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.small,
    },
    progressTitle: {
      ...typography.heading3,
      color: theme.text,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    progressItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    progressItemLast: {
      borderBottomWidth: 0,
    },
    progressLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    progressIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    progressInfo: {
      flex: 1,
    },
    progressCategory: {
      ...typography.body,
      color: theme.text,
      textTransform: 'capitalize',
      fontWeight: '600',
    },
    progressHabits: {
      ...typography.caption,
      color: theme.textSecondary,
    },
    progressRight: {
      alignItems: 'flex-end',
    },
    progressPercentage: {
      ...typography.body,
      color: theme.text,
      fontWeight: '600',
    },
    progressChange: {
      ...typography.caption,
      marginTop: spacing.xs,
    },
    positiveChange: {
      color: theme.success,
    },
    negativeChange: {
      color: theme.error,
    },
    emptyState: {
      backgroundColor: theme.surface,
      margin: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      alignItems: 'center',
      ...shadows.small,
    },
    emptyStateText: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  if (habits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={48} color={theme.textSecondary} />
          <Text style={styles.emptyStateText}>
            No habits to analyze yet.{'\n'}Start tracking habits to see your progress!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Category and Time Range Selectors */}
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorTitle}>Category</Text>
          <View style={styles.categorySelector}>
            {allCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Ionicons
                  name={category === 'all' ? 'apps' : (getCategoryIcon(category) as any)}
                  size={16}
                  color={selectedCategory === category ? theme.surface : getCategoryColor(category)}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextSelected,
                  ]}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.selectorTitle, { marginTop: spacing.md }]}>Time Range</Text>
          <View style={styles.timeRangeSelector}>
            {timeRanges.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.timeRangeButton,
                  timeRange === key && styles.timeRangeButtonSelected,
                ]}
                onPress={() => setTimeRange(key)}
              >
                <Text
                  style={[
                    styles.timeRangeButtonText,
                    timeRange === key && styles.timeRangeButtonTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress Chart */}
        <ProgressChart
          data={chartData}
          title={`${selectedCategory === 'all' ? 'Overall' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Progress`}
        />

        {/* Category Progress */}
        {categoryProgress.length > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Category Performance</Text>
            {categoryProgress.map((item, index) => (
              <View
                key={item.category}
                style={[
                  styles.progressItem,
                  index === categoryProgress.length - 1 && styles.progressItemLast,
                ]}
              >
                <View style={styles.progressLeft}>
                  <View
                    style={[
                      styles.progressIcon,
                      { backgroundColor: getCategoryColor(item.category) + '20' },
                    ]}
                  >
                    <Ionicons
                      name={getCategoryIcon(item.category) as any}
                      size={16}
                      color={getCategoryColor(item.category)}
                    />
                  </View>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressCategory}>{item.category}</Text>
                    <Text style={styles.progressHabits}>
                      {item.count} habit{item.count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressRight}>
                  <Text style={styles.progressPercentage}>{item.progress}%</Text>
                  <Text
                    style={[
                      styles.progressChange,
                      item.change >= 0 ? styles.positiveChange : styles.negativeChange,
                    ]}
                  >
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Add some space at the bottom */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}
