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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  CheckSquare,
  Camera,
  HelpCircle,
  Share2,
} from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  HeaderBar,
  PrimaryButton,
  SecondaryButton,
  StatusChip,
  ConfirmDialog,
  BottomSheet,
  IconButton,
} from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { useAuthStore } from '../../store/authStore';

export const ReviewReportScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const currentDraft = useInspectionStore((state) => state.currentDraft);
  const submitCurrentReport = useInspectionStore((state) => state.submitCurrentReport);
  const switchRole = useAuthStore((state) => state.switchRole);

  // Section collapse state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    transcript: false,
    observations: false,
    checklist: false,
    photos: false,
    missingFields: false,
  });

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSheetVisible, setSuccessSheetVisible] = useState(false);

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    await submitCurrentReport();
    setIsSubmitting(false);
    setConfirmModalVisible(false);
    setSuccessSheetVisible(true);
  };

  const handleGoToSupervisorReview = () => {
    setSuccessSheetVisible(false);
    switchRole('supervisor');
    navigation.navigate('SupervisorReportReview', { reportId: currentDraft.id });
  };

  const isSubmitted = currentDraft.status === 'submitted' || currentDraft.status === 'approved';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header with Draft vs Submitted StatusChip */}
      <HeaderBar
        title="Inspection Report"
        showBack
        onPressBack={() => navigation.goBack()}
        rightAction={
          <StatusChip
            status={isSubmitted ? 'success' : 'warning'}
            label={isSubmitted ? 'Submitted' : 'Draft'}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Meta summary card */}
        <View style={styles.metaCard}>
          <Text style={styles.metaAssetTitle}>{currentDraft.assetName}</Text>
          <Text style={styles.metaLine}>{currentDraft.line}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Inspector: {currentDraft.technicianName}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaItem}>{currentDraft.createdAt}</Text>
          </View>
        </View>

        {/* Section 1: Voice Transcript (Collapsible) */}
        <View style={styles.sectionCard}>
          <Pressable
            onPress={() => toggleSection('transcript')}
            style={styles.sectionHeaderPressable}
          >
            <View style={styles.sectionHeaderLeft}>
              <FileText size={18} color={colors.textPrimary} />
              <Text style={styles.sectionTitle}>Audio Transcript</Text>
            </View>
            {collapsedSections.transcript ? (
              <ChevronDown size={18} color={colors.textSecondary} />
            ) : (
              <ChevronUp size={18} color={colors.textSecondary} />
            )}
          </Pressable>

          {!collapsedSections.transcript && (
            <View style={styles.sectionBody}>
              <Text style={styles.transcriptText}>{currentDraft.transcript}</Text>
              <Text style={styles.timestampMeta}>
                Recorded duration: {currentDraft.recordingDurationSeconds || 42}s · WorkVoice AI
                Processed
              </Text>
            </View>
          )}
        </View>

        {/* Section 2: Extracted Observations (Collapsible) */}
        <View style={styles.sectionCard}>
          <Pressable
            onPress={() => toggleSection('observations')}
            style={styles.sectionHeaderPressable}
          >
            <View style={styles.sectionHeaderLeft}>
              <Layers size={18} color={colors.textPrimary} />
              <Text style={styles.sectionTitle}>
                Extracted Observations ({currentDraft.observations.length})
              </Text>
            </View>
            {collapsedSections.observations ? (
              <ChevronDown size={18} color={colors.textSecondary} />
            ) : (
              <ChevronUp size={18} color={colors.textSecondary} />
            )}
          </Pressable>

          {!collapsedSections.observations && (
            <View style={styles.sectionBody}>
              {currentDraft.observations.map((obs, idx) => (
                <View key={obs.id} style={styles.obsItem}>
                  <View style={styles.obsTopRow}>
                    <Text style={styles.obsComponent}>{obs.component}</Text>
                    <StatusChip status={obs.severity} />
                  </View>
                  <Text style={styles.obsDesc}>{obs.description}</Text>
                  <Text style={styles.obsMeta}>
                    {Math.round(obs.confidence * 100)}% Confidence ·{' '}
                    {obs.technicianConfirmed ? 'Confirmed by Sam' : 'Pending confirmation'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section 3: Checklist Items (Collapsible) */}
        <View style={styles.sectionCard}>
          <Pressable
            onPress={() => toggleSection('checklist')}
            style={styles.sectionHeaderPressable}
          >
            <View style={styles.sectionHeaderLeft}>
              <CheckSquare size={18} color={colors.textPrimary} />
              <Text style={styles.sectionTitle}>
                Checklist Results ({currentDraft.checklist.length})
              </Text>
            </View>
            {collapsedSections.checklist ? (
              <ChevronDown size={18} color={colors.textSecondary} />
            ) : (
              <ChevronUp size={18} color={colors.textSecondary} />
            )}
          </Pressable>

          {!collapsedSections.checklist && (
            <View style={styles.sectionBody}>
              {currentDraft.checklist.map((item) => (
                <View key={item.id} style={styles.checkRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.checkCode}>{item.code} · {item.label}</Text>
                    {item.note && <Text style={styles.checkNote}>{item.note}</Text>}
                  </View>
                  <StatusChip
                    status={
                      item.status === 'pass'
                        ? 'success'
                        : item.status === 'fail'
                        ? 'danger'
                        : 'warning'
                    }
                    label={item.status.toUpperCase()}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section 4: Inspection Photos (Collapsible) */}
        <View style={styles.sectionCard}>
          <Pressable
            onPress={() => toggleSection('photos')}
            style={styles.sectionHeaderPressable}
          >
            <View style={styles.sectionHeaderLeft}>
              <Camera size={18} color={colors.textPrimary} />
              <Text style={styles.sectionTitle}>
                Photos & Evidence ({currentDraft.photos.length})
              </Text>
            </View>
            {collapsedSections.photos ? (
              <ChevronDown size={18} color={colors.textSecondary} />
            ) : (
              <ChevronUp size={18} color={colors.textSecondary} />
            )}
          </Pressable>

          {!collapsedSections.photos && (
            <View style={styles.sectionBody}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {currentDraft.photos.map((photo) => (
                  <View key={photo.id} style={styles.photoCard}>
                    <Image source={{ uri: photo.uri }} style={styles.photoImg} />
                    <View style={styles.photoMetaWrap}>
                      <Text style={styles.photoLabel} numberOfLines={1}>
                        {photo.label}
                      </Text>
                      <Text style={styles.photoTime}>{photo.timestamp}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Section 5: Missing Fields & Clarifications */}
        <View style={styles.sectionCard}>
          <Pressable
            onPress={() => toggleSection('missingFields')}
            style={styles.sectionHeaderPressable}
          >
            <View style={styles.sectionHeaderLeft}>
              <HelpCircle size={18} color={colors.textPrimary} />
              <Text style={styles.sectionTitle}>
                Clarifications & Audit Notes ({currentDraft.clarificationQuestions.length})
              </Text>
            </View>
            {collapsedSections.missingFields ? (
              <ChevronDown size={18} color={colors.textSecondary} />
            ) : (
              <ChevronUp size={18} color={colors.textSecondary} />
            )}
          </Pressable>

          {!collapsedSections.missingFields && (
            <View style={styles.sectionBody}>
              {currentDraft.clarificationQuestions.map((q) => (
                <View key={q.id} style={styles.auditRow}>
                  <Text style={styles.auditQuestion}>{q.question}</Text>
                  <View style={styles.answerBadge}>
                    <Text style={styles.answerText}>
                      Answer: {q.selectedAnswer || 'Not answered'}
                    </Text>
                  </View>
                </View>
              ))}

              {currentDraft.missingFields.map((field, idx) => (
                <View key={idx} style={styles.missingFieldRow}>
                  <AlertCircle size={14} color={colors.status.warning.text} />
                  <Text style={styles.missingFieldText}>Optional: {field}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Bar */}
      <View style={styles.bottomBar}>
        {isSubmitted ? (
          <PrimaryButton
            label="Open in Supervisor Review Mode"
            onPress={handleGoToSupervisorReview}
          />
        ) : (
          <PrimaryButton
            label="Confirm & submit report"
            onPress={() => setConfirmModalVisible(true)}
          />
        )}
      </View>

      {/* Confirmation Dialog (radius 20 modal, two pill buttons) */}
      <ConfirmDialog
        visible={confirmModalVisible}
        title="Submit Inspection Report?"
        description="Once submitted, Conveyor C-12 report will be routed to plant supervisor Sarah Jenkins for approval and corrective action assignment."
        confirmLabel="Confirm & submit"
        cancelLabel="Review more"
        loading={isSubmitting}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setConfirmModalVisible(false)}
      />

      {/* Success Sheet with Check Icon */}
      <BottomSheet
        visible={successSheetVisible}
        onClose={() => setSuccessSheetVisible(false)}
        title="Report Submitted"
      >
        <View style={styles.successSheetContent}>
          <View style={styles.successIconCircle}>
            <CheckCircle2 size={44} color={colors.status.success.text} strokeWidth={2.2} />
          </View>
          <Text style={styles.successTitle}>Report successfully queued!</Text>
          <Text style={styles.successSubtitle}>
            Conveyor C-12 inspection is now under Supervisor Sarah Jenkins review.
          </Text>

          <View style={styles.successActions}>
            <PrimaryButton
              label="Open Supervisor Review (Journey Switch)"
              onPress={handleGoToSupervisorReview}
            />
            <SecondaryButton
              label="Return to Technician Home"
              onPress={() => {
                setSuccessSheetVisible(false);
                navigation.navigate('TechnicianHome');
              }}
            />
          </View>
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
  metaCard: {
    backgroundColor: colors.surfaceMuted,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  metaAssetTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
  },
  metaLine: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  metaItem: {
    ...typography.meta,
    color: colors.textSecondary,
  },
  metaDot: {
    color: colors.textTertiary,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sectionHeaderPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.surface,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  transcriptText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  timestampMeta: {
    ...typography.meta,
    color: colors.textSecondary,
    marginTop: 8,
  },
  obsItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  obsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  obsComponent: {
    ...typography.bodyStrong,
    fontSize: 14,
  },
  obsDesc: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  obsMeta: {
    ...typography.meta,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 4,
  },
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
    gap: 12,
  },
  checkCode: {
    ...typography.labelBold,
    fontSize: 13,
  },
  checkNote: {
    ...typography.meta,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  photoCard: {
    width: 140,
    marginRight: 10,
    borderRadius: radii.imageCard,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  photoImg: {
    width: '100%',
    height: 100,
  },
  photoMetaWrap: {
    padding: 8,
  },
  photoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  photoTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  auditRow: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  auditQuestion: {
    ...typography.bodyStrong,
    fontSize: 13,
    marginBottom: 4,
  },
  answerBadge: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  answerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  missingFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  missingFieldText: {
    ...typography.meta,
    color: colors.status.warning.text,
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
  successSheetContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.status.success.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    ...typography.title,
    fontSize: 20,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  successActions: {
    width: '100%',
    gap: 10,
  },
});
