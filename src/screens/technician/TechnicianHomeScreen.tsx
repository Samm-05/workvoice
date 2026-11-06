import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  ChevronRight,
  ClipboardList,
} from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  HeaderBar,
  ImageCard,
  ListRow,
  InputBar,
  IconButton,
  Chip,
  StatusChip,
} from '../../components';
import { useAuthStore } from '../../store/authStore';
import { useInspectionStore } from '../../store/inspectionStore';
import { mockAssets } from '../../services/mockData';
import { Asset } from '../../types';

export const TechnicianHomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const user = useAuthStore((state) => state.user);
  const switchRole = useAuthStore((state) => state.switchRole);
  const initC12Draft = useInspectionStore((state) => state.initC12Draft);
  const currentDraft = useInspectionStore((state) => state.currentDraft);
  const [flaggedAssets, setFlaggedAssets] = useState<Record<string, boolean>>({
    'conveyor-c12': true,
  });

  const toggleFlag = (id: string) => {
    setFlaggedAssets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartInspection = (asset: Asset) => {
    initC12Draft();
    navigation.navigate('AssetDetail', { assetId: asset.id });
  };

  const handleResumeDraft = () => {
    navigation.navigate('ReviewReport');
  };

  const handleOpenVoiceSheet = () => {
    navigation.navigate('VoiceRecordingSheet', { assetId: 'conveyor-c12' });
  };

  const handleAttachPhoto = () => {
    navigation.navigate('PhotoCapture');
  };

  const handleAskInput = (text: string) => {
    navigation.navigate('TranscriptObservations', { initialMessage: text });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* HeaderBar with logo and journey switch */}
      <HeaderBar
        showLogo
        rightAction={
          <Pressable
            onPress={() => switchRole('supervisor')}
            style={styles.switchRolePill}
            accessibilityLabel="Switch to Supervisor Mode"
          >
            <Users size={14} color={colors.textPrimary} />
            <Text style={styles.switchRoleText}>Supervisor</Text>
          </Pressable>
        }
        rightAction2={
          <IconButton
            icon={<Plus size={18} color={colors.textPrimary} strokeWidth={2.2} />}
            onPress={() => handleStartInspection(mockAssets[0])}
            size={36}
            bg={colors.surfaceMuted}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome greeting banner */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hey {user?.name?.split(' ')[0] || 'Sam'},</Text>
          <Text style={styles.greetingSubtitle}>
            Line 2 is operational · 1 high-priority inspection pending
          </Text>
        </View>

        {/* Section: Get started (Two ImageCards side-by-side) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Get started</Text>
          <View style={styles.getStartedGrid}>
            <ImageCard
              title="Start inspection"
              meta="Voice checklist flow"
              imageUrl="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
              aspectRatio={0.95}
              onPress={() => handleStartInspection(mockAssets[0])}
              onAdd={() => handleStartInspection(mockAssets[0])}
            />
            <ImageCard
              title="Resume draft"
              meta="Conveyor C-12 · 80%"
              imageUrl="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
              aspectRatio={0.95}
              status="warning"
              statusLabel="Draft"
              onPress={handleResumeDraft}
            />
          </View>
        </View>

        {/* Section: Assigned to you · Line 2 */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Assigned to you · Line 2</Text>
            <Pressable
              onPress={() => navigation.navigate('AssetsTab')}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={14} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardScroll}
          >
            {mockAssets.map((asset) => (
              <ImageCard
                key={asset.id}
                title={asset.name}
                meta={`${asset.location} · ${asset.lastInspected}`}
                imageUrl={asset.imageUrl}
                aspectRatio={0.78}
                width={200}
                status={asset.status}
                statusLabel={asset.statusLabel}
                isFlagged={flaggedAssets[asset.id]}
                onFlag={() => toggleFlag(asset.id)}
                onAdd={() => handleStartInspection(asset)}
                onPress={() => handleStartInspection(asset)}
                style={{ marginRight: 12 }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Section: Pending actions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Pending actions</Text>
          <View style={styles.listContainer}>
            <ListRow
              title="Conveyor C-12: Drive Pulley Slippage"
              meta="Due today · High Priority"
              body="Routine audio check and pulley lagging wear assessment required before Shift 2."
              status="danger"
              statusLabel="Inspection Due"
              onPress={() => handleStartInspection(mockAssets[0])}
              showChevron
            />
            <ListRow
              title="Line 2 Shift Handover Checklist"
              meta="Assembly Station 4"
              body="Verify E-stop switches and optical calibration sensors are cleared."
              status="warning"
              statusLabel="Pending Review"
              onPress={() => navigation.navigate('Checklist', { assetId: 'conveyor-c12' })}
              showChevron
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating InputBar above TabBar */}
      <View style={styles.floatingInputWrapper}>
        <InputBar
          placeholder="Ask WorkVoice AI or Conveyor C-12…"
          onAttachPhoto={handleAttachPhoto}
          onStartVoice={handleOpenVoiceSheet}
          onSubmitText={handleAskInput}
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
    paddingBottom: 80,
  },
  greetingSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greetingTitle: {
    ...typography.title,
    fontSize: 22,
    lineHeight: 28,
  },
  greetingSubtitle: {
    ...typography.meta,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    ...typography.sectionHdr,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    ...typography.meta,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  getStartedGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  horizontalCardScroll: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  floatingInputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
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
