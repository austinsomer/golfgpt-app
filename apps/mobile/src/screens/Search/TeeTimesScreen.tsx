import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TeeTimeCard, TeeTime } from '../../components/TeeTimeCard';
import { colors, spacing, typography, borders } from '../../constants/theme';

const MOCK_TEE_TIMES: TeeTime[] = [
  {
    id: '1',
    courseName: 'Bonneville Golf Course',
    time: '8:00 AM',
    price: '$32',
    players: 4,
    holes: 18,
  },
  {
    id: '2',
    courseName: 'Mountain Dell Golf Course',
    time: '9:30 AM',
    price: '$45',
    players: 2,
    holes: 18,
  },
  {
    id: '3',
    courseName: 'River Oaks Golf Course',
    time: '11:00 AM',
    price: '$28',
    players: 3,
    holes: 18,
  },
  {
    id: '4',
    courseName: 'Wingpointe Golf Course',
    time: '12:30 PM',
    price: '$30',
    players: 4,
    holes: 18,
  },
  {
    id: '5',
    courseName: 'Stonebridge Golf Club',
    time: '2:00 PM',
    price: '$55',
    players: 2,
    holes: 18,
  },
];

export function TeeTimesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.resultCount}>{MOCK_TEE_TIMES.length} available</Text>
        <Text style={styles.filterSummary}>TODAY · 2 PLAYERS · ALL AREAS</Text>
      </View>
      <View style={styles.headerDivider} />
      <FlatList
        data={MOCK_TEE_TIMES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TeeTimeCard
            teeTime={item}
            onPress={() => {
              // TODO: open course booking URL in in-app browser
            }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
});
