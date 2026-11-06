import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { X, Calendar, MapPin, Cpu, Check, AlertCircle } from 'lucide-react-native';
import { colors, radii, typography, spacing, elevation } from '../../theme/tokens';
import {
  IconButton,
  PrimaryButton,
  Chip,
  VoiceOrb,
} from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { useAuthStore } from '../../store/authStore';

export const VoiceRecordingSheet: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore((state) => state.user);
  const isRecording = useInspectionStore((state) => state.isRecording);
  const isTranscribing = useInspectionStore((state) => state.isTranscribing);
  const startRecording = useInspectionStore((state) => state.startRecording);
  const stopRecordingAndTranscribe = useInspectionStore(
    (state) => state.stopRecordingAndTranscribe
  );
  const transcriptionError = useInspectionStore((state) => state.transcriptionError);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    startRecording();
  }, []);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = async () => {
    await stopRecordingAndTranscribe();
    navigation.replace('TranscriptObservations');
  };

  const firstName = user?.name?.split(' ')[0] || 'Sam';

  return (
    <View style={styles.scrimContainer}>
      <StatusBar style="light" />

      {/* Dismiss backdrop */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      {/* Main Bottom Sheet Body matching Mindtrip Voice Sheet */}
      <View style={styles.sheetBody}>
        {/* Grabber indicator */}
        <View style={styles.grabberRow}>
          <View style={styles.grabber} />
        </View>

        {/* Top bar with close button on left */}
        <View style={styles.topBar}>
          <IconButton
            icon={<X size={18} color={colors.textPrimary} strokeWidth={2.2} />}
            onPress={() => navigation.goBack()}
            size={36}
            bg={colors.surfaceMuted}
          />
          <View style={styles.liveTimerBadge}>
            <View style={styles.recDot} />
            <Text style={styles.liveTimerText}>{formatTimer(seconds)}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.headlineArea}>
          <Text style={styles.titleHeadline}>
            Hey {firstName}, tell me what you see on Conveyor C-12.
          </Text>
          <Text style={styles.subHeadline}>
            I see that you have shared some details about your inspection. Is there
            anything else you want me to know?
          </Text>
        </View>

        {/* Context Chips (C-12, Line 2, today's date) */}
        <View style={styles.contextChipsRow}>
          <Chip
            label="Conveyor C-12"
            icon={<Cpu size={14} color={colors.textPrimary} />}
          />
          <Chip
            label="Line 2 Assembly"
            icon={<MapPin size={14} color={colors.textPrimary} />}
          />
          <Chip
            label="Today"
            icon={<Calendar size={14} color={colors.textPrimary} />}
          />
        </View>

        {/* Voice Orb Area */}
        <View style={styles.voiceOrbWrapper}>
          <VoiceOrb
            isRecording={isRecording && !isTranscribing}
            caption={
              isTranscribing
                ? 'Processing voice & extracting observations…'
                : 'Listening to your report…'
            }
          />
        </View>

        {/* Transcription Error notice if any */}
        {transcriptionError && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={colors.status.danger.text} />
            <Text style={styles.errorText}>{transcriptionError}</Text>
          </View>
        )}

        {/* Bottom Primary Button */}
        <View style={styles.bottomButtonContainer}>
          <PrimaryButton
            label={isTranscribing ? 'Generating transcript…' : 'Stop & generate transcript'}
            loading={isTranscribing}
            onPress={handleStop}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrimContainer: {
    flex: 1,
    backgroundColor: colors.overlayScrim,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetBody: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.bottomSheet,
    borderTopRightRadius: radii.bottomSheet,
    paddingHorizontal: 20,
    paddingBottom: 24,
    ...elevation.sheet,
  },
  grabberRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  liveTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.heartRed,
  },
  liveTimerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headlineArea: {
    marginTop: 16,
  },
  titleHeadline: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subHeadline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 6,
  },
  contextChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  voiceOrbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.status.danger.bg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorText: {
    ...typography.meta,
    color: colors.status.danger.text,
    fontWeight: '500',
  },
  bottomButtonContainer: {
    marginTop: 8,
  },
});
