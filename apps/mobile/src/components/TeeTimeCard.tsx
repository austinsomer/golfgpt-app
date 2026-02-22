import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography, borders } from '../constants/theme';

export interface TeeTime {
  id: string;
  courseName: string;
  time: string;
  price: string;
  players: number;
  holes: number;
}

interface Props {
  teeTime: TeeTime;
  onPress?: () => void;
}

export function TeeTimeCard({ teeTime, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.courseName}>{teeTime.courseName}</Text>
        <Text style={styles.price}>{teeTime.price}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>{teeTime.time}</Text>
        <View style={styles.tags}>
          <Text style={styles.tag}>{teeTime.players} PLAYERS</Text>
          <Text style={styles.tagDot}>·</Text>
          <Text style={styles.tag}>{teeTime.holes} HOLES</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  courseName: {
    fontFamily: typography.serif,
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  price: {
    fontFamily: typography.bodyBold,
    fontSize: 17,
    color: colors.brandGreen,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tag: {
    fontFamily: typography.body,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  tagDot: {
    color: colors.borderDefault,
    fontSize: 12,
  },
});
