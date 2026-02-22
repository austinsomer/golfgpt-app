import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CourseListScreen, Course } from '../screens/Courses/CourseListScreen';
import { CourseDetailScreen } from '../screens/Courses/CourseDetailScreen';
import { colors } from '../constants/theme';

export type CoursesStackParamList = {
  CourseList: undefined;
  CourseDetail: { course: Course };
};

const Stack = createNativeStackNavigator<CoursesStackParamList>();

export function CoursesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }) => ({ title: route.params.course.name })}
      />
    </Stack.Navigator>
  );
}
