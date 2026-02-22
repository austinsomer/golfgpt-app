import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SearchStack } from './SearchStack';
import { CoursesStack } from './CoursesStack';
import { ChatScreen } from '../screens/Chat/ChatScreen';
import { colors, typography, borders } from '../constants/theme';

type TabParamList = {
  SearchTab: undefined;
  ChatTab: undefined;
  CoursesTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.brandGreen,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.bgCream,
            borderTopColor: colors.borderDefault,
            borderTopWidth: borders.default,
          },
          tabBarLabelStyle: {
            fontFamily: typography.bodyBold,
            fontSize: 10,
            letterSpacing: 1,
            textTransform: 'uppercase',
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            if (route.name === 'SearchTab') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'ChatTab') {
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
            } else {
              iconName = focused ? 'golf' : 'golf-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{ tabBarLabel: 'Tee Times' }}
        />
        <Tab.Screen
          name="ChatTab"
          component={ChatScreen}
          options={{ tabBarLabel: 'Caddy Bot' }}
        />
        <Tab.Screen
          name="CoursesTab"
          component={CoursesStack}
          options={{ tabBarLabel: 'Courses' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
