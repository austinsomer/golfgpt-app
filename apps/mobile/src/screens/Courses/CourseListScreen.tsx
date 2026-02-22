import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, borders } from '../../constants/theme';
import { CoursesStackParamList } from '../../navigation/CoursesStack';

export interface Course {
  id: string;
  name: string;
  county: string;
  holes: number;
  par: number;
  description: string;
  bookingUrl: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    name: 'Bonneville Golf Course',
    county: 'Salt Lake',
    holes: 18,
    par: 72,
    description: 'A classic Salt Lake City municipal course with stunning Wasatch views.',
    bookingUrl: 'https://example.com/bonneville',
  },
  {
    id: '2',
    name: 'Mountain Dell Golf Course',
    county: 'Salt Lake',
    holes: 36,
    par: 71,
    description: "Two 18-hole courses nestled in Parley's Canyon east of SLC.",
    bookingUrl: 'https://example.com/mountain-dell',
  },
  {
    id: '3',
    name: 'River Oaks Golf Course',
    county: 'Salt Lake',
    holes: 18,
    par: 71,
    description: 'Affordable and walkable course in Sandy with nice mountain backdrops.',
    bookingUrl: 'https://example.com/river-oaks',
  },
  {
    id: '4',
    name: 'Sleepy Ridge Golf Course',
    county: 'Utah County',
    holes: 18,
    par: 72,
    description: "Orem's premier public course with wide fairways and challenging greens.",
    bookingUrl: 'https://example.com/sleepy-ridge',
  },
  {
    id: '5',
    name: 'Park City Golf Club',
    county: 'Summit',
    holes: 18,
    par: 72,
    description: 'High-altitude mountain golf with panoramic views of the Wasatch Back.',
    bookingUrl: 'https://example.com/park-city',
  },
];

type Props = {
  navigation: NativeStackNavigationProp<CoursesStackParamList, 'CourseList'>;
};

export function CourseListScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>UTAH COURSES</Text>
        <Text style={styles.subheading}>{MOCK_COURSES.length} public courses · MVP scope</Text>
      </View>
      <View style={styles.divider} />
      {/* Pure typographic list — no cards, per design system */}
      <FlatList
        data={MOCK_COURSES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseRow}
            onPress={() => navigation.navigate('CourseDetail', { course: item })}
            activeOpacity={0.7}
          >
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{item.name.toUpperCase()}</Text>
              <Text style={styles.courseMeta}>
                {item.county.toUpperCase()} · {item.holes} HOLES · PAR {item.par}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.borderDefault} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  heading: {
    fontFamily: typography.serif,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontFamily: typography.body,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  divider: {
    height: borders.default,
    backgroundColor: colors.borderDefault,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  courseInfo: {
    flex: 1,
  },
  // Bold uppercase course name — per favorites list spec
  courseName: {
    fontFamily: typography.serif,
    fontSize: 15,
    color: colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  courseMeta: {
    fontFamily: typography.body,
    fontSize: typography.caption.fontSize,
    letterSpacing: typography.caption.letterSpacing,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  separator: {
    height: borders.default,
    backgroundColor: colors.borderDefault,
    marginLeft: spacing.lg,
  },
});
