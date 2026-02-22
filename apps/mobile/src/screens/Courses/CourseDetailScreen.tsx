import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course name hero */}
        <View style={styles.heroSection}>
          <Text style={styles.countyLabel}>{course.county.toUpperCase()} COUNTY</Text>
          <Text style={styles.courseName}>{course.name}</Text>
        </View>

        <View style={styles.divider} />

        {/* Stats — typographic, no card */}
        <View style={styles.statsSection}>
          <StatRow label="HOLES" value={String(course.holes)} />
          <View style={styles.statDivider} />
          <StatRow label="PAR" value={String(course.par)} />
          <View style={styles.statDivider} />
          <StatRow label="TYPE" value="PUBLIC" />
          <View style={styles.statDivider} />
          <StatRow label="PLATFORM" value="FOREUP" />
        </View>

        <View style={styles.divider} />

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            Alert.alert(
              'Book a Tee Time',
              `Opens ${course.name}'s booking page. (In-app browser coming in Phase 2.)`,
              [{ text: 'Got it' }],
            )
          }
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
