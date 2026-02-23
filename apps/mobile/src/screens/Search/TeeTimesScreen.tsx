import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TeeTimeCard, TeeTime } from '../../components/TeeTimeCard';
import {
  searchTeeTimes,
  getUpcomingTeeTimes,
  TeeTimeResult,
  formatPrice,
  formatTeeTime,
} from '../../api/teeTimes';
import { formatCounty } from '../../lib/database.types';
import { colors, spacing, typography, borders } from '../../constants/theme';
import { SearchStackParamList } from '../../navigation/SearchStack';

type Props = NativeStackScreenProps<SearchStackParamList, 'TeeTimes'>;

function toCardItem(result: TeeTimeResult): TeeTime {
  return {
    id: result.teeTime.id,
    courseName: result.course?.name ?? 'Unknown Course',
    time: formatTeeTime(result.teeTime.datetime),
    price: formatPrice(result.teeTime.price),
    players: result.teeTime.players_available ?? 4,
    holes: result.course?.holes ?? 18,
  };
}

function openBookingUrl(result: TeeTimeResult) {
  const url = result.course?.booking_url;
  if (!url) {
    Alert.alert('No booking link available for this course.');
    return;
  }
  Linking.openURL(url).catch(() =>
    Alert.alert('Could not open booking page. Try visiting the course website directly.'),
  );
}

export function TeeTimesScreen({ route }: Props) {
  const { date, players, county } = route.params;

  const [results, setResults] = useState<TeeTimeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchTeeTimes({ date, players, county: county ?? undefined });
      setResults(data);
    } catch (err) {
      setError('Could not load tee times. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [date, players, county]);

  useEffect(() => {
    load();
  }, [load]);

  const countyLabel = county
    ? (formatCounty(county as Parameters<typeof formatCounty>[0]) ?? county)
    : 'ALL AREAS';

  const filterSummary = [
    date === new Date().toISOString().split('T')[0] ? 'TODAY' : date,
    `${players} PLAYER${players !== 1 ? 'S' : ''}`,
    countyLabel.toUpperCase(),
  ].join(' · ');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.brandGreen} size="large" />
          <Text style={styles.loadingText}>Checking availability...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={load}>
            <Text style={styles.retryText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.resultCount}>
              {results.length === 0 ? 'No times available' : `${results.length} available`}
            </Text>
            <Text style={styles.filterSummary}>{filterSummary}</Text>
          </View>
          <View style={styles.headerDivider} />
          {results.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>No tee times found</Text>
              <Text style={styles.emptyBody}>
                Try a different date or expand your search filters.
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.teeTime.id}
              renderItem={({ item }) => (
                <TeeTimeCard
                  teeTime={toCardItem(item)}
                  onPress={() => openBookingUrl(item)}
                />
              )}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  resultCount: {
    fontFamily: typography.serif,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  filterSummary: {
    fontFamily: typography.body,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  headerDivider: {
    height: borders.default,
    backgroundColor: colors.borderDefault,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    borderWidth: borders.active,
    borderColor: colors.brandGreen,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 4,
  },
  retryText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.button.fontSize,
    letterSpacing: typography.button.letterSpacing,
    color: colors.brandGreen,
  },
  emptyTitle: {
    fontFamily: typography.serif,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
