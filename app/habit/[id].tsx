import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useHabitStore } from '../../hooks/useHabitStore';
import { Todo } from '../../types';
import { typography, spacing, borderRadius, shadows } from '../../utils/theme';

function makeStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    errorText: {
      ...typography.heading2,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    backButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
    },
    backButtonText: {
      ...typography.body,
      fontWeight: '600',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.lg,
      marginBottom: spacing.md,
    },
    headerContent: {
      flex: 1,
      alignItems: 'center',
    },
    habitTitle: {
      ...typography.heading1,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    categoryPill: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    categoryText: {
      ...typography.caption,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    progressContainer: {
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.lg,
      ...shadows.small,
    },
    progressTitle: {
      ...typography.heading3,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    progressStats: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    progressText: {
      ...typography.body,
      fontWeight: '600',
    },
    doneIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    doneText: {
      ...typography.caption,
      fontWeight: '600',
      marginLeft: spacing.xs,
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    addTodoContainer: {
      flexDirection: 'row',
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.lg,
      ...shadows.small,
    },
    addTodoInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      ...typography.body,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionTitle: {
      ...typography.heading3,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.sm,
      ...shadows.small,
    },
    todoContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    todoTextContainer: {
      flex: 1,
    },
    todoTitle: {
      ...typography.body,
      fontWeight: '500',
    },
    completedTodoTitle: {
      textDecorationLine: 'line-through',
    },
    todoNote: {
      ...typography.caption,
      marginTop: spacing.xs / 2,
    },
    deleteButton: {
      padding: spacing.sm,
      marginLeft: spacing.sm,
    },
  });
}

export default function HabitDetailScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    habits, 
    addTodo, 
    deleteTodo, 
    toggleTodoForToday, 
    getTodayProgress,
    completionState,
    getToday
  } = useHabitStore();
  
  const [newTodoTitle, setNewTodoTitle] = useState('');
  
  const habit = habits.find(h => h.id === id);
  const today = getToday();
  const todayCompletions = completionState[id || '']?.[today] || {};
  const progress = getTodayProgress(id || '');

  if (!habit) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>Habit not found</Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: theme.surface }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodo(habit.id, { title: newTodoTitle.trim() });
      setNewTodoTitle('');
    }
  };

  const handleToggleTodo = (todoId: string) => {
    toggleTodoForToday(habit.id, todoId);
  };

  const handleDeleteTodo = (todoId: string) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(habit.id, todoId) },
      ]
    );
  };

  const renderTodoItem = ({ item }: { item: Todo }) => {
    const isCompleted = !!todayCompletions[item.id];
    
    return (
      <View style={[styles.todoItem, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={styles.todoContent}
          onPress={() => handleToggleTodo(item.id)}
        >
          <View style={[
            styles.checkbox,
            { borderColor: isCompleted ? theme.success : theme.border },
            isCompleted && { backgroundColor: theme.success }
          ]}>
            {isCompleted && (
              <Ionicons name="checkmark" size={16} color={theme.surface} />
            )}
          </View>
          
          <View style={styles.todoTextContainer}>
            <Text style={[
              styles.todoTitle,
              { color: isCompleted ? theme.textSecondary : theme.text },
              isCompleted && styles.completedTodoTitle
            ]}>
              {item.title}
            </Text>
            {item.note && (
              <Text style={[styles.todoNote, { color: theme.textSecondary }]}>
                {item.note}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTodo(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  const ListHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.habitTitle, { color: theme.text }]}>{habit.title}</Text>
          <View style={[styles.categoryPill, { backgroundColor: getCategoryColor(habit.category) + '20' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(habit.category) }]}>
              {habit.category}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="pencil" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Progress Summary */}
      <View style={[styles.progressContainer, { backgroundColor: theme.surface }]}>
        <Text style={[styles.progressTitle, { color: theme.text }]}>Today's Progress</Text>
        <View style={styles.progressStats}>
          <Text style={[styles.progressText, { color: theme.text }]}>
            {progress.completed}/{progress.total} • {progress.pct}%
          </Text>
          {progress.pct === 100 && (
            <View style={styles.doneIndicator}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
              <Text style={[styles.doneText, { color: theme.success }]}>Done for today!</Text>
            </View>
          )}
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress.pct}%`,
                backgroundColor: getCategoryColor(habit.category)
              }
            ]} 
          />
        </View>
      </View>

      {/* Add Todo Input */}
      <View style={[styles.addTodoContainer, { backgroundColor: theme.surface }]}>
        <TextInput
          style={[styles.addTodoInput, { color: theme.text, borderColor: theme.border }]}
          placeholder="Add a new todo..."
          placeholderTextColor={theme.textSecondary}
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleAddTodo}
        >
          <Ionicons name="add" size={20} color={theme.surface} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>To-dos</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['left', 'right']}>
      <FlatList
        data={habit.todos.filter(todo => !todo.archived)}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
