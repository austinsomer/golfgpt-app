import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography, borders } from '../../constants/theme';
import { useSearchStore } from '../../store/searchStore';
import { SearchStackParamList } from '../../navigation/SearchStack';

type Props = {
  navigation: NativeStackNavigationProp<SearchStackParamList, 'Search'>;
};

const COUNTIES = ['ALL', 'SALT LAKE', 'UTAH COUNTY', 'SUMMIT', 'WASHINGTON'];
const PLAYER_OPTIONS = [1, 2, 3, 4];

export function SearchScreen({ navigation }: Props) {
  const { players, county, setPlayers, setCounty } = useSearchStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>UTAH TEE-UP</Text>
          <Text style={styles.tagline}>FIND YOUR FAIRWAY</Text>
        </View>

        <View style={styles.divider} />

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATE</Text>
          <TouchableOpacity style={styles.dateSelector}>
            <Text style={styles.dateSelectorText}>Today — Saturday, Feb 22</Text>
          </TouchableOpacity>
        </View>

        {/* Players — grid cells, sharp corners */}
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
                <Text style={[styles.playerCellText, players === n && styles.playerCellTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* County */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AREA</Text>
          <View style={styles.countyList}>
            {COUNTIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.countyRow, county === c && styles.countyRowActive]}
                onPress={() => setCounty(c)}
              >
                <Text style={[styles.countyText, county === c && styles.countyTextActive]}>
                  {c}
                </Text>
                {county === c && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('TeeTimes', {
            date: new Date().toISOString().split('T')[0],
            players,
            county: county === 'ALL' || !county ? null : county,
          })}
          activeOpacity={0.85}
        >
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
  dateSelector: {
    borderWidth: borders.default,
    borderColor: colors.borderDefault,
    borderRadius: radius.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  dateSelectorText: {
    fontFamily: typography.body,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
  // Sharp grid cells for player count
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
    borderRadius: 0,
  },
  playerCellLast: {
    borderRadius: 0,
  },
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
  // Time of day rows — slight rounding
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
    textTransform: 'uppercase',
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
