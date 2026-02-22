import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { TeeTimesScreen } from '../screens/Search/TeeTimesScreen';
import { colors } from '../constants/theme';

export type SearchStackParamList = {
  Search: undefined;
  TeeTimes: undefined;
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
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
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TeeTimes"
        component={TeeTimesScreen}
        options={{ title: 'Available Tee Times' }}
      />
    </Stack.Navigator>
  );
}
