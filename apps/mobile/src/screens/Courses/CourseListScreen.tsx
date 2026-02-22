import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../../constants/theme';
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
    description: 'Two 18-hole courses nestled in Parley\'s Canyon east of SLC.',
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
    description: 'Orem\'s premier public course with wide fairways and challenging greens.',
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
        <Text style={styles.heading}>Utah Golf Courses</Text>
        <Text style={styles.subheading}>{MOCK_COURSES.length} public courses · MVP scope</Text>
      </View>
      <FlatList
        data={MOCK_COURSES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseRow}
            onPress={() => navigation.navigate('CourseDetail', { course: item })}
            activeOpacity={0.8}
          >
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.courseMeta}>
                {item.county} County · {item.holes} holes · Par {item.par}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  courseMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg,
  },
  tag: {
    backgroundColor: '#E8F5EE',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
