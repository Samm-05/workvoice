import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  ClipboardList,
  FileText,
  Cpu,
  User as UserIcon,
} from 'lucide-react-native';
import { colors, typography } from '../theme/tokens';
import { TechnicianHomeScreen } from '../screens/technician/TechnicianHomeScreen';
import { InspectionsTabScreen } from '../screens/shared/InspectionsTabScreen';
import { AssetsTabScreen } from '../screens/shared/AssetsTabScreen';
import { ProfileTabScreen } from '../screens/shared/ProfileTabScreen';

const Tab = createBottomTabNavigator();

export const TechnicianTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
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
              strokeWidth={focused ? 2.5 : 1.75}
            />
          ),
        }}
      />
      <Tab.Screen
        name="InspectionsTab"
        options={{
          tabBarLabel: 'Inspections',
          tabBarIcon: ({ color, focused }) => (
            <ClipboardList
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 1.75}
            />
          ),
        }}
      >
        {() => <InspectionsTabScreen title="Technician Inspections" />}
      </Tab.Screen>
      <Tab.Screen
        name="ReportsTab"
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <FileText
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 1.75}
            />
          ),
        }}
      >
        {() => <InspectionsTabScreen title="Submitted Reports" />}
      </Tab.Screen>
      <Tab.Screen
        name="AssetsTab"
        component={AssetsTabScreen}
        options={{
          tabBarLabel: 'Assets',
          tabBarIcon: ({ color, focused }) => (
            <Cpu
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 1.75}
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
              strokeWidth={focused ? 2.5 : 1.75}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 0,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    ...typography.caption,
    marginTop: 2,
  },
});

