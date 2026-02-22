import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../../constants/theme';
import { useSearchStore } from '../../store/searchStore';
import { SearchStackParamList } from '../../navigation/SearchStack';

type Props = {
  navigation: NativeStackNavigationProp<SearchStackParamList, 'Search'>;
};

const COUNTIES = ['All Counties', 'Salt Lake', 'Utah County', 'Summit', 'Washington'];
const PLAYER_OPTIONS = [1, 2, 3, 4];

export function SearchScreen({ navigation }: Props) {
  const { players, county, setPlayers, setCounty } = useSearchStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Find Tee Times</Text>
        <Text style={styles.subheading}>Utah public golf courses — all in one place.</Text>

        {/* Date selector placeholder */}
        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.selector}>
            <Text style={styles.selectorText}>Today — Saturday, Feb 22</Text>
          </TouchableOpacity>
        </View>

        {/* Players */}
        <View style={styles.section}>
          <Text style={styles.label}>Players</Text>
          <View style={styles.chipRow}>
            {PLAYER_OPTIONS.map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.chip, players === n && styles.chipActive]}
                onPress={() => setPlayers(n)}
              >
                <Text style={[styles.chipText, players === n && styles.chipTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* County */}
        <View style={styles.section}>
          <Text style={styles.label}>County</Text>
          <View style={styles.chipRow}>
            {COUNTIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, county === c && styles.chipActive]}
                onPress={() => setCounty(c)}
              >
                <Text style={[styles.chipText, county === c && styles.chipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('TeeTimes')}
        >
          <Text style={styles.searchButtonText}>Search Tee Times</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  selector: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  selectorText: {
    fontSize: 15,
    color: colors.text,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
