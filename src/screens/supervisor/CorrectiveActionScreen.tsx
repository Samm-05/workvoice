import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  CheckCircle,
  Clock,
  User,
  AlertTriangle,
  ArrowRight,
  Plus,
  Shield,
  Calendar,
  History,
  Check,
} from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  HeaderBar,
  PrimaryButton,
  SecondaryButton,
  Chip,
  StatusChip,
  BottomSheet,
  IconButton,
} from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { useAuthStore } from '../../store/authStore';
import { ActionPriority, ActionStatus, CorrectiveAction } from '../../types';

const statusSteps: ActionStatus[] = [
  'open',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
];

const priorityLevels: ActionPriority[] = ['critical', 'high', 'medium', 'low'];

export const CorrectiveActionScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const actionId = route.params?.actionId || 'act-c12-01';
  const shouldOpenAssignSheet = route.params?.openAssignSheet || false;

  const user = useAuthStore((state) => state.user);
  const correctiveActions = useInspectionStore((state) => state.correctiveActions);
  const advanceActionStatus = useInspectionStore((state) => state.advanceActionStatus);
  const assignCorrectiveAction = useInspectionStore((state) => state.assignCorrectiveAction);

  const action =
    correctiveActions.find((a) => a.id === actionId) || correctiveActions[0];

  const [assignSheetVisible, setAssignSheetVisible] = useState(shouldOpenAssignSheet);
  const [selectedTech, setSelectedTech] = useState('Sam Miller');
  const [selectedPriority, setSelectedPriority] = useState<ActionPriority>('critical');
  const [dueDateText, setDueDateText] = useState('Tomorrow, 07:00 AM');
  const [actionTitle, setActionTitle] = useState(
    'Replace Conveyor C-12 Lagging & Align Belt'
  );
  const [actionDesc, setActionDesc] = useState(
    'Lockout tagout Conveyor C-12. Strip damaged rubber lagging from drive head 2 pulley, install vulcanized ceramic lag replacement kit.'
  );

  const currentStepIndex = statusSteps.indexOf(action.status);

  const handleStepClick = async (targetStatus: ActionStatus) => {
    await advanceActionStatus(
      action.id,
      targetStatus,
      `Status updated to ${targetStatus.toUpperCase()} by ${user?.name || 'Supervisor'}`,
      user?.name || 'Sarah Jenkins (Supervisor)'
    );
  };

  const handleCreateNewAction = async () => {
    await assignCorrectiveAction({
      inspectionId: action.inspectionId,
      assetId: action.assetId,
      assetName: action.assetName,
      title: actionTitle,
      description: actionDesc,
      assignedToTechnician: selectedTech,
      priority: selectedPriority,
      dueDate: dueDateText,
      status: 'assigned',
    });
    setAssignSheetVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* HeaderBar */}
      <HeaderBar
        title="Corrective Action"
        showBack
        onPressBack={() => navigation.goBack()}
        rightAction={
          <IconButton
            icon={<Plus size={18} color={colors.textPrimary} strokeWidth={2.2} />}
            onPress={() => setAssignSheetVisible(true)}
            size={36}
            bg={colors.surfaceMuted}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Action Header Card */}
        <View style={styles.actionHeaderCard}>
          <View style={styles.actionTopRow}>
            <Text style={styles.assetSubline}>{action.assetName} · Maintenance Task</Text>
            <StatusChip
              status={action.priority === 'critical' ? 'danger' : 'warning'}
              label={action.priority.toUpperCase()}
            />
          </View>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionDescription}>{action.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <User size={13} color={colors.textSecondary} />
              <Text style={styles.metaBadgeText}>{action.assignedToTechnician}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Calendar size={13} color={colors.textSecondary} />
              <Text style={styles.metaBadgeText}>Due: {action.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Status Stepper: Open → Assigned → In Progress → Resolved → Closed */}
        <View style={styles.stepperCard}>
          <Text style={styles.sectionHeader}>Status Stepper</Text>
          <Text style={styles.sectionSubtext}>
            Tap any step to transition resolution lifecycle:
          </Text>

          <View style={styles.stepperContainer}>
            {statusSteps.map((step, idx) => {
              const isPastOrCurrent = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <Pressable
                  key={step}
                  onPress={() => handleStepClick(step)}
                  style={styles.stepItem}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isCurrent && styles.stepCircleCurrent,
                      isPastOrCurrent && !isCurrent && styles.stepCircleCompleted,
                    ]}
                  >
                    {idx < currentStepIndex ? (
                      <Check size={12} color={colors.onPrimary} strokeWidth={2.5} />
                    ) : (
                      <Text
                        style={[
                          styles.stepIndexText,
                          isCurrent && { color: colors.onPrimary },
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.stepLabel,
                      isCurrent && styles.stepLabelCurrent,
                      isPastOrCurrent && styles.stepLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {step.replace('_', ' ')}
                  </Text>

                  {idx < statusSteps.length - 1 && (
                    <View
                      style={[
                        styles.stepConnector,
                        idx < currentStepIndex && styles.stepConnectorActive,
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Action History Timeline */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeaderRow}>
            <History size={16} color={colors.textPrimary} />
            <Text style={styles.sectionHeader}>Resolution History Timeline</Text>
          </View>

          <View style={styles.timelineList}>
            {action.history.map((entry, index) => (
              <View key={entry.id} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                {index < action.history.length - 1 && <View style={styles.timelineLine} />}

                <View style={styles.timelineContent}>
                  <View style={styles.timelineTopRow}>
                    <Text style={styles.timelineAuthor}>{entry.author}</Text>
                    <Text style={styles.timelineTimestamp}>{entry.timestamp}</Text>
                  </View>
                  <Text style={styles.timelineStatus}>
                    State: {entry.status.toUpperCase().replace('_', ' ')}
                  </Text>
                  <Text style={styles.timelineNote}>{entry.note}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky CTA */}
      <View style={styles.bottomBar}>
        {currentStepIndex < statusSteps.length - 1 ? (
          <PrimaryButton
            label={`Advance to ${statusSteps[currentStepIndex + 1].toUpperCase().replace('_', ' ')}`}
            icon={<ArrowRight size={18} color={colors.onPrimary} />}
            onPress={() => handleStepClick(statusSteps[currentStepIndex + 1])}
          />
        ) : (
          <SecondaryButton
            label="Work Order Completed & Closed"
            onPress={() => navigation.navigate('SupervisorDashboard')}
          />
        )}
      </View>

      {/* Assign Corrective Action BottomSheet */}
      <BottomSheet
        visible={assignSheetVisible}
        onClose={() => setAssignSheetVisible(false)}
        title="Assign Corrective Action"
      >
        <View style={styles.assignForm}>
          <Text style={styles.formLabel}>Action Title</Text>
          <TextInput
            value={actionTitle}
            onChangeText={setActionTitle}
            style={styles.formInput}
          />

          <Text style={styles.formLabel}>Detailed Scope</Text>
          <TextInput
            value={actionDesc}
            onChangeText={setActionDesc}
            multiline
            style={[styles.formInput, { minHeight: 70 }]}
          />

          <Text style={styles.formLabel}>Assign Lead Technician</Text>
          <View style={styles.techPillsRow}>
            {['Sam Miller', 'Dave Kovacs', 'Alex Rivera'].map((tech) => (
              <Chip
                key={tech}
                label={tech}
                active={selectedTech === tech}
                onPress={() => setSelectedTech(tech)}
                style={{ marginRight: 8, marginBottom: 8 }}
              />
            ))}
          </View>

          <Text style={styles.formLabel}>Priority Level</Text>
          <View style={styles.priorityRow}>
            {priorityLevels.map((p) => (
              <Chip
                key={p}
                label={p.toUpperCase()}
                active={selectedPriority === p}
                onPress={() => setSelectedPriority(p)}
                style={{ marginRight: 8 }}
              />
            ))}
          </View>

          <Text style={styles.formLabel}>Due Date</Text>
          <TextInput
            value={dueDateText}
            onChangeText={setDueDateText}
            style={styles.formInput}
          />

          <PrimaryButton
            label="Confirm & Dispatch Action"
            onPress={handleCreateNewAction}
            style={{ marginTop: 20 }}
          />
        </View>
      </BottomSheet>
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
    paddingBottom: 90,
  },
  actionHeaderCard: {
    backgroundColor: colors.surfaceMuted,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  actionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  assetSubline: {
    ...typography.meta,
    color: colors.textSecondary,
  },
  actionTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
    marginTop: 4,
  },
  actionDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  stepperCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    ...typography.sectionHdr,
    color: colors.textPrimary,
  },
  sectionSubtext: {
    ...typography.meta,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingVertical: 10,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  stepCircleCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: colors.status.success.text,
    borderColor: colors.status.success.text,
  },
  stepIndexText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    textTransform: 'capitalize',
  },
  stepLabelActive: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  stepLabelCurrent: {
    color: colors.primary,
    fontWeight: '700',
  },
  stepConnector: {
    position: 'absolute',
    top: 14,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: colors.border,
    zIndex: 1,
  },
  stepConnectorActive: {
    backgroundColor: colors.status.success.text,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 22,
    paddingBottom: 20,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 14,
    bottom: 0,
    width: 2,
    backgroundColor: colors.border,
  },
  timelineContent: {},
  timelineTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineAuthor: {
    ...typography.bodyStrong,
    fontSize: 13,
  },
  timelineTimestamp: {
    ...typography.meta,
    fontSize: 11,
  },
  timelineStatus: {
    ...typography.caption,
    color: colors.status.info.text,
    fontWeight: '600',
    marginTop: 2,
  },
  timelineNote: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  assignForm: {
    paddingVertical: 8,
  },
  formLabel: {
    ...typography.labelBold,
    marginBottom: 6,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    ...typography.body,
    color: colors.textPrimary,
  },
  techPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priorityRow: {
    flexDirection: 'row',
  },
});
