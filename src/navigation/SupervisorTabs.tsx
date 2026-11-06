import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  ClipboardList,
  FileCheck,
  Wrench,
  User as UserIcon,
} from 'lucide-react-native';
import { colors, typography } from '../theme/tokens';
import { SupervisorDashboardScreen } from '../screens/supervisor/SupervisorDashboardScreen';
import { InspectionsTabScreen } from '../screens/shared/InspectionsTabScreen';
import { CorrectiveActionScreen } from '../screens/supervisor/CorrectiveActionScreen';
import { ProfileTabScreen } from '../screens/shared/ProfileTabScreen';

const Tab = createBottomTabNavigator();

export const SupervisorTabs: React.FC = () => {
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
        name="OverviewTab"
        component={SupervisorDashboardScreen}
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: ({ color, focused }) => (
            <LayoutDashboard
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
        {() => <InspectionsTabScreen title="Factory Inspections" isSupervisorView />}
      </Tab.Screen>
      <Tab.Screen
        name="ReviewsTab"
        options={{
          tabBarLabel: 'Reviews',
          tabBarIcon: ({ color, focused }) => (
            <FileCheck
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 1.75}
            />
          ),
        }}
      >
        {() => <InspectionsTabScreen title="Supervisor Review Queue" isSupervisorView />}
      </Tab.Screen>
      <Tab.Screen
        name="ActionsTab"
        component={CorrectiveActionScreen}
        options={{
          tabBarLabel: 'Actions',
          tabBarIcon: ({ color, focused }) => (
            <Wrench
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

