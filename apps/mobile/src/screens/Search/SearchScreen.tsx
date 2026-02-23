import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';
import { useSearchStore } from '../../store/searchStore';
import { useAppStore } from '../../store/appStore';
import { SearchStackParamList } from '../../navigation/SearchStack';
import { DatePickerButton } from '../../components/DatePickerButton';
import { SkeletonTeeTimeCard } from '../../components/Skeleton';
import { getCounties } from '../../api/courses';
import { getUpcomingTeeTimes, TeeTimeResult, formatTeeTime, formatPrice } from '../../api/teeTimes';
import { openInApp } from '../../lib/browser';

type Props = {
  navigation: NativeStackNavigationProp<SearchStackParamList, 'Search'>;
};

const PLAYER_OPTIONS = [1, 2, 3, 4];

function maxBookingDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d;
}

function QuickTeeTime({ result }: { result: TeeTimeResult }) {
  return (
    <TouchableOpacity
      style={styles.quickCard}
      onPress={() => openInApp(result.course?.booking_url)}
      activeOpacity={0.85}
    >
      <View style={styles.quickCardHeader}>
        <Text style={styles.quickCourseName} numberOfLines={1}>
          {result.course?.name ?? 'Unknown'}
        </Text>
        <Text style={styles.quickPrice}>{formatPrice(result.teeTime.price)}</Text>
      </View>
      <Text style={styles.quickTime}>{formatTeeTime(result.teeTime.datetime)}</Text>
    </TouchableOpacity>
  );
}

export function SearchScreen({ navigation }: Props) {
  const { date, players, county, timeOfDay, setDate, setPlayers, setCounty, setTimeOfDay } = useSearchStore();
  const { setShowOnboarding } = useAppStore();
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [counties, setCounties] = useState<string[]>([]);
  const [countiesLoading, setCountiesLoading] = useState(true);

  const [upcoming, setUpcoming] = useState<TeeTimeResult[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  // Load counties + upcoming tee times on mount
  useEffect(() => {
    getCounties()
      .then((data) => setCounties(['All', ...data]))
      .catch(() => setCounties(['All']))
      .finally(() => setCountiesLoading(false));
  }, []);

  const loadUpcoming = useCallback(async () => {
    setUpcomingLoading(true);
    try {
      const data = await getUpcomingTeeTimes(6);
      setUpcoming(data);
    } catch {
      setUpcoming([]);
    } finally {
      setUpcomingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUpcoming();
  }, [loadUpcoming]);

  const handleSearch = () => {
    navigation.navigate('TeeTimes', {
      date: date.toISOString().split('T')[0],
      players,
      county: !county || county === 'All' ? null : county,
      timeOfDay: timeOfDay ?? null,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowOnboarding(true)} activeOpacity={0.75}>
            <Image
              source={require('../../../assets/the-loop-wordmark.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.tagline}>NO VELVET ROPES.</Text>
        </View>

        <View style={styles.divider} />

        {/* Upcoming — quick glance */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>COMING UP</Text>
            <TouchableOpacity onPress={loadUpcoming}>
              <Ionicons name="refresh" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {upcomingLoading ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickScrollView}
              contentContainerStyle={styles.quickScroll}
              scrollEnabled={false}
            >
              {Array(3).fill(null).map((_, i) => (
                <View key={i} style={styles.quickSkeletonCard}>
                  <SkeletonTeeTimeCard />
                </View>
              ))}
            </ScrollView>
          ) : upcoming.length === 0 ? (
            <Text style={styles.noUpcomingText}>No upcoming tee times.</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickScrollView}
              contentContainerStyle={styles.quickScroll}
            >
              {upcoming.map((result) => (
                <QuickTeeTime key={result.teeTime.id} result={result} />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.divider} />

        {/* Search filters — collapsible */}
        <TouchableOpacity
          style={styles.filtersToggle}
          onPress={() => setFiltersExpanded(!filtersExpanded)}
          activeOpacity={0.8}
        >
          <Text style={styles.sectionLabel}>SEARCH FILTERS</Text>
          <Ionicons
            name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {filtersExpanded && (
          <>
            {/* Date */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>DATE</Text>
              <DatePickerButton
                value={date}
                onChange={setDate}
                minDate={new Date()}
                maxDate={maxBookingDate()}
              />
            </View>

            {/* Players */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>PLAYERS</Text>
              <View style={styles.playerGrid}>
                {PLAYER_OPTIONS.map((n, i) => (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.playerCell,
                      i === 0 && styles.playerCellFirst,
                      players === n && styles.playerCellActive,
                    ]}
                    onPress={() => setPlayers(n)}
                  >
                    <Text style={[styles.playerCellText, players === n && styles.playerCellTextActive]}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Time of Day */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>TIME</Text>
              <View style={styles.playerGrid}>
                {(['morning', 'afternoon', null] as const).map((option, i) => {
                  const label = option === 'morning' ? 'MORNING' : option === 'afternoon' ? 'AFTERNOON' : 'ANY';
                  const isActive = timeOfDay === option;
                  return (
                    <TouchableOpacity
                      key={label}
                      style={[
                        styles.playerCell,
                        i === 0 && styles.playerCellFirst,
                        isActive && styles.playerCellActive,
                      ]}
                      onPress={() => setTimeOfDay(option)}
                    >
                      <Text style={[styles.playerCellText, isActive && styles.playerCellTextActive]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* County */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>AREA</Text>
              {countiesLoading ? (
                <ActivityIndicator color={colors.brandGreen} size="small" style={{ marginVertical: spacing.md }} />
              ) : (
                <View style={styles.countyList}>
                  {counties.map((c, i) => {
                    const isActive = (county === null && c === 'All') || county === c;
                    const isLast = i === counties.length - 1;
                    return (
                      <TouchableOpacity
                        key={c}
                        style={[
                          styles.countyRow,
                          !isLast && styles.countyRowBorder,
                          isActive && styles.countyRowActive,
                        ]}
                        onPress={() => setCounty(c === 'All' ? null : c)}
                      >
                        <Text style={[styles.countyText, isActive && styles.countyTextActive]}>
                          {c.toUpperCase()}
                        </Text>
                        {isActive && <Text style={styles.checkmark}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.85}>
          <Ionicons name="search" size={14} color={colors.white} style={{ marginRight: spacing.xs }} />
          <Text style={styles.searchButtonText}>
            SEARCH TEE TIMES
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgCream },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { alignItems: 'center', paddingVertical: spacing.lg },
  logoImage: {
    width: 220,
    height: 220 / (2016 / 1134), // maintain aspect ratio
    marginBottom: spacing.xs,
  },
  tagline: {
    fontFamily: typography.body,
    fontSize: typography.tagline.fontSize,
    letterSpacing: typography.tagline.letterSpacing,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  divider: { height: 1, backgroundColor: colors.borderDefault, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontFamily: typography.bodyBold,
    fontSize: typography.sectionLabel.fontSize,
    letterSpacing: typography.sectionLabel.letterSpacing,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  noUpcomingText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  quickScrollView: { marginHorizontal: -spacing.lg },
  quickScroll: { gap: spacing.sm, paddingLeft: spacing.lg, paddingRight: spacing.lg },
  quickSkeletonCard: { width: 200 },
  quickCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  quickCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  quickCourseName: {
    fontFamily: typography.serif,
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.xs,
  },
  quickPrice: {
    fontFamily: typography.bodyBold,
    fontSize: 14,
    color: colors.brandGreen,
  },
  quickTime: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  filtersToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  filterSection: { marginBottom: spacing.lg },
  filterLabel: {
    fontFamily: typography.bodyBold,
    fontSize: typography.sectionLabel.fontSize,
    letterSpacing: typography.sectionLabel.letterSpacing,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  playerGrid: { flexDirection: 'row' },
  playerCell: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderLeftWidth: 0,
    backgroundColor: colors.surface,
  },
  playerCellFirst: { borderLeftWidth: borders.default },
  playerCellActive: { backgroundColor: colors.brandGreen, borderColor: colors.brandGreen },
  playerCellText: { fontFamily: typography.bodyBold, fontSize: typography.button.fontSize, letterSpacing: typography.button.letterSpacing, color: colors.textPrimary },
  playerCellTextActive: { color: colors.white },
  countyList: {
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  countyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  countyRowBorder: { borderBottomWidth: borders.default, borderBottomColor: colors.borderDefault },
  countyRowActive: { backgroundColor: colors.brandGreen },
  countyText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.button.fontSize,
    letterSpacing: typography.button.letterSpacing,
    color: colors.textPrimary,
  },
  countyTextActive: { color: colors.white },
  checkmark: { color: colors.white, fontSize: 14, fontWeight: '700' },
  searchButton: {
    backgroundColor: colors.brandGreen,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
    borderRadius: radius.sm,
  },
  searchButtonText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.button.fontSize,
    letterSpacing: typography.button.letterSpacing,
    color: colors.white,
    textTransform: 'uppercase',
  },
});
