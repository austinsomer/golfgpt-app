import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';
import { formatCounty } from '../../lib/database.types';
import { CoursesStackParamList } from '../../navigation/CoursesStack';
import { searchTeeTimes, TeeTimeResult, formatTeeTime, formatPrice } from '../../api/teeTimes';

type Props = NativeStackScreenProps<CoursesStackParamList, 'CourseDetail'>;

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function TeeTimeSlot({
  result,
  onPress,
}: {
  result: TeeTimeResult;
  onPress: () => void;
}) {
  const { teeTime } = result;
  return (
    <TouchableOpacity style={styles.slotRow} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.slotTime}>{formatTeeTime(teeTime.datetime)}</Text>
      <View style={styles.slotMeta}>
        {teeTime.players_available && (
          <Text style={styles.slotTag}>{teeTime.players_available} SPOTS</Text>
        )}
        {teeTime.holes && (
          <Text style={styles.slotTag}>{teeTime.holes} HLS</Text>
        )}
      </View>
      <Text style={styles.slotPrice}>{formatPrice(teeTime.price)}</Text>
    </TouchableOpacity>
  );
}

export function CourseDetailScreen({ route }: Props) {
  const { course } = route.params;
  const today = new Date().toISOString().split('T')[0];

  const [teeTimes, setTeeTimes] = useState<TeeTimeResult[]>([]);
  const [teeTimesLoading, setTeeTimesLoading] = useState(true);

  const loadTeeTimes = useCallback(async () => {
    setTeeTimesLoading(true);
    try {
      const results = await searchTeeTimes({ date: today, players: 1 });
      // Filter to this course only
      setTeeTimes(results.filter((r) => r.course?.id === course.id));
    } catch {
      setTeeTimes([]);
    } finally {
      setTeeTimesLoading(false);
    }
  }, [course.id, today]);

  useEffect(() => {
    loadTeeTimes();
  }, [loadTeeTimes]);

  const openBooking = (url?: string | null) => {
    const target = url ?? course.booking_url;
    if (!target) {
      Alert.alert('No booking link available for this course.');
      return;
    }
    Linking.openURL(target).catch(() =>
      Alert.alert('Could not open booking page.'),
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.countyLabel}>
            {formatCounty(course.county).toUpperCase()} COUNTY
          </Text>
          <Text style={styles.courseName}>{course.name}</Text>
          {course.address && (
            <Text style={styles.address}>{course.address}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Stats */}
        <View style={styles.statsSection}>
          {course.holes && <StatRow label="HOLES" value={String(course.holes)} />}
          {course.holes && <View style={styles.statDivider} />}
          {course.par && <StatRow label="PAR" value={String(course.par)} />}
          {course.par && <View style={styles.statDivider} />}
          <StatRow label="TYPE" value="PUBLIC" />
          {course.booking_platform && (
            <>
              <View style={styles.statDivider} />
              <StatRow label="PLATFORM" value={course.booking_platform.toUpperCase()} />
            </>
          )}
        </View>

        <View style={styles.divider} />

        {/* Today's tee times */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AVAILABLE TODAY</Text>

          {teeTimesLoading ? (
            <ActivityIndicator color={colors.brandGreen} style={{ marginVertical: spacing.md }} />
          ) : teeTimes.length === 0 ? (
            <Text style={styles.noTimesText}>No tee times available today.</Text>
          ) : (
            <View style={styles.slotList}>
              {teeTimes.slice(0, 8).map((result, i) => (
                <React.Fragment key={result.teeTime.id}>
                  <TeeTimeSlot result={result} onPress={() => openBooking(result.course?.booking_url)} />
                  {i < Math.min(teeTimes.length, 8) - 1 && (
                    <View style={styles.slotDivider} />
                  )}
                </React.Fragment>
              ))}
              {teeTimes.length > 8 && (
                <TouchableOpacity
                  style={styles.showMoreRow}
                  onPress={() => openBooking()}
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

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => openBooking()}
          activeOpacity={0.85}
        >
          <Text style={styles.bookButtonText}>BOOK ON FOREUP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
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
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statDivider: {
    height: borders.default,
    backgroundColor: colors.borderDefault,
  },
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
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
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
  slotDivider: {
    height: borders.default,
    backgroundColor: colors.borderDefault,
  },
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
