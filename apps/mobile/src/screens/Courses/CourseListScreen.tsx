import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, borders } from '../../constants/theme';
import { getCourses } from '../../api/courses';
import { Course, formatCounty } from '../../lib/database.types';
import { CoursesStackParamList } from '../../navigation/CoursesStack';

// Re-export Course type so CoursesStack + CourseDetailScreen can import it from here
export type { Course };

type Props = {
  navigation: NativeStackNavigationProp<CoursesStackParamList, 'CourseList'>;
};

export function CourseListScreen({ navigation }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError('Could not load courses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>UTAH COURSES</Text>
        {!loading && !error && (
          <Text style={styles.subheading}>
            {courses.length} active course{courses.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
      <View style={styles.divider} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.brandGreen} size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={load}>
            <Text style={styles.retryText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={courses}
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
                  {formatCounty(item.county).toUpperCase()}
                  {item.holes ? ` · ${item.holes} HOLES` : ''}
                  {item.par ? ` · PAR ${item.par}` : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.borderDefault} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No courses listed yet.</Text>
            </View>
          }
        />
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
    flexGrow: 1,
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
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
  emptyText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textMuted,
  },
});
