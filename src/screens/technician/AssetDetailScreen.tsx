import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Mic,
  ArrowLeft,
  ChevronDown,
  Camera,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
} from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  HeaderBar,
  PrimaryButton,
  SecondaryButton,
  Chip,
  StatusChip,
  ListRow,
  IconButton,
} from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { ChecklistItem, ChecklistStatus } from '../../types';

export const AssetDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const currentDraft = useInspectionStore((state) => state.currentDraft);
  const updateChecklistStatus = useInspectionStore((state) => state.updateChecklistStatus);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAssetModal, setSelectedAssetModal] = useState(false);

  const categories = ['All', 'Belt & Rollers', 'Drive & Motor', 'Safety & Guards', 'Sensors & Electrical'];

  const filteredChecklist = currentDraft.checklist.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  const handleNextChecklistStatus = (item: ChecklistItem) => {
    const cycle: ChecklistStatus[] = ['pass', 'fail', 'needs_review', 'pending'];
    const nextIndex = (cycle.indexOf(item.status) + 1) % cycle.length;
    updateChecklistStatus(item.id, cycle[nextIndex]);
  };

  const getStatusType = (status: ChecklistStatus) => {
    switch (status) {
      case 'pass':
        return 'success';
      case 'fail':
        return 'danger';
      case 'needs_review':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header with Asset dropdown */}
      <HeaderBar
        title="Conveyor C-12"
        isDropdown
        showBack
        onPressBack={() => navigation.goBack()}
        onPressDropdown={() => setSelectedAssetModal(!selectedAssetModal)}
        rightAction={
          <IconButton
            icon={<Camera size={18} color={colors.textPrimary} strokeWidth={2} />}
            onPress={() => navigation.navigate('PhotoCapture')}
            size={36}
            bg={colors.surfaceMuted}
          />
        }
      />

      {/* Asset Info Card */}
      <View style={styles.assetHeaderCard}>
        <View style={styles.assetTopRow}>
          <View>
            <Text style={styles.assetSubline}>Line 2 · Stamping & Assembly Bay 4</Text>
            <Text style={styles.assetTitle}>Conveyor C-12 Active Inspection</Text>
          </View>
          <StatusChip status="warning" label="Maintenance Req" />
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCol}>
            <Text style={styles.kpiLabel}>Speed</Text>
            <Text style={styles.kpiValue}>1.4 m/s</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiCol}>
            <Text style={styles.kpiLabel}>Checklist Items</Text>
            <Text style={styles.kpiValue}>{currentDraft.checklist.length} total</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiCol}>
            <Text style={styles.kpiLabel}>Voice Status</Text>
            <Text style={styles.kpiValue}>
              {currentDraft.transcript ? 'Recorded' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>

      {/* Filter Category Chips */}
      <View style={styles.categoryScrollWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChips}
        >
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
              style={{ marginRight: 8 }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Checklist items list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.checklistContent}
      >
        <Text style={styles.sectionHeader}>Checklist Verification Items</Text>
        <Text style={styles.sectionSubtext}>
          Tap any item below to cycle status (Pass → Fail → Needs Review).
        </Text>

        <View style={styles.checklistItemsList}>
          {filteredChecklist.map((item) => (
            <ListRow
              key={item.id}
              title={`${item.code}: ${item.label}`}
              meta={`Category: ${item.category}`}
              body={item.note || 'No anomaly noted during visual inspection.'}
              status={getStatusType(item.status)}
              statusLabel={item.status.toUpperCase().replace('_', ' ')}
              onPress={() => handleNextChecklistStatus(item)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomActionBar}>
        <PrimaryButton
          label="Record voice note"
          icon={<Mic size={18} color={colors.onPrimary} strokeWidth={2.2} />}
          onPress={() => navigation.navigate('VoiceRecordingSheet', { assetId: 'conveyor-c12' })}
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
  assetHeaderCard: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  assetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  assetSubline: {
    ...typography.meta,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  assetTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  kpiCol: {
    alignItems: 'center',
    flex: 1,
  },
  kpiLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  kpiValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  categoryScrollWrap: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryChips: {
    paddingHorizontal: 16,
  },
  checklistContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  sectionHeader: {
    ...typography.sectionHdr,
    color: colors.textPrimary,
  },
  sectionSubtext: {
    ...typography.meta,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  checklistItemsList: {
    marginTop: 4,
  },
  bottomActionBar: {
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
});
