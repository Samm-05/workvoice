import React, { useState } from 'react';
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
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  Play,
  RotateCcw,
  Bell,
  Sparkles,
} from 'lucide-react-native';
import { colors, radii, typography, spacing, elevation } from '../../theme/tokens';
import {
  AppHeader,
  AssetCard,
  InspectionCard,
  VoiceInputBar,
  PrimaryFAB,
  IconButton,
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
  const reports = useInspectionStore((state) => state.reports);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'conveyor-c12': true,
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
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

  // Recent inspections (max 3 compact cards)
  const recentInspections = [currentDraft, ...reports.filter((r) => r.id !== currentDraft.id)].slice(
    0,
    3
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Clean AppHeader with left-aligned title, no hamburger, no "+" */}
      <AppHeader
        title="WorkVoice"
        rightAction={
          <Pressable
            onPress={() => switchRole('supervisor')}
            hitSlop={6}
            style={styles.roleChip}
            accessibilityRole="button"
            accessibilityLabel="Switch active role"
          >
            <Text style={styles.roleChipText}>Supervisor mode</Text>
          </Pressable>
        }
        rightAction2={
          <IconButton
            icon={<Bell size={20} color={colors.text} strokeWidth={2} />}
            onPress={() => {}}
            size={40}
            bg="transparent"
            accessibilityLabel="Notifications"
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting + One-line status summary */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            Hey {user?.name?.split(' ')[0] || 'Sam'},
          </Text>
          <Text style={styles.greetingSubtitle} numberOfLines={1}>
            Line 2 is operational · 1 high-priority pending
          </Text>

          {/* Tappable Alert Banner for High Priority Item */}
          <Pressable
            onPress={() => handleStartInspection(mockAssets[0])}
            android_ripple={{ color: 'rgba(180, 83, 9, 0.12)' }}
            style={styles.alertBanner}
            accessibilityRole="button"
            accessibilityLabel="Conveyor C-12 inspection due alert"
          >
            <View style={styles.alertIconCircle}>
              <AlertTriangle size={18} color="#B45309" strokeWidth={2.2} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle} numberOfLines={1}>
                Conveyor C-12: Drive Pulley Slippage
              </Text>
              <Text style={styles.alertSubtitle} numberOfLines={1}>
                Routine visual & audio check due before Shift 2
              </Text>
            </View>
            <ChevronRight size={18} color="#B45309" />
          </Pressable>
        </View>

        {/* Section: Quick actions (2 equal cards, consistent 120px height) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quick actions</Text>
          <View style={styles.quickActionsGrid}>
            {/* Card 1: Start inspection */}
            <Pressable
              onPress={() => handleStartInspection(mockAssets[0])}
              android_ripple={{ color: elevation.ripple }}
              style={styles.quickCard}
              accessibilityRole="button"
              accessibilityLabel="Start inspection"
            >
              <View style={styles.quickIconCircle}>
                <ClipboardList size={20} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.quickCardTitle} numberOfLines={1}>
                Start inspection
              </Text>
              <Text style={styles.quickCardMeta} numberOfLines={1}>
                Voice checklist flow
              </Text>
            </Pressable>

            {/* Card 2: Resume draft (with 80% progress bar) */}
            <Pressable
              onPress={handleResumeDraft}
              android_ripple={{ color: elevation.ripple }}
              style={styles.quickCard}
              accessibilityRole="button"
              accessibilityLabel="Resume draft at 80% progress"
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <RotateCcw size={18} color="#B45309" strokeWidth={2.2} />
              </View>
              <Text style={styles.quickCardTitle} numberOfLines={1}>
                Resume draft
              </Text>
              <Text style={styles.quickCardMeta} numberOfLines={1}>
                Conveyor C-12 · 80%
              </Text>
              {/* Progress Bar */}
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '80%' }]} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Section: Assigned to you - Line 2 */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Assigned to you - Line 2</Text>
            <Pressable
              onPress={() => navigation.navigate('AssetsTab')}
              hitSlop={8}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={14} color={colors.primary} />
            </Pressable>
          </View>

          {/* Horizontal Asset Carousel (260px wide cards with peek) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.assetScroll}
          >
            {mockAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                title={asset.name}
                subtitle={`${asset.line} · ${asset.location}`}
                imageUrl={asset.imageUrl}
                status={asset.status}
                statusLabel={asset.statusLabel}
                isFavorite={favorites[asset.id]}
                onToggleFavorite={() => toggleFavorite(asset.id)}
                onPress={() => handleStartInspection(asset)}
                style={{ marginRight: spacing.cardGap }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Section: Recent inspections (Max 3 compact cards, NO repeated big photos) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Recent inspections</Text>
          <View style={styles.cardsList}>
            {recentInspections.map((item) => (
              <InspectionCard
                key={item.id}
                title={`${item.assetName} Inspection`}
                inspectorName={item.technicianName}
                timestamp={item.createdAt}
                summary={
                  item.transcript
                    ? item.transcript
                    : 'Checklist in progress. Voice inspection ready.'
                }
                status={item.status}
                thumbnailUrl={item.photos[0]?.uri}
                onPress={() => {
                  if (item.status === 'draft') {
                    navigation.navigate('ReviewReport');
                  } else {
                    navigation.navigate('ReviewReport');
                  }
                }}
                onPressViewReport={() => navigation.navigate('ReviewReport')}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button (Only one FAB app-wide) */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <PrimaryFAB
          label="New inspection"
          onPress={() => handleStartInspection(mockAssets[0])}
        />
      </View>

      {/* Docked AI InputBar above TabBar with 8px margin and solid white surface */}
      <View style={styles.dockedInputWrapper}>
        <VoiceInputBar
          placeholder="Ask anything or record voice note…"
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
    paddingBottom: 150, // Generous padding so docked input never obscures content
  },
  greetingSection: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 16,
  },
  greetingTitle: {
    ...typography.screenTitle,
  },
  greetingSubtitle: {
    ...typography.caption,
    marginTop: 4,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: radii.card,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 12,
  },
  alertIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
    minWidth: 0,
  },
  alertTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#92400E',
  },
  alertSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#B45309',
    marginTop: 2,
  },
  section: {
    marginTop: spacing.sectionGap,
  },
  sectionHeader: {
    ...typography.sectionTitle,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: 12,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 32,
    justifyContent: 'center',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.cardGap,
  },
  quickCard: {
    flex: 1,
    height: 120,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardTitle: {
    ...typography.cardTitle,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 6,
  },
  quickCardMeta: {
    ...typography.caption,
    marginTop: 1,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  assetScroll: {
    paddingLeft: spacing.screenPadding,
    paddingRight: 4,
  },
  cardsList: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.cardGap,
  },
  dockedInputWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 72,
    right: 16,
    zIndex: 25,
  },
  roleChip: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
