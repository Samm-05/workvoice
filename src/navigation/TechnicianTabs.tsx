import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  ClipboardList,
  FileCheck2,
  Cpu,
  User as UserIcon,
} from 'lucide-react-native';
import { colors, typography } from '../theme/tokens';
import { TechnicianHomeScreen } from '../screens/technician/TechnicianHomeScreen';
import { InspectionsTabScreen } from '../screens/shared/InspectionsTabScreen';
import { ReportsTabScreen } from '../screens/shared/ReportsTabScreen';
import { AssetsTabScreen } from '../screens/shared/AssetsTabScreen';
import { ProfileTabScreen } from '../screens/shared/ProfileTabScreen';

const Tab = createBottomTabNavigator();

export const TechnicianTabs: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={TechnicianHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={22}
              color={color}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />
      <Tab.Screen
        name="InspectionsTab"
        component={InspectionsTabScreen}
        options={{
          tabBarLabel: 'Inspections',
          tabBarIcon: ({ color, focused }) => (
            <ClipboardList
              size={22}
              color={color}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsTabScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <FileCheck2
              size={22}
              color={color}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AssetsTab"
        component={AssetsTabScreen}
        options={{
          tabBarLabel: 'Assets',
          tabBarIcon: ({ color, focused }) => (
            <Cpu
              size={22}
              color={color}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTabScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <UserIcon
              size={22}
              color={color}
              strokeWidth={focused ? 2.2 : 1.75}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    marginTop: 2,
  },
});
