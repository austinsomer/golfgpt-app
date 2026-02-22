import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SearchStack } from './SearchStack';
import { CoursesStack } from './CoursesStack';
import { ChatScreen } from '../screens/Chat/ChatScreen';
import { colors } from '../constants/theme';

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
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
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
          options={{ tabBarLabel: 'Chat' }}
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
