import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../hooks/useTheme';
import { ChartData } from '../types';
import { typography, spacing, borderRadius, shadows } from '../utils/theme';

interface ProgressChartProps {
  data: ChartData;
  title: string;
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  title, 
  height = 220 
}) => {
  const { theme, isDark } = useTheme();

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    labelColor: (opacity = 1) => theme.text + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.primary,
      fill: theme.primary,
    },
    propsForBackgroundLines: {
      stroke: theme.border,
      strokeWidth: 1,
      strokeDasharray: '',
    },
    propsForLabels: {
      fontSize: 12,
    },
    fillShadowGradient: theme.primary,
    fillShadowGradientOpacity: 0.3,
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      margin: spacing.md,
      ...shadows.medium,
    },
    title: {
      ...typography.heading3,
      color: theme.text,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    noDataText: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      padding: spacing.xl,
    },
  });

  // Check if we have valid data
  const hasData = data.datasets.length > 0 && data.datasets[0].data.length > 0;

  if (!hasData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noDataText}>
          No data available yet. Start tracking your habits to see progress!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth - spacing.md * 4}
          height={height}
          chartConfig={chartConfig}
          bezier
          style={{
            borderRadius: borderRadius.md,
          }}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          withDots={true}
          withShadow={false}
          withScrollableDot={false}
          withInnerLines={true}
          withOuterLines={true}
          yAxisLabel=""
          yAxisSuffix="%"
          yAxisInterval={1}
          formatYLabel={(value) => `${Math.round(Number(value))}%`}
          segments={4}
        />
      </View>
    </View>
  );
};
