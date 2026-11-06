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
import { Image } from 'expo-image';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  Flag,
  RotateCcw,
  PlusCircle,
  Calendar,
  MessageCircle,
} from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  HeaderBar,
  PrimaryButton,
  SecondaryButton,
  StatusChip,
  Chip,
  BottomSheet,
  ConfirmDialog,
  IconButton,
} from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { useAuthStore } from '../../store/authStore';

export const SupervisorReportReviewScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const reportId = route.params?.reportId || 'insp-c12-001';

  const user = useAuthStore((state) => state.user);
  const reports = useInspectionStore((state) => state.reports);
  const approveReport = useInspectionStore((state) => state.approveReport);
  const requestClarification = useInspectionStore((state) => state.requestClarification);
  const toggleObservationSupervisorVerify = useInspectionStore(
    (state) => state.toggleObservationSupervisorVerify
  );

  const report = reports.find((r) => r.id === reportId) || reports[0];

  const [moreActionSheetVisible, setMoreActionSheetVisible] = useState(false);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [clarifyModalVisible, setClarifyModalVisible] = useState(false);
  const [clarifyNote, setClarifyNote] = useState('');
  const [supervisorNotes, setSupervisorNotes] = useState(report?.supervisorNotes || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await approveReport(report.id, supervisorNotes || 'Approved by plant supervisor');
    setIsProcessing(false);
    setApproveConfirmVisible(false);
    // Navigate directly to assign corrective action
    navigation.navigate('CorrectiveAction', {
      actionId: 'act-c12-01',
      openAssignSheet: true,
    });
  };

  const handleSendClarification = async () => {
    setIsProcessing(true);
    await requestClarification(report.id, clarifyNote || 'Please provide motor surface temp reading.');
    setIsProcessing(false);
    setClarifyModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* HeaderBar with More icon */}
      <HeaderBar
        title="Supervisor Review"
        showBack
        onPressBack={() => navigation.goBack()}
        rightAction={
          <IconButton
            icon={<MoreVertical size={20} color={colors.textPrimary} strokeWidth={2} />}
            onPress={() => setMoreActionSheetVisible(true)}
            size={36}
            bg={colors.surfaceMuted}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Verification Status Header Card */}
        <View style={styles.reviewBanner}>
          <View style={styles.bannerTopRow}>
            <View>
              <Text style={styles.assetTitle}>{report.assetName} Report</Text>
              <Text style={styles.assetSubline}>{report.line}</Text>
            </View>
            <StatusChip
              status={
                report.status === 'approved'
                  ? 'success'
                  : report.status === 'needs_clarification'
                  ? 'warning'
                  : 'info'
              }
              label={report.status.toUpperCase().replace('_', ' ')}
            />
          </View>

          {/* Dual Source Badge Chips: Reported by technician vs Verified by supervisor */}
          <View style={styles.sourcePillsRow}>
            <View style={styles.sourcePillTechnician}>
              <UserCheck size={13} color={colors.status.info.text} strokeWidth={2.2} />
              <Text style={styles.sourcePillTechText}>Reported by Sam Miller</Text>
            </View>
            <View style={styles.sourcePillSupervisor}>
              <ShieldCheck size={13} color={colors.status.success.text} strokeWidth={2.2} />
              <Text style={styles.sourcePillSupText}>
                {report.status === 'approved' ? 'Verified by Sarah' : 'Pending Verification'}
              </Text>
            </View>
          </View>
        </View>

        {/* Section: Technician Audio Transcript */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Technician Voice Transcript</Text>
          <Text style={styles.transcriptQuote}>"{report.transcript}"</Text>
          <Text style={styles.audioMeta}>
            Recorded: Today 10:10 AM · Duration: 42s · Stamping Bay 4
          </Text>
        </View>

        {/* Section: Extracted Defect Observations with Dual Verification Chips */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>
            Defect Observations ({report.observations.length})
          </Text>
          <Text style={styles.sectionSubtext}>
            Tap "Verify" on any item to stamp supervisor audit verification.
          </Text>

          {report.observations.map((obs) => (
            <View key={obs.id} style={styles.observationItem}>
              <View style={styles.obsHeaderRow}>
                <Text style={styles.obsComponentName}>{obs.component}</Text>
                <StatusChip status={obs.severity} />
              </View>

              <Text style={styles.obsDescription}>{obs.description}</Text>

              {/* Labeled Chips: Technician Confirmed vs Verified by Supervisor */}
              <View style={styles.verificationRow}>
                <View
                  style={[
                    styles.tagChip,
                    obs.technicianConfirmed
                      ? styles.tagChipConfirmed
                      : styles.tagChipPending,
                  ]}
                >
                  <Text style={styles.tagChipText}>
                    {obs.technicianConfirmed ? 'Technician Confirmed' : 'Not Confirmed'}
                  </Text>
                </View>

                <Pressable
                  onPress={() => toggleObservationSupervisorVerify(obs.id)}
                  style={[
                    styles.tagChip,
                    obs.supervisorVerified
                      ? styles.tagChipSupervisorVerified
                      : styles.tagChipSupervisorPending,
                  ]}
                >
                  <ShieldCheck
                    size={12}
                    color={
                      obs.supervisorVerified
                        ? colors.status.success.text
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.tagChipText,
                      obs.supervisorVerified && { color: colors.status.success.text },
                    ]}
                  >
                    {obs.supervisorVerified ? 'Verified by Supervisor' : 'Tap to Verify'}
                  </Text>
                </Pressable>
              </View>

              {/* Photo Evidence Thumbnail if present */}
              {obs.photoUri && (
                <View style={styles.evidenceImageWrapper}>
                  <Image source={{ uri: obs.photoUri }} style={styles.evidenceImage} />
                  <View style={styles.evidenceBadge}>
                    <Text style={styles.evidenceBadgeText}>Photo Evidence</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Section: Inspection Photos Strip */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Technician Photo Strip ({report.photos.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {report.photos.map((p) => (
              <View key={p.id} style={styles.photoThumb}>
                <Image source={{ uri: p.uri }} style={styles.photoThumbImg} />
                <Text style={styles.photoThumbLabel} numberOfLines={1}>
                  {p.label}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Section: Missing Fields Check */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Supervisor Missing Fields Audit</Text>
          {report.missingFields.map((field, idx) => (
            <View key={idx} style={styles.missingFieldRow}>
              <AlertTriangle size={15} color={colors.status.warning.text} />
              <Text style={styles.missingFieldLabel}>{field}</Text>
            </View>
          ))}
        </View>

        {/* Section: Supervisor Notes */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Supervisor Notes & Directions</Text>
          <TextInput
            value={supervisorNotes}
            onChangeText={setSupervisorNotes}
            placeholder="Add operational directions for maintenance crew..."
            placeholderTextColor={colors.textTertiary}
            multiline
            style={styles.supervisorNoteInput}
          />
        </View>
      </ScrollView>

      {/* Bottom Actions Bar (Approve vs Request Clarification) */}
      <View style={styles.bottomBar}>
        <View style={styles.buttonRow}>
          <View style={{ flex: 1 }}>
            <SecondaryButton
              label="Request clarification"
              onPress={() => setClarifyModalVisible(true)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label="Approve report"
              onPress={() => setApproveConfirmVisible(true)}
            />
          </View>
        </View>
      </View>

      {/* Confirmation Dialog for Approve */}
      <ConfirmDialog
        visible={approveConfirmVisible}
        title="Approve Conveyor C-12 Report?"
        description="Approving will stamp supervisor certification and proceed to Corrective Action assignment for maintenance."
        confirmLabel="Approve & Assign Action"
        cancelLabel="Cancel"
        loading={isProcessing}
        onConfirm={handleApprove}
        onCancel={() => setApproveConfirmVisible(false)}
      />

      {/* Bottom Sheet for Request Clarification */}
      <BottomSheet
        visible={clarifyModalVisible}
        onClose={() => setClarifyModalVisible(false)}
        title="Request Clarification"
      >
        <View style={styles.clarifySheetContent}>
          <Text style={styles.clarifyPrompt}>
            Send a query back to Sam Miller regarding Conveyor C-12:
          </Text>
          <TextInput
            value={clarifyNote}
            onChangeText={setClarifyNote}
            placeholder="e.g. Please measure the motor surface temperature using the thermal gun and confirm roller #4 noise."
            placeholderTextColor={colors.textTertiary}
            multiline
            style={styles.clarifyInput}
          />
          <PrimaryButton
            label="Send Clarification Request"
            loading={isProcessing}
            onPress={handleSendClarification}
            style={{ marginTop: 16 }}
          />
        </View>
      </BottomSheet>

      {/* More Actions BottomSheet (Return, Flag for physical inspection) */}
      <BottomSheet
        visible={moreActionSheetVisible}
        onClose={() => setMoreActionSheetVisible(false)}
        title="More Supervisor Actions"
      >
        <View style={styles.actionSheetList}>
          <Pressable
            onPress={() => {
              setMoreActionSheetVisible(false);
              navigation.navigate('CorrectiveAction', { actionId: 'act-c12-01' });
            }}
            style={styles.actionSheetRow}
          >
            <PlusCircle size={18} color={colors.textPrimary} />
            <Text style={styles.actionSheetRowText}>Assign Corrective Work Order</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setMoreActionSheetVisible(false);
              handleSendClarification();
            }}
            style={styles.actionSheetRow}
          >
            <RotateCcw size={18} color={colors.status.warning.text} />
            <Text style={[styles.actionSheetRowText, { color: colors.status.warning.text }]}>
              Return Report to Draft
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setMoreActionSheetVisible(false);
              setApproveConfirmVisible(true);
            }}
            style={styles.actionSheetRow}
          >
            <Flag size={18} color={colors.status.danger.text} />
            <Text style={[styles.actionSheetRowText, { color: colors.status.danger.text }]}>
              Flag for Physical Safety Lockout
            </Text>
          </Pressable>
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
  reviewBanner: {
    backgroundColor: colors.surfaceMuted,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  assetTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
  },
  assetSubline: {
    ...typography.meta,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sourcePillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  sourcePillTechnician: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.status.info.bg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  sourcePillTechText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.status.info.text,
  },
  sourcePillSupervisor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.status.success.bg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  sourcePillSupText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.status.success.text,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    ...typography.sectionHdr,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtext: {
    ...typography.meta,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  transcriptQuote: {
    ...typography.body,
    fontStyle: 'italic',
    lineHeight: 22,
    color: colors.textPrimary,
    marginTop: 4,
  },
  audioMeta: {
    ...typography.meta,
    color: colors.textTertiary,
    marginTop: 8,
  },
  observationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  obsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  obsComponentName: {
    ...typography.bodyStrong,
    fontSize: 14,
  },
  obsDescription: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  tagChipConfirmed: {
    backgroundColor: colors.surfaceMuted,
  },
  tagChipPending: {
    backgroundColor: colors.status.neutral.bg,
  },
  tagChipSupervisorVerified: {
    backgroundColor: colors.status.success.bg,
  },
  tagChipSupervisorPending: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  evidenceImageWrapper: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    position: 'relative',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  evidenceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  evidenceBadgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
  photoThumb: {
    width: 100,
    marginRight: 10,
  },
  photoThumbImg: {
    width: 100,
    height: 70,
    borderRadius: radii.smallThumb,
  },
  photoThumbLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  missingFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  missingFieldLabel: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  supervisorNoteInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 70,
    marginTop: 8,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  clarifySheetContent: {
    paddingVertical: 8,
  },
  clarifyPrompt: {
    ...typography.body,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  clarifyInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 14,
    ...typography.body,
    minHeight: 90,
  },
  actionSheetList: {
    paddingVertical: 8,
    gap: 8,
  },
  actionSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionSheetRowText: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
});
