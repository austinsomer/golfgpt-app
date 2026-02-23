import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography, borders } from '../constants/theme';
import { TeeTimeResult } from '../api/chat';
import { openInApp } from '../lib/browser';
import { formatTeeTime, formatPrice } from '../api/teeTimes';
import { formatCounty } from '../lib/database.types';

interface Props {
  results: TeeTimeResult[];
}

export function TeeTimeResultCards({ results }: Props) {
  if (!results.length) return null;

  return (
    <View style={styles.container}>
      {results.map((result) => (
        <TouchableOpacity
          key={result.id}
          style={styles.card}
          onPress={() => openInApp(result.course?.booking_url)}
          activeOpacity={0.85}
        >
          <View style={styles.cardTop}>
            <Text style={styles.courseName} numberOfLines={1}>
              {result.course?.name ?? 'Unknown Course'}
            </Text>
            <Text style={styles.price}>{formatPrice(result.price)}</Text>
          </View>

          <View style={styles.cardBottom}>
            <Text style={styles.time}>{formatTeeTime(result.datetime)}</Text>
            <View style={styles.tags}>
              {result.course?.county && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {formatCounty(result.course.county as Parameters<typeof formatCounty>[0]).toUpperCase()}
                  </Text>
                </View>
              )}
              {result.players_available != null && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{result.players_available} SPOTS</Text>
                </View>
              )}
              {result.holes != null && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{result.holes} HLS</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.bookCta}>TAP TO BOOK →</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.brandGreen,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  courseName: {
    fontFamily: typography.serif,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  price: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: colors.brandGreen,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontFamily: typography.bodyBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.bgCream,
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: 3,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  tagText: {
    fontFamily: typography.body,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  bookCta: {
    fontFamily: typography.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.brandGreen,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
  },
});
