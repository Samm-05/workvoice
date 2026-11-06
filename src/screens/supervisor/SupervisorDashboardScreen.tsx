import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Users,
  AlertOctagon,
  CheckCircle,
  Clock,
  Wrench,
  ChevronRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  HeaderBar,
  StatusChip,
  Chip,
  ListRow,
  IconButton,
} from '../../components';
import { useAuthStore } from '../../store/authStore';
import { useInspectionStore } from '../../store/inspectionStore';

export const SupervisorDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore((state) => state.user);
  const switchRole = useAuthStore((state) => state.switchRole);
  const reports = useInspectionStore((state) => state.reports);
  const correctiveActions = useInspectionStore((state) => state.correctiveActions);

  const pendingReports = reports.filter((r) => r.status === 'submitted');
  const criticalActions = correctiveActions.filter((a) => a.priority === 'critical');

  const handleOpenC12Report = () => {
    navigation.navigate('SupervisorReportReview', { reportId: 'insp-c12-001' });
  };

  const handleOpenAction = (actionId: string) => {
    navigation.navigate('CorrectiveAction', { actionId });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header with Switch to Technician Mode */}
      <HeaderBar
        title="Plant Operations"
        rightAction={
          <Pressable
            onPress={() => switchRole('technician')}
            style={styles.switchRolePill}
            accessibilityLabel="Switch to Technician Mode"
          >
            <Users size={14} color={colors.textPrimary} />
            <Text style={styles.switchRoleText}>Technician</Text>
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Supervisor Welcome Greeting */}
        <View style={styles.greetingHeader}>
          <Text style={styles.greetingTitle}>Supervisor Dashboard</Text>
          <Text style={styles.greetingMeta}>
            {user?.name || 'Sarah Jenkins'} · Assembly Lines 1, 2 & 3
          </Text>
        </View>

        {/* KPI Chips Row */}
        <View style={styles.kpiContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiScroll}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiTopRow}>
                <Clock size={16} color={colors.status.warning.text} />
                <Text style={styles.kpiCount}>{pendingReports.length}</Text>
              </View>
              <Text style={styles.kpiLabel}>Pending Reviews</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiTopRow}>
                <AlertOctagon size={16} color={colors.status.danger.text} />
                <Text style={styles.kpiCount}>{criticalActions.length}</Text>
              </View>
              <Text style={styles.kpiLabel}>Critical Issues</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiTopRow}>
                <Wrench size={16} color={colors.status.info.text} />
                <Text style={styles.kpiCount}>{correctiveActions.length}</Text>
              </View>
              <Text style={styles.kpiLabel}>Active Actions</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiTopRow}>
                <TrendingUp size={16} color={colors.status.success.text} />
                <Text style={styles.kpiCount}>98.2%</Text>
              </View>
              <Text style={styles.kpiLabel}>Shift Pass Rate</Text>
            </View>
          </ScrollView>
        </View>

        {/* Section: Pending Reviews (C-12 Highlight) */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pending Inspection Reviews</Text>
            <StatusChip status="warning" label={`${pendingReports.length} Require Review`} />
          </View>

          <View style={styles.listCard}>
            {pendingReports.map((report) => (
              <ListRow
                key={report.id}
                title={`${report.assetName} Shift Inspection`}
                meta={`Technician: ${report.technicianName} · ${report.createdAt}`}
                body={`Voice summary: 3 defects flagged (Drive pulley 2 lagging wear & 18mm belt tracking drift).`}
                status="warning"
                statusLabel="Awaiting Approval"
                onPress={handleOpenC12Report}
                showChevron
                imageUrl={report.photos[0]?.uri}
                imageActionLabel="Review report"
                onPressImageAction={handleOpenC12Report}
              />
            ))}
          </View>
        </View>

        {/* Section: Critical Issues & Corrective Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Critical Actions Assigned</Text>
            <Pressable
              onPress={() => navigation.navigate('CorrectiveAction', { actionId: 'act-c12-01' })}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>Manage</Text>
              <ChevronRight size={14} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.listCard}>
            {correctiveActions.map((act) => (
              <ListRow
                key={act.id}
                title={act.title}
                meta={`Assigned: ${act.assignedToTechnician} · Due: ${act.dueDate}`}
                body={act.description}
                status={act.priority === 'critical' ? 'danger' : 'warning'}
                statusLabel={act.status.toUpperCase()}
                onPress={() => handleOpenAction(act.id)}
                showChevron
              />
            ))}
          </View>
        </View>

        {/* Section: Inspection Activity Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Line Activity</Text>
          <View style={styles.listCard}>
            <ListRow
              title="Robotic Welder R-04"
              meta="Line 2 · Completed today 08:30 AM"
              body="Routine checklist passed 100%. Auto tip dresser calibrated."
              status="success"
              statusLabel="Approved"
            />
            <ListRow
              title="Hydraulic Press HP-01"
              meta="Line 1 · Completed yesterday"
              body="Pressure seal replacement completed; lock out cleared."
              status="info"
              statusLabel="Resolved"
            />
          </View>
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
    paddingBottom: 40,
  },
  greetingHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greetingTitle: {
    ...typography.title,
    fontSize: 22,
  },
  greetingMeta: {
    ...typography.meta,
    color: colors.textSecondary,
    marginTop: 2,
  },
  kpiContainer: {
    marginTop: 12,
  },
  kpiScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  kpiCard: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: 124,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kpiCount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  kpiLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  section: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.sectionHdr,
    color: colors.textPrimary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    ...typography.meta,
    color: colors.textSecondary,
  },
  listCard: {
    backgroundColor: colors.surface,
  },
  switchRolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  switchRoleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
