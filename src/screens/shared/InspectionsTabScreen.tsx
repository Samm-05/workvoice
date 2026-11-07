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
import { ClipboardList, Filter } from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import {
  AppHeader,
  FilterChips,
  InspectionCard,
  EmptyState,
} from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { useAuthStore } from '../../store/authStore';

export const InspectionsTabScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const role = useAuthStore((state) => state.role);
  const reports = useInspectionStore((state) => state.reports);
  const currentDraft = useInspectionStore((state) => state.currentDraft);

  const [selectedFilter, setSelectedFilter] = useState('all');

  // Combined technician work
  const allInspections = [currentDraft, ...reports.filter((r) => r.id !== currentDraft.id)];

  const counts = {
    all: allInspections.length,
    drafts: allInspections.filter((r) => r.status === 'draft').length,
    submitted: allInspections.filter((r) => r.status === 'submitted').length,
    approved: allInspections.filter((r) => r.status === 'approved').length,
  };

  const filterOptions = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'drafts', label: 'Drafts', count: counts.drafts },
    { id: 'submitted', label: 'Submitted', count: counts.submitted },
    { id: 'approved', label: 'Approved', count: counts.approved },
  ];

  const filteredItems = allInspections.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'drafts') return item.status === 'draft';
    if (selectedFilter === 'submitted') return item.status === 'submitted';
    if (selectedFilter === 'approved') return item.status === 'approved';
    return true;
  });

  // Group by Date Headers
  const todayItems = filteredItems.filter(
    (item) => item.createdAt.toLowerCase().includes('today') || item.createdAt.includes('Just now')
  );
  const earlierItems = filteredItems.filter(
    (item) => !item.createdAt.toLowerCase().includes('today') && !item.createdAt.includes('Just now')
  );

  const handleOpenReport = (reportId: string) => {
    if (role === 'supervisor') {
      navigation.navigate('SupervisorReportReview', { reportId });
    } else {
      navigation.navigate('ReviewReport');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* AppHeader: fixed 56px below status bar, left title, no hamburger, no "+" */}
      <AppHeader
        title="Inspections"
        subtitle="Technician work logs & active drafts"
      />

      {/* Horizontally scrollable Filter Chips with counts */}
      <FilterChips
        options={filterOptions}
        selectedId={selectedFilter}
        onSelect={setSelectedFilter}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No inspections found"
            description="You don't have any inspection records in this category."
            actionLabel="Start new inspection"
            onPressAction={() =>
              navigation.navigate('AssetDetail', { assetId: 'conveyor-c12' })
            }
          />
        ) : (
          <>
            {/* Group: Today */}
            {todayItems.length > 0 && (
              <View style={styles.groupSection}>
                <Text style={styles.groupDateHeader}>Today</Text>
                <View style={styles.cardsStack}>
                  {todayItems.map((item) => (
                    <InspectionCard
                      key={item.id}
                      title={`${item.assetName} Inspection`}
                      inspectorName={item.technicianName}
                      timestamp={item.createdAt}
                      summary={
                        item.transcript
                          ? item.transcript
                          : 'Routine inspection in progress.'
                      }
                      status={item.status}
                      thumbnailUrl={item.photos[0]?.uri}
                      onPress={() => handleOpenReport(item.id)}
                      onPressViewReport={() => handleOpenReport(item.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Group: Earlier */}
            {earlierItems.length > 0 && (
              <View style={styles.groupSection}>
                <Text style={styles.groupDateHeader}>Earlier</Text>
                <View style={styles.cardsStack}>
                  {earlierItems.map((item) => (
                    <InspectionCard
                      key={item.id}
                      title={`${item.assetName} Inspection`}
                      inspectorName={item.technicianName}
                      timestamp={item.createdAt}
                      summary={item.transcript || 'Inspection complete.'}
                      status={item.status}
                      thumbnailUrl={item.photos[0]?.uri}
                      onPress={() => handleOpenReport(item.id)}
                      onPressViewReport={() => handleOpenReport(item.id)}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
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
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 40,
  },
  groupSection: {
    marginBottom: spacing.sectionGap,
  },
  groupDateHeader: {
    ...typography.sectionTitle,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  cardsStack: {
    gap: spacing.cardGap,
  },
});
