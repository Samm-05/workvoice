import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Camera,
  Edit3,
  Check,
  Sparkles,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  HeaderBar,
  Avatar,
  AssistantMark,
  ListRow,
  Chip,
  StatusChip,
  PrimaryButton,
  InputBar,
  IconButton,
} from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { useAuthStore } from '../../store/authStore';

export const TranscriptObservationsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore((state) => state.user);
  const currentDraft = useInspectionStore((state) => state.currentDraft);
  const updateTranscript = useInspectionStore((state) => state.updateTranscript);
  const toggleObservationConfirm = useInspectionStore(
    (state) => state.toggleObservationConfirm
  );
  const answerClarification = useInspectionStore((state) => state.answerClarification);

  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedText, setEditedText] = useState(currentDraft.transcript);

  const handleSaveTranscript = () => {
    updateTranscript(editedText);
    setIsEditingTranscript(false);
  };

  const handleNextPhotoCapture = () => {
    navigation.navigate('PhotoCapture');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header with Conveyor C-12 dropdown title */}
      <HeaderBar
        title="Conveyor C-12 Analysis"
        isDropdown
        showBack
        onPressBack={() => navigation.goBack()}
        rightAction={
          <IconButton
            icon={<Camera size={18} color={colors.textPrimary} strokeWidth={2} />}
            onPress={handleNextPhotoCapture}
            size={36}
            bg={colors.surfaceMuted}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Query / Voice Bubble-less Message (Mindtrip chat pattern) */}
        <View style={styles.chatMessageRow}>
          <Avatar initials={user?.avatarInitials || 'SM'} size={32} />
          <View style={styles.userBubbleLessContent}>
            <View style={styles.speakerRow}>
              <Text style={styles.speakerName}>{user?.name || 'Sam Miller'}</Text>
              <Text style={styles.speakerMeta}>Voice Note · 42s</Text>
            </View>

            {isEditingTranscript ? (
              <View style={styles.editTranscriptBox}>
                <TextInput
                  value={editedText}
                  onChangeText={setEditedText}
                  multiline
                  style={styles.transcriptInput}
                  autoFocus
                />
                <View style={styles.editActionsRow}>
                  <Pressable
                    onPress={() => setIsEditingTranscript(false)}
                    style={styles.cancelEditBtn}
                  >
                    <Text style={styles.cancelEditText}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={handleSaveTranscript} style={styles.saveEditBtn}>
                    <Check size={14} color={colors.onPrimary} strokeWidth={2} />
                    <Text style={styles.saveEditText}>Save</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.transcriptBody}>{currentDraft.transcript}</Text>
                <Pressable
                  onPress={() => {
                    setEditedText(currentDraft.transcript);
                    setIsEditingTranscript(true);
                  }}
                  style={styles.editPromptBtn}
                >
                  <Edit3 size={13} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={styles.editPromptText}>Edit transcript</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* AI Assistant Response Bubble-less Message */}
        <View style={styles.aiMessageRow}>
          <AssistantMark size={30} />
          <View style={styles.aiContentContainer}>
            <View style={styles.speakerRow}>
              <Text style={styles.speakerName}>WorkVoice AI</Text>
              <Text style={styles.speakerMeta}>Extracted 3 observations</Text>
            </View>

            <Text style={styles.aiMessageText}>
              I analyzed your audio and correlated it with the Conveyor C-12 technical
              manual. Here are the extracted observations:
            </Text>

            {/* Observation Cards (Mindtrip ListRow / PlaceCard style) */}
            <View style={styles.observationsContainer}>
              {currentDraft.observations.map((obs) => (
                <ListRow
                  key={obs.id}
                  title={obs.component}
                  meta={`${Math.round(obs.confidence * 100)}% Confidence · ${obs.category}`}
                  body={obs.description}
                  status={obs.severity}
                  isConfirmed={obs.technicianConfirmed}
                  onToggleConfirm={() => toggleObservationConfirm(obs.id)}
                  imageUrl={obs.photoUri}
                  imageActionLabel="Inspect photo"
                  onPressImageAction={() => navigation.navigate('PhotoCapture')}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Clarification Questions (AI prompt with answer chips) */}
        <View style={styles.clarificationsSection}>
          <View style={styles.aiMessageRow}>
            <AssistantMark size={30} />
            <View style={styles.aiContentContainer}>
              <Text style={styles.clarificationHeader}>Clarification Questions</Text>
              <Text style={styles.clarificationSub}>
                Please confirm these parameters before report finalization:
              </Text>

              {currentDraft.clarificationQuestions.map((q) => (
                <View key={q.id} style={styles.questionCard}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <View style={styles.chipsRow}>
                    {q.options.map((opt) => {
                      const isSelected = q.selectedAnswer === opt;
                      return (
                        <Chip
                          key={opt}
                          label={opt}
                          active={isSelected}
                          onPress={() => answerClarification(q.id, opt)}
                          style={{ marginRight: 8, marginBottom: 8 }}
                        />
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Button to Next Step: Photo Capture */}
        <View style={styles.nextStepActionWrap}>
          <PrimaryButton
            label="Proceed to Photo Capture"
            icon={<ArrowRight size={18} color={colors.onPrimary} strokeWidth={2} />}
            onPress={handleNextPhotoCapture}
          />
        </View>
      </ScrollView>

      {/* Floating InputBar */}
      <View style={styles.floatingInputWrap}>
        <InputBar
          placeholder="Ask AI clarification or add note…"
          onAttachPhoto={() => navigation.navigate('PhotoCapture')}
          onStartVoice={() =>
            navigation.navigate('VoiceRecordingSheet', { assetId: 'conveyor-c12' })
          }
          onSubmitText={(txt) => {
            updateTranscript(currentDraft.transcript + `\n\n[Addendum]: ${txt}`);
          }}
        />
      </View>
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
  chatMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  userBubbleLessContent: {
    flex: 1,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  speakerName: {
    ...typography.labelBold,
    color: colors.textPrimary,
  },
  speakerMeta: {
    ...typography.meta,
    color: colors.textSecondary,
  },
  transcriptBody: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  editPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  editPromptText: {
    ...typography.meta,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  editTranscriptBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transcriptInput: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 80,
  },
  editActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelEditBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelEditText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  saveEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  saveEditText: {
    fontSize: 13,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  aiMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  aiContentContainer: {
    flex: 1,
  },
  aiMessageText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 2,
    marginBottom: 12,
  },
  observationsContainer: {
    marginTop: 4,
  },
  clarificationsSection: {
    marginTop: 10,
  },
  clarificationHeader: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  clarificationSub: {
    ...typography.meta,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  questionCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  questionText: {
    ...typography.bodyStrong,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nextStepActionWrap: {
    marginTop: 16,
    marginBottom: 20,
  },
  floatingInputWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
