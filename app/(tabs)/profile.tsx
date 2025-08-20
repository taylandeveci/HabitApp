import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Switch, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHabits } from '../../hooks/useHabits';
import { saveUserProfile, loadUserProfile, exportData, clearAllData } from '../../utils/storage';
import { typography, spacing, borderRadius, shadows } from '../../utils/theme';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { habits, stats } = useHabits();
  const [userProfile, setUserProfile] = useState({ name: 'User', avatar: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');

  // Calculate tab bar height including safe area
  const BASE_TAB_HEIGHT = 60;
  const TAB_PADDING = 8;
  const tabBarHeight = BASE_TAB_HEIGHT + Math.max(insets.bottom, TAB_PADDING) + TAB_PADDING;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const profile = await loadUserProfile();
    if (profile) {
      setUserProfile({ name: profile.name, avatar: profile.avatar || '' });
    }
  };

  const handleEditProfile = () => {
    setEditName(userProfile.name);
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (editName.trim()) {
      const newProfile = { ...userProfile, name: editName.trim() };
      setUserProfile(newProfile);
      await saveUserProfile(newProfile);
      setShowEditModal(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      Alert.alert(
        'Export Data',
        'Your data has been prepared for export. In a real app, this would be saved to a file or shared.',
        [{ text: 'OK' }]
      );
      console.log('Exported data:', data); // In real app, save to file
    } catch (error) {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your habits and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    profileHeader: {
      backgroundColor: theme.surface,
      margin: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      ...shadows.medium,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    avatarText: {
      ...typography.heading2,
      color: theme.primary,
      fontWeight: 'bold',
    },
    userName: {
      ...typography.heading2,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    userStats: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    editButton: {
      marginTop: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: theme.primary + '20',
      borderRadius: borderRadius.full,
    },
    editButtonText: {
      ...typography.caption,
      color: theme.primary,
      fontWeight: '600',
    },
    statsContainer: {
      backgroundColor: theme.surface,
      margin: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.small,
    },
    statsTitle: {
      ...typography.heading3,
      color: theme.text,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    statNumber: {
      ...typography.heading2,
      color: theme.primary,
      fontWeight: 'bold',
    },
    statLabel: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    settingsContainer: {
      backgroundColor: theme.surface,
      margin: spacing.md,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      ...shadows.small,
    },
    settingsTitle: {
      ...typography.heading3,
      color: theme.text,
      marginBottom: spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: spacing.md,
    },
    settingText: {
      ...typography.body,
      color: theme.text,
    },
    settingDescription: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: spacing.xs,
    },
    dangerButton: {
      backgroundColor: theme.error + '20',
    },
    dangerText: {
      color: theme.error,
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
      marginBottom: spacing.lg,
      color: theme.text,
      ...typography.body,
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

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userProfile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userStats}>
            {habits.length} habits • {stats.completedToday} completed today
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalStreak}</Text>
              <Text style={styles.statLabel}>Current{'\n'}Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{habits.length}</Text>
              <Text style={styles.statLabel}>Total{'\n'}Habits</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.round(stats.valueAdded)}%</Text>
              <Text style={styles.statLabel}>Life{'\n'}Value</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completedToday}</Text>
              <Text style={styles.statLabel}>Completed{'\n'}Today</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons 
                name={isDark ? "moon" : "sunny"} 
                size={24} 
                color={theme.primary} 
                style={styles.settingIcon}
              />
              <View>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Toggle between light and dark themes
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary + '40' }}
              thumbColor={isDark ? theme.primary : theme.background}
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingLeft}>
              <Ionicons 
                name="download" 
                size={24} 
                color={theme.primary} 
                style={styles.settingIcon}
              />
              <View>
                <Text style={styles.settingText}>Export Data</Text>
                <Text style={styles.settingDescription}>
                  Download your habits and progress data
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, styles.settingItemLast, styles.dangerButton]} 
            onPress={handleClearAllData}
          >
            <View style={styles.settingLeft}>
              <Ionicons 
                name="trash" 
                size={24} 
                color={theme.error} 
                style={styles.settingIcon}
              />
              <View>
                <Text style={[styles.settingText, styles.dangerText]}>Clear All Data</Text>
                <Text style={styles.settingDescription}>
                  Permanently delete all habits and progress
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.error} />
          </TouchableOpacity>
        </View>

        {/* Add some space at the bottom */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={theme.textSecondary}
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
