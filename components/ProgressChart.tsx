import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { 
  VictoryChart, 
  VictoryLine, 
  VictoryAxis, 
  VictoryLabel,
  VictoryContainer,
  VictoryTooltip
} from 'victory';
import { useTheme } from '../hooks/useTheme';
import { typography, spacing, borderRadius, shadows } from '../utils/theme';
import { format } from 'date-fns';

interface ChartDataPoint {
  x: Date;
  y: number;
}

interface ProgressChartProps {
  data: ChartDataPoint[];
  title: string;
  timeRange: 'week' | 'month' | 'year';
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

// Helper function to compute percentage safely
const computePercent = (completed: number, total: number): number => {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
};

// Helper function to get tick values for x-axis to prevent overlap
const getTickValues = (data: ChartDataPoint[], timeRange: 'week' | 'month' | 'year'): Date[] => {
  if (data.length === 0) return [];
  
  const maxTicks = timeRange === 'week' ? 7 : timeRange === 'month' ? 5 : 12;
  const step = Math.max(1, Math.floor(data.length / maxTicks));
  
  return data.filter((_, index) => index % step === 0).map(d => d.x);
};

// Helper function to format x-axis labels based on time range
const formatXAxisLabel = (date: Date, timeRange: 'week' | 'month' | 'year'): string => {
  switch (timeRange) {
    case 'week':
      return format(date, 'EEE d'); // Mon 3
    case 'month':
      return format(date, 'd MMM'); // 3 Jan
    case 'year':
      return format(date, 'MMM'); // Jan
    default:
      return format(date, 'MMM d');
  }
};

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  title, 
  timeRange,
  height = 220 
}) => {
  const { theme } = useTheme();

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
      height: height,
    },
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: height,
    },
    emptyStateText: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    emptyStateSubText: {
      ...typography.caption,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });

  // Check if we have valid data or all values are 0
  const hasData = data.length > 0;
  const hasProgress = hasData && data.some(d => d.y > 0);

  if (!hasData || !hasProgress) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No progress yet
          </Text>
          <Text style={styles.emptyStateSubText}>
            Start tracking today to see your progress chart!
          </Text>
        </View>
      </View>
    );
  }

  // Get tick values to prevent label overlap
  const tickValues = getTickValues(data, timeRange);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <VictoryChart
          width={screenWidth - spacing.md * 4}
          height={height}
          scale={{ x: 'time', y: 'linear' }}
          domain={{ y: [0, 100] }}
          domainPadding={{ y: 6 }}
        >
          {/* Y-axis with fixed 0-100% range */}
          <VictoryAxis
            dependentAxis
            tickValues={[0, 25, 50, 75, 100]}
            tickFormat={(t) => `${t}%`}
            style={{
              axis: { stroke: theme.border, strokeWidth: 1 },
              tickLabels: { 
                fill: theme.textSecondary, 
                fontSize: 12,
                fontFamily: 'System'
              },
              grid: { 
                stroke: theme.border, 
                strokeWidth: 0.5,
                strokeDasharray: '3,3'
              }
            }}
          />
          
          {/* X-axis with sparse labels to prevent overlap */}
          <VictoryAxis
            tickValues={tickValues}
            tickFormat={(date: any) => formatXAxisLabel(date, timeRange)}
            tickLabelComponent={
              <VictoryLabel 
                angle={timeRange === 'week' ? 0 : -35}
                textAnchor={timeRange === 'week' ? 'middle' : 'end'}
                style={{ 
                  fill: theme.textSecondary, 
                  fontSize: 12,
                  fontFamily: 'System'
                }}
              />
            }
            style={{
              axis: { stroke: theme.border, strokeWidth: 1 },
              tickLabels: { 
                fill: theme.textSecondary, 
                fontSize: 12,
                fontFamily: 'System'
              }
            }}
          />
          
          {/* Line with data */}
          <VictoryLine
            data={data}
            interpolation="monotoneX"
            style={{
              data: { 
                stroke: theme.primary, 
                strokeWidth: 3,
                strokeLinecap: 'round'
              }
            }}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 }
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
};
