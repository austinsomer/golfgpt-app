import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';
import { useSearchStore } from '../../store/searchStore';
import { SearchStackParamList } from '../../navigation/SearchStack';
import { DatePickerButton } from '../../components/DatePickerButton';
import { getCounties } from '../../api/courses';

type Props = {
  navigation: NativeStackNavigationProp<SearchStackParamList, 'Search'>;
};

const PLAYER_OPTIONS = [1, 2, 3, 4];

// Max date: 14 days out (typical ForeUp booking window)
function maxBookingDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d;
}

export function SearchScreen({ navigation }: Props) {
  const { date, players, county, setDate, setPlayers, setCounty } = useSearchStore();

  const [counties, setCounties] = useState<string[]>([]);
  const [countiesLoading, setCountiesLoading] = useState(true);

  useEffect(() => {
    getCounties()
      .then((data) => setCounties(['All', ...data]))
      .catch(() => setCounties(['All']))
      .finally(() => setCountiesLoading(false));
  }, []);

  const handleSearch = () => {
    navigation.navigate('TeeTimes', {
      date: date.toISOString().split('T')[0],
      players,
      county: !county || county === 'All' ? null : county,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>UTAH TEE-UP</Text>
          <Text style={styles.tagline}>FIND YOUR FAIRWAY</Text>
        </View>

        <View style={styles.divider} />

        {/* Date picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATE</Text>
          <DatePickerButton
            value={date}
            onChange={setDate}
            minDate={new Date()}
            maxDate={maxBookingDate()}
          />
        </View>

        {/* Players — sharp grid */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PLAYERS</Text>
          <View style={styles.playerGrid}>
            {PLAYER_OPTIONS.map((n, i) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.playerCell,
                  i === 0 && styles.playerCellFirst,
                  i === PLAYER_OPTIONS.length - 1 && styles.playerCellLast,
                  players === n && styles.playerCellActive,
                ]}
                onPress={() => setPlayers(n)}
              >
                <Text
                  style={[styles.playerCellText, players === n && styles.playerCellTextActive]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* County — dynamic from DB */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AREA</Text>
          {countiesLoading ? (
            <View style={styles.countiesLoading}>
              <ActivityIndicator color={colors.brandGreen} size="small" />
            </View>
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

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.85}>
          <Text style={styles.searchButtonText}>SEARCH TEE TIMES</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  logo: {
    fontFamily: typography.serif,
    fontSize: typography.logo.fontSize,
    letterSpacing: typography.logo.letterSpacing,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  tagline: {
    fontFamily: typography.body,
    fontSize: typography.tagline.fontSize,
    letterSpacing: typography.tagline.letterSpacing,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDefault,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: typography.bodyBold,
    fontSize: typography.sectionLabel.fontSize,
    letterSpacing: typography.sectionLabel.letterSpacing,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  playerGrid: {
    flexDirection: 'row',
  },
  playerCell: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderLeftWidth: 0,
    backgroundColor: colors.surface,
  },
  playerCellFirst: {
    borderLeftWidth: borders.default,
  },
  playerCellLast: {},
  playerCellActive: {
    backgroundColor: colors.brandGreen,
    borderColor: colors.brandGreen,
  },
  playerCellText: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  playerCellTextActive: {
    color: colors.white,
  },
  countiesLoading: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
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
  countyRowBorder: {
    borderBottomWidth: borders.default,
    borderBottomColor: colors.borderDefault,
  },
  countyRowActive: {
    backgroundColor: colors.brandGreen,
  },
  countyText: {
    fontFamily: typography.bodyBold,
    fontSize: typography.button.fontSize,
    letterSpacing: typography.button.letterSpacing,
    color: colors.textPrimary,
  },
  countyTextActive: {
    color: colors.white,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  searchButton: {
    backgroundColor: colors.brandGreen,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
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
