import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';
import { formatCounty } from '../../lib/database.types';
import { CoursesStackParamList } from '../../navigation/CoursesStack';
import { searchTeeTimes, TeeTimeResult, formatTeeTime, formatPrice } from '../../api/teeTimes';
import { Skeleton } from '../../components/Skeleton';
import { openInApp } from '../../lib/browser';

type Props = NativeStackScreenProps<CoursesStackParamList, 'CourseDetail'>;

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDayLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function SlotRow({ result }: { result: TeeTimeResult }) {
  return (
    <TouchableOpacity
      style={styles.slotRow}
      onPress={() => openInApp(result.course?.booking_url)}
      activeOpacity={0.8}
    >
      <Text style={styles.slotTime}>{formatTeeTime(result.teeTime.datetime)}</Text>
      <View style={styles.slotMeta}>
        {result.teeTime.players_available != null && (
          <Text style={styles.slotTag}>{result.teeTime.players_available} SPOTS</Text>
        )}
        {result.teeTime.holes != null && (
          <Text style={styles.slotTag}>{result.teeTime.holes} HLS</Text>
        )}
      </View>
      <Text style={styles.slotPrice}>{formatPrice(result.teeTime.price)}</Text>
    </TouchableOpacity>
  );
}

export function CourseDetailScreen({ route }: Props) {
  const { course } = route.params;

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [teeTimes, setTeeTimes] = useState<TeeTimeResult[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 13);

  const canGoPrev = selectedDate > today;
  const canGoNext = selectedDate < maxDate;

  const shiftDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + days);
    setSelectedDate(next);
  };

  const loadTeeTimes = useCallback(async () => {
    setLoading(true);
    try {
      const results = await searchTeeTimes({
        date: toDateString(selectedDate),
        players: 1,
      });
      setTeeTimes(results.filter((r) => r.course?.id === course.id));
    } catch {
      setTeeTimes([]);
    } finally {
      setLoading(false);
    }
  }, [course.id, selectedDate]);

  useEffect(() => {
    loadTeeTimes();
  }, [loadTeeTimes]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.countyLabel}>
            {formatCounty(course.county).toUpperCase()} COUNTY
          </Text>
          <Text style={styles.courseName}>{course.name}</Text>
          {course.address ? (
            <TouchableOpacity
              onPress={() => {
                const query = encodeURIComponent(course.address!);
                const url = Platform.OS === 'ios'
                  ? `maps:?q=${query}`
                  : `geo:0,0?q=${query}`;
                Linking.openURL(url).catch(() =>
                  Linking.openURL(`https://maps.google.com/?q=${query}`)
                );
              }}
            >
              <Text style={[styles.address, styles.addressTappable]}>{course.address}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                const query = encodeURIComponent(course.name + ' golf course Utah');
                const url = Platform.OS === 'ios'
                  ? `maps:?q=${query}`
                  : `geo:0,0?q=${query}`;
                Linking.openURL(url).catch(() =>
                  Linking.openURL(`https://maps.google.com/?q=${query}`)
                );
              }}
            >
              <Text style={[styles.address, styles.addressTappable]}>View in Maps ↗</Text>
            </TouchableOpacity>
          )}
          {course.phone && (
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${course.phone}`)}>
              <Text style={[styles.address, styles.addressTappable]}>{course.phone}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        {/* Stats */}
        <View style={styles.statsSection}>
          {course.holes != null && (
            <><StatRow label="HOLES" value={String(course.holes)} /><View style={styles.statDivider} /></>
          )}
          <StatRow label="PAR" value={course.par != null ? String(course.par) : '—'} />
          <View style={styles.statDivider} />
          <StatRow
            label="YARDS"
            value={course.course_length_yards != null ? `${course.course_length_yards.toLocaleString()} yds` : '—'}
          />
          <View style={styles.statDivider} />
          <StatRow label="TYPE" value="PUBLIC" />
        </View>

        <View style={styles.divider} />

        {/* Tee time availability with day navigator */}
        <View style={styles.section}>
          {/* Day navigator */}
          <View style={styles.dayNav}>
            <TouchableOpacity
              style={[styles.navArrow, !canGoPrev && styles.navArrowDisabled]}
              onPress={() => canGoPrev && shiftDate(-1)}
              disabled={!canGoPrev}
            >
              <Ionicons name="chevron-back" size={18} color={canGoPrev ? colors.brandGreen : colors.borderDefault} />
            </TouchableOpacity>

            <View style={styles.dayLabelWrap}>
              <Text style={styles.dayLabel}>{formatDayLabel(selectedDate)}</Text>
              {formatDayLabel(selectedDate) !== toDateString(selectedDate) && (
                <Text style={styles.dayDate}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.navArrow, !canGoNext && styles.navArrowDisabled]}
              onPress={() => canGoNext && shiftDate(1)}
              disabled={!canGoNext}
            >
              <Ionicons name="chevron-forward" size={18} color={canGoNext ? colors.brandGreen : colors.borderDefault} />
            </TouchableOpacity>
          </View>

          {/* Slot list */}
          {loading ? (
            <View style={styles.skeletonList}>
              {Array(4).fill(null).map((_, i) => (
                <React.Fragment key={i}>
                  <View style={styles.skeletonSlot}>
                    <Skeleton width={60} height={13} />
                    <Skeleton width={80} height={11} />
                    <Skeleton width={35} height={13} />
                  </View>
                  {i < 3 && <View style={styles.slotDivider} />}
                </React.Fragment>
              ))}
            </View>
          ) : teeTimes.length === 0 ? (
            <Text style={styles.noTimesText}>No tee times available this day.</Text>
          ) : (
            <View style={styles.slotList}>
              {teeTimes.slice(0, 8).map((result, i) => (
                <React.Fragment key={result.teeTime.id}>
                  <SlotRow result={result} />
                  {i < Math.min(teeTimes.length, 8) - 1 && <View style={styles.slotDivider} />}
                </React.Fragment>
              ))}
              {teeTimes.length > 8 && (
                <TouchableOpacity
                  style={styles.showMoreRow}
                  onPress={() => openInApp(course.booking_url)}
                >
                  <Text style={styles.showMoreText}>
                    +{teeTimes.length - 8} MORE — VIEW ALL ON FOREUP ›
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Description */}
        {course.description && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ABOUT</Text>
              <Text style={styles.description}>{course.description}</Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => openInApp(course.booking_url)}
          activeOpacity={0.85}
        >
          <Text style={styles.bookButtonText}>BOOK ON FOREUP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgCream },
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  countyLabel: {
    fontFamily: typography.body,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.brandGreen,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  courseName: {
    fontFamily: typography.serif,
    fontSize: 28,
    color: colors.textPrimary,
    lineHeight: 34,
  },
  address: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  addressTappable: {
    color: colors.brandGreen,
    textDecorationLine: 'underline',
  },
  divider: {
    height: borders.default,
    backgroundColor: colors.borderDefault,
    marginHorizontal: spacing.lg,
  },
  statsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  statDivider: { height: borders.default, backgroundColor: colors.borderDefault },
  statLabel: {
    fontFamily: typography.body,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: typography.bodyBold,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sectionLabel: {
    fontFamily: typography.bodyBold,
    fontSize: typography.sectionLabel.fontSize,
    letterSpacing: typography.sectionLabel.letterSpacing,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  // Day navigator
  dayNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navArrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  navArrowDisabled: {
    opacity: 0.4,
  },
  dayLabelWrap: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    fontFamily: typography.serif,
    fontSize: 17,
    color: colors.textPrimary,
  },
  dayDate: {
    fontFamily: typography.body,
    fontSize: typography.caption.fontSize,
    letterSpacing: 0.5,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  // Slot list
  noTimesText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  slotList: {
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  skeletonList: {
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
  },
  skeletonSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  slotTime: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: colors.textPrimary,
    width: 72,
  },
  slotMeta: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  slotTag: {
    fontFamily: typography.body,
    fontSize: typography.caption.fontSize,
    letterSpacing: 0.5,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  slotPrice: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: colors.brandGreen,
  },
  slotDivider: { height: borders.default, backgroundColor: colors.borderDefault },
  showMoreRow: {
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: borders.default,
    borderTopColor: colors.borderDefault,
  },
  showMoreText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.brandGreen,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: typography.body,
    fontSize: typography.bodyLg.fontSize,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: borders.default,
    borderTopColor: colors.borderDefault,
    backgroundColor: colors.bgCream,
  },
  bookButton: {
    backgroundColor: colors.brandGreen,
    borderRadius: radius.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  bookButtonText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.button.fontSize,
    letterSpacing: typography.button.letterSpacing,
    color: colors.white,
    textTransform: 'uppercase',
  },
});
