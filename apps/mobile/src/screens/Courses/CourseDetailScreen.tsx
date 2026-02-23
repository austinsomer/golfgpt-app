import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';
import { formatCounty } from '../../lib/database.types';
import { CoursesStackParamList } from '../../navigation/CoursesStack';

type Props = NativeStackScreenProps<CoursesStackParamList, 'CourseDetail'>;

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function CourseDetailScreen({ route }: Props) {
  const { course } = route.params;

  const openBooking = () => {
    if (!course.booking_url) {
      Alert.alert('No booking link available for this course.');
      return;
    }
    Linking.openURL(course.booking_url).catch(() =>
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

        {/* Description */}
        {course.description && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <Text style={styles.description}>{course.description}</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={openBooking}
          activeOpacity={0.85}
        >
          <Text style={styles.bookButtonText}>BOOK A TEE TIME</Text>
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
