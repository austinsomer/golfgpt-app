import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { TeeTimesScreen } from '../screens/Search/TeeTimesScreen';
import { colors, typography } from '../constants/theme';

export type SearchStackParamList = {
  Search: undefined;
  TeeTimes: {
    date: string;      // YYYY-MM-DD
    players: number;
    county: string | null;
  };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgCream },
        headerTintColor: colors.brandGreen,
        headerTitleStyle: {
          fontFamily: typography.serif,
          fontSize: 16,
          color: colors.textPrimary,
        },
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
        options={{ title: 'Available Times', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}
