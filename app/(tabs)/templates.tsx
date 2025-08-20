import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useHabits } from '../../hooks/useHabits';
import { TemplateCard } from '../../components/TemplateCard';
import { HabitTemplate } from '../../types';
import { habitTemplates } from '../../utils/templates';

export default function TemplatesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addHabit } = useHabits();

  // Calculate tab bar height including safe area
  const BASE_TAB_HEIGHT = 60;
  const TAB_PADDING = 8;
  const tabBarHeight = BASE_TAB_HEIGHT + Math.max(insets.bottom, TAB_PADDING) + TAB_PADDING;

  const handleSelectTemplate = (template: HabitTemplate) => {
    Alert.alert(
      'Apply Template',
      `Add all ${template.habits.length} habits from "${template.name}" template?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add All',
          onPress: async () => {
            try {
              // Add all habits from template
              for (const habitData of template.habits) {
                await addHabit(habitData);
              }
              Alert.alert('Success', `Added ${template.habits.length} habits from ${template.name}!`);
            } catch (error) {
              Alert.alert('Error', 'Failed to add habits from template');
            }
          },
        },
      ]
    );
  };

  const renderTemplateCard = ({ item }: { item: HabitTemplate }) => (
    <TemplateCard
      template={item}
      onSelect={() => handleSelectTemplate(item)}
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 16, // 16dp
      paddingTop: 16, // 16dp
      paddingBottom: 8, // 8dp
    },
    title: {
      fontSize: 28, // text-2xl
      fontWeight: '700', // font-bold
      color: theme.text,
      marginBottom: 4, // 4dp
    },
    subtitle: {
      fontSize: 14, // text-sm
      color: theme.textSecondary,
      lineHeight: 20,
    },
    listContainer: {
      paddingHorizontal: 8, // 8dp for outer padding
      paddingBottom: tabBarHeight + 16, // Dynamic padding based on safe area
    },
    columnWrapper: {
      gap: 8, // 8dp gap between columns
      paddingHorizontal: 8, // 8dp padding on sides
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Habit Templates</Text>
        <Text style={styles.subtitle}>
          Quick start with pre-built habit collections
        </Text>
      </View>
      
      <FlatList
        data={habitTemplates}
        renderItem={renderTemplateCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
