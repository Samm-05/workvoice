import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  Shield,
  Wifi,
  Volume2,
  Database,
  LogOut,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Settings,
  Mic,
  Sliders,
} from 'lucide-react-native';
import { colors, radii, typography, spacing, elevation } from '../../theme/tokens';
import {
  AppHeader,
  Avatar,
  StatusPill,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import { useAuthStore } from '../../store/authStore';
import { useInspectionStore } from '../../store/inspectionStore';
import { apiConfig } from '../../services/api';

export const ProfileTabScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const switchRole = useAuthStore((state) => state.switchRole);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useInspectionStore((state) => state.showToast);

  const [offlineMode, setOfflineMode] = useState(apiConfig.simulateOffline);
  const [latencySim, setLatencySim] = useState(apiConfig.simulateLatency);

  const handleToggleOffline = (val: boolean) => {
    setOfflineMode(val);
    apiConfig.simulateOffline = val;
    showToast(val ? 'Offline mode enabled (local queue active)' : 'Online mode restored');
  };

  const handleToggleLatency = (val: boolean) => {
    setLatencySim(val);
    apiConfig.simulateLatency = val;
  };

  const handleToggleRole = () => {
    const nextRole = role === 'technician' ? 'supervisor' : 'technician';
    switchRole(nextRole);
    showToast(`Switched active role to ${nextRole.toUpperCase()}`);
  };

  const handleSignOut = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* AppHeader: fixed 56px below status bar, left title */}
      <AppHeader
        title="Profile"
        subtitle="Account settings & device configuration"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <Avatar initials={user?.avatarInitials || 'SM'} size={56} />
          <View style={styles.userInfoCol}>
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name || 'Sam Miller'}
              </Text>
              <StatusPill
                status={role === 'supervisor' ? 'info' : 'success'}
                label={role.toUpperCase()}
              />
            </View>
            <Text style={styles.userTitle} numberOfLines={1}>
              {user?.title || 'Senior Reliability Technician'}
            </Text>
            <Text style={styles.userLine} numberOfLines={1}>
              {user?.email || 'sam.miller@workvoice.internal'}
            </Text>
          </View>
        </View>

        {/* Role Switcher Banner */}
        <View style={styles.roleCard}>
          <View style={styles.roleHeaderRow}>
            <View style={styles.roleIconWrap}>
              <Sparkles size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.roleCardTitle}>
                Active Role: {role === 'technician' ? 'Technician' : 'Supervisor'}
              </Text>
              <Text style={styles.roleCardSubtitle}>
                {role === 'technician'
                  ? 'Switch to Supervisor mode to approve reports and assign corrective actions.'
                  : 'Switch to Technician mode to record voice inspections and checklist data.'}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleToggleRole}
            hitSlop={6}
            android_ripple={{ color: elevation.ripple }}
            style={styles.switchRoleButton}
            accessibilityRole="button"
            accessibilityLabel="Switch active role"
          >
            <Text style={styles.switchRoleBtnText}>
              Switch to {role === 'technician' ? 'Supervisor Mode' : 'Technician Mode'}
            </Text>
            <ChevronRight size={16} color={colors.primary} />
          </Pressable>
        </View>

        {/* Section: Settings (Grouped List) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Field Operations Settings</Text>
          <View style={styles.settingsGroup}>
            {/* Setting 1: Offline Mode */}
            <View style={styles.settingItem}>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>Simulate Offline Mode</Text>
                <Text style={styles.settingDescription}>
                  Queue voice notes and reports locally without cellular connection
                </Text>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={handleToggleOffline}
                thumbColor={offlineMode ? colors.primary : '#FFFFFF'}
                trackColor={{ false: colors.border, true: colors.primaryMuted }}
              />
            </View>

            <View style={styles.settingDivider} />

            {/* Setting 2: STT Speech Latency */}
            <View style={styles.settingItem}>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>Speech-to-Text Latency Simulation</Text>
                <Text style={styles.settingDescription}>
                  Simulate realistic 1.4s AI speech processing in field conditions
                </Text>
              </View>
              <Switch
                value={latencySim}
                onValueChange={handleToggleLatency}
                thumbColor={latencySim ? colors.primary : '#FFFFFF'}
                trackColor={{ false: colors.border, true: colors.primaryMuted }}
              />
            </View>
          </View>
        </View>

        {/* Section: Device & System Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Device & Storage</Text>
          <View style={styles.settingsGroup}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Platform Version</Text>
              <Text style={styles.infoValue}>WorkVoice v1.1.0</Text>
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Persistence Engine</Text>
              <Text style={styles.infoValue}>AsyncStorage / Zustand</Text>
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Audio Recognition</Text>
              <Text style={styles.infoValue}>WorkVoice Industrial STT v4</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <SecondaryButton
            label="Sign Out"
            icon={<LogOut size={16} color={colors.text} />}
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.cardPadding,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: spacing.sectionGap,
  },
  userInfoCol: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  userName: {
    ...typography.cardTitle,
    fontSize: 17,
    flex: 1,
    flexShrink: 1,
  },
  userTitle: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userLine: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sectionGap,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  roleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleCardTitle: {
    ...typography.cardTitle,
    fontSize: 15,
  },
  roleCardSubtitle: {
    ...typography.caption,
    marginTop: 4,
  },
  switchRoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.button,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  switchRoleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.sectionGap,
  },
  sectionHeader: {
    ...typography.sectionTitle,
    marginBottom: 10,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.cardPadding,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  settingTextCol: {
    flex: 1,
    minWidth: 0,
  },
  settingTitle: {
    ...typography.cardTitle,
    fontSize: 14,
  },
  settingDescription: {
    ...typography.caption,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoKey: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  signOutContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
});
