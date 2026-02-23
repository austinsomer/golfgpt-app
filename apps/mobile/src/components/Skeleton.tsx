import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = radius.sm, style }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.bone,
        { width: width as number, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

// Composable skeleton rows for common patterns
export function SkeletonCourseRow() {
  return (
    <View style={styles.courseRow}>
      <View style={styles.courseRowContent}>
        <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={11} />
      </View>
    </View>
  );
}

export function SkeletonTeeTimeCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Skeleton width="55%" height={14} />
        <Skeleton width={40} height={16} />
      </View>
      <View style={styles.cardMeta}>
        <Skeleton width={60} height={11} />
        <Skeleton width={90} height={11} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bone: {
    backgroundColor: colors.borderDefault,
  },
  courseRow: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  courseRowContent: {
    gap: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
