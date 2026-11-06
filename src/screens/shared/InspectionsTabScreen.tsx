import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClipboardCheck, Plus } from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import { HeaderBar, Chip, ListRow, IconButton } from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { useAuthStore } from '../../store/authStore';

interface InspectionsTabProps {
  title?: string;
  isSupervisorView?: boolean;
}

export const InspectionsTabScreen: React.FC<InspectionsTabProps> = ({
  title = 'Inspections',
  isSupervisorView = false,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const role = useAuthStore((state) => state.role);
  const reports = useInspectionStore((state) => state.reports);
  const currentDraft = useInspectionStore((state) => state.currentDraft);

  const [activeFilter, setActiveFilter] = useState('All');

  const allList = [currentDraft, ...reports.filter((r) => r.id !== currentDraft.id)];

  const filtered = allList.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Drafts') return item.status === 'draft';
    if (activeFilter === 'Submitted') return item.status === 'submitted';
    if (activeFilter === 'Approved') return item.status === 'approved';
    return true;
  });

  const handleOpenItem = (reportId: string) => {
    if (role === 'supervisor' || isSupervisorView) {
      navigation.navigate('SupervisorReportReview', { reportId });
    } else {
      navigation.navigate('ReviewReport');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <HeaderBar
        title={title}
        rightAction={
          <IconButton
            icon={<Plus size={18} color={colors.textPrimary} strokeWidth={2.2} />}
            onPress={() => navigation.navigate('AssetDetail', { assetId: 'conveyor-c12' })}
            size={36}
            bg={colors.surfaceMuted}
          />
        }
      />

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {['All', 'Drafts', 'Submitted', 'Approved'].map((f) => (
          <Chip
            key={f}
            label={f}
            active={activeFilter === f}
            onPress={() => setActiveFilter(f)}
            style={{ marginRight: 8 }}
          />
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.listHeader}>
          {filtered.length} {isSupervisorView ? 'Reviews' : 'Inspections'}
        </Text>

        <View style={styles.listContainer}>
          {filtered.map((r) => (
            <ListRow
              key={r.id}
              title={`${r.assetName} Inspection`}
              meta={`Inspector: ${r.technicianName} · ${r.createdAt}`}
              body={
                r.transcript
                  ? `Voice summary: ${r.transcript.slice(0, 95)}…`
                  : 'Checklist in progress.'
              }
              status={
                r.status === 'approved'
                  ? 'success'
                  : r.status === 'submitted'
                  ? 'warning'
                  : 'neutral'
              }
              statusLabel={r.status.toUpperCase()}
              onPress={() => handleOpenItem(r.id)}
              showChevron
              imageUrl={r.photos[0]?.uri}
              imageActionLabel="View report"
              onPressImageAction={() => handleOpenItem(r.id)}
            />
          ))}
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  listHeader: {
    ...typography.meta,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  listContainer: {
    backgroundColor: colors.surface,
  },
});
