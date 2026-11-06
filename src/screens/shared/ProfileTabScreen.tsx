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
} from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  HeaderBar,
  Avatar,
  PrimaryButton,
  SecondaryButton,
  StatusChip,
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
    showToast(`Switched active journey to ${nextRole.toUpperCase()}`);
  };

  const handleSignOut = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <HeaderBar title="Profile & Settings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Avatar initials={user?.avatarInitials || 'SM'} size={54} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Sam Miller'}</Text>
            <Text style={styles.userTitle}>{user?.title || 'Lead Technician'}</Text>
            <Text style={styles.userLine}>{user?.line || 'Line 2 - Assembly'}</Text>
          </View>
          <StatusChip
            status={role === 'supervisor' ? 'info' : 'success'}
            label={role.toUpperCase()}
          />
        </View>

        {/* Quick Role Switcher Banner */}
        <View style={styles.roleSwitchCard}>
          <View style={styles.roleSwitchLeft}>
            <Sparkles size={18} color={colors.primary} />
            <View>
              <Text style={styles.roleSwitchTitle}>
                {role === 'technician' ? 'Switch to Supervisor Flow' : 'Switch to Technician Flow'}
              </Text>
              <Text style={styles.roleSwitchDesc}>
                {role === 'technician'
                  ? 'Access approval queues and corrective actions'
                  : 'Record inspections and capture field evidence'}
              </Text>
            </View>
          </View>
          <PrimaryButton
            label={`Switch to ${role === 'technician' ? 'Supervisor' : 'Technician'}`}
            onPress={handleToggleRole}
            style={{ marginTop: 12 }}
          />
        </View>

        {/* App Settings Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Field Operations Settings</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Simulate Offline Mode</Text>
              <Text style={styles.settingMeta}>Queue inspections locally in storage</Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={handleToggleOffline}
              thumbColor={offlineMode ? colors.primary : colors.surfaceMuted}
              trackColor={{ false: colors.border, true: '#9A9AA0' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Simulate Network Latency</Text>
              <Text style={styles.settingMeta}>Realistic STT speech-to-text delay</Text>
            </View>
            <Switch
              value={latencySim}
              onValueChange={handleToggleLatency}
              thumbColor={latencySim ? colors.primary : colors.surfaceMuted}
              trackColor={{ false: colors.border, true: '#9A9AA0' }}
            />
          </View>
        </View>

        {/* About App Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>System Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>App Version</Text>
            <Text style={styles.infoVal}>WorkVoice v1.0.0 (Expo SDK 58)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Storage Backend</Text>
            <Text style={styles.infoVal}>AsyncStorage + Zustand Persist</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>AI Speech Engine</Text>
            <Text style={styles.infoVal}>WorkVoice Industrial STT v4</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutWrapper}>
          <SecondaryButton
            label="Sign Out"
            icon={<LogOut size={16} color={colors.textPrimary} />}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    padding: 16,
    borderRadius: 16,
    gap: 14,
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.title,
    fontSize: 18,
    color: colors.textPrimary,
  },
  userTitle: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userLine: {
    ...typography.meta,
    color: colors.textTertiary,
    marginTop: 2,
  },
  roleSwitchCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  roleSwitchLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  roleSwitchTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  roleSwitchDesc: {
    ...typography.meta,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.sectionHdr,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  settingLabel: {
    ...typography.bodyStrong,
    fontSize: 14,
  },
  settingMeta: {
    ...typography.meta,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoKey: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoVal: {
    ...typography.bodyStrong,
    fontSize: 13,
    color: colors.textPrimary,
  },
  signOutWrapper: {
    marginTop: 8,
    marginBottom: 20,
  },
});
