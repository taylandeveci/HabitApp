import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useHabitStore } from '../../hooks/useHabitStore';
import { StreakCounter } from '../../components/StreakCounter';
import { CategoryCard } from '../../components/CategoryCard';
import { HabitPage } from '../../types';
import { typography, spacing, borderRadius, shadows } from '../../utils/theme';

export default function HomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { 
    habits, 
    addHabit, 
    getTodayProgress, 
    isTodayDone 
  } = useHabitStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'sports' | 'finance' | 'study' | 'work' | 'health' | 'custom'>('sports');

  const categories = ['sports', 'finance', 'study', 'work', 'health', 'custom'] as const;

  // Calculate tab bar height including safe area
  const BASE_TAB_HEIGHT = 60;
  const TAB_PADDING = 8;
  const tabBarHeight = BASE_TAB_HEIGHT + Math.max(insets.bottom, TAB_PADDING) + TAB_PADDING;

  const handleAddHabit = () => {
    if (newHabitTitle.trim()) {
      const newHabit = {
        title: newHabitTitle.trim(),
        category: selectedCategory,
        todos: [],
      };
      
      addHabit(newHabit);
      setNewHabitTitle('');
      setShowAddModal(false);
      
      // Navigate to the new habit detail page after a short delay
      setTimeout(() => {
        const createdHabit = habits.find(h => h.title === newHabitTitle.trim());
        if (createdHabit) {
          router.push(`/habit/${createdHabit.id}`);
        }
      }, 100);
    }
  };

  const handleHabitPress = (habit: HabitPage) => {
    router.push(`/habit/${habit.id}`);
  };

  const renderCategoryCard = ({ item }: { item: HabitPage }) => {
    const progress = getTodayProgress(item.id);
    const isDone = isTodayDone(item.id);
    
    return (
      <CategoryCard
        habit={item}
        progress={progress}
        isDone={isDone}
        onPress={() => handleHabitPress(item)}
      />
    );
  };

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const ListHeader = () => (
    <View>
      <StreakCounter streak={0} valueAdded={0} />
      
      {/* Right-aligned Section Header with single Add button */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.habitsTitle, { color: theme.text }]}>Habits</Text>
        <TouchableOpacity 
          style={[styles.globalAddButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color={theme.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No habits yet — Tap + to create your first one
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
      marginTop: spacing.sm,
    },
    habitsTitle: {
      ...typography.heading2,
      fontWeight: '600',
    },
    globalAddButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.small,
    },
    emptyState: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      padding: spacing.xl,
      marginHorizontal: spacing.md,
      marginTop: spacing.lg,
      alignItems: 'center',
      ...shadows.small,
    },
    emptyText: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      margin: spacing.md,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      ...typography.heading2,
      color: theme.text,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    input: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      marginBottom: spacing.md,
      color: theme.text,
      ...typography.body,
    },
    categorySelector: {
      marginBottom: spacing.lg,
    },
    categorySelectorTitle: {
      ...typography.body,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryOption: {
      width: '30%',
      aspectRatio: 1,
      backgroundColor: theme.background,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    categoryOptionSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '20',
    },
    categoryOptionText: {
      ...typography.caption,
      color: theme.text,
      marginTop: spacing.xs,
      textTransform: 'capitalize',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      padding: spacing.md,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    cancelButton: {
      backgroundColor: theme.border,
    },
    saveButton: {
      backgroundColor: theme.primary,
    },
    buttonText: {
      ...typography.body,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.text,
    },
    saveButtonText: {
      color: theme.surface,
    },
  });

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

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        style={styles.content}
        data={habits}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ 
          paddingBottom: tabBarHeight + 16,
          paddingHorizontal: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Habit Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Habit</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Habit title"
              placeholderTextColor={theme.textSecondary}
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
              autoFocus
            />
            
            <View style={styles.categorySelector}>
              <Text style={styles.categorySelectorTitle}>Category:</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      selectedCategory === category && styles.categoryOptionSelected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Ionicons
                      name={getCategoryIcon(category) as any}
                      size={20}
                      color={selectedCategory === category ? theme.primary : getCategoryColor(category)}
                    />
                    <Text style={styles.categoryOptionText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddHabit}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
