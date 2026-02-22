import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { TeeTimeCard, TeeTime } from '../../components/TeeTimeCard';
import { colors, spacing } from '../../constants/theme';

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
        <Text style={styles.resultCount}>{MOCK_TEE_TIMES.length} tee times available</Text>
        <Text style={styles.dateLabel}>Today · 2 players · All Counties</Text>
      </View>
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  resultCount: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  dateLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
