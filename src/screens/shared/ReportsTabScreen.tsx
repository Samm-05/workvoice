import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Search,
  FileCheck2,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import { colors, radii, typography, spacing, elevation } from '../../theme/tokens';
import {
  AppHeader,
  FilterChips,
  StatusPill,
  EmptyState,
} from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { useAuthStore } from '../../store/authStore';

export const ReportsTabScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const role = useAuthStore((state) => state.role);
  const reports = useInspectionStore((state) => state.reports);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Reports only shows Submitted and Approved outputs
  const finalReports = reports.filter(
    (r) => r.status === 'submitted' || r.status === 'approved'
  );

  const lineOptions = [
    { id: 'all', label: 'All Lines' },
    { id: 'line1', label: 'Line 1' },
    { id: 'line2', label: 'Line 2' },
    { id: 'line3', label: 'Line 3' },
  ];

  const filteredReports = finalReports.filter((item) => {
    // Search filter
    const matchesSearch =
      item.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.line.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transcript.toLowerCase().includes(searchQuery.toLowerCase());

    // Line filter
    const matchesLine =
      selectedLine === 'all' ||
      (selectedLine === 'line1' && item.line.includes('Line 1')) ||
      (selectedLine === 'line2' && item.line.includes('Line 2')) ||
      (selectedLine === 'line3' && item.line.includes('Line 3'));

    // Status filter
    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesLine && matchesStatus;
  });

  const handleOpenReport = (reportId: string) => {
    if (role === 'supervisor') {
      navigation.navigate('SupervisorReportReview', { reportId });
    } else {
      navigation.navigate('ReviewReport');
    }
  };

  const approvedCount = finalReports.filter((r) => r.status === 'approved').length;
  const pendingReviewCount = finalReports.filter((r) => r.status === 'submitted').length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* AppHeader: fixed 56px below status bar, left title */}
      <AppHeader
        title="Reports"
        subtitle="Verified audit documentation & compliance records"
      />

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search reports, asset ID, or findings…"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filter Chips by Line */}
      <FilterChips
        options={lineOptions}
        selectedId={selectedLine}
        onSelect={setSelectedLine}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Metric Summary Cards */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>{finalReports.length}</Text>
            <Text style={styles.metricLabel}>Total Reports</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: colors.status.approved.text }]}>
              {approvedCount}
            </Text>
            <Text style={styles.metricLabel}>Approved</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: colors.status.submitted.text }]}>
              {pendingReviewCount}
            </Text>
            <Text style={styles.metricLabel}>Awaiting Review</Text>
          </View>
        </View>

        {/* Reports List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            Certified Audit Records ({filteredReports.length})
          </Text>
        </View>

        {filteredReports.length === 0 ? (
          <EmptyState
            icon={FileCheck2}
            title="No reports match your filters"
            description="Try clearing your search query or switching lines."
            actionLabel="Reset filters"
            onPressAction={() => {
              setSearchQuery('');
              setSelectedLine('all');
            }}
          />
        ) : (
          <View style={styles.reportsList}>
            {filteredReports.map((report) => (
              <Pressable
                key={report.id}
                onPress={() => handleOpenReport(report.id)}
                android_ripple={{ color: elevation.ripple }}
                style={({ pressed }) => [
                  styles.reportCard,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Report for ${report.assetName}`}
              >
                {/* Header: Asset Name & Status Pill */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                    <Text
                      style={styles.reportTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {report.assetName}
                    </Text>
                    <Text style={styles.reportMeta} numberOfLines={1}>
                      {report.id.toUpperCase()} · {report.line}
                    </Text>
                  </View>
                  <StatusPill status={report.status} />
                </View>

                {/* Body Summary */}
                <Text
                  style={styles.summaryText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {report.transcript || 'Inspection completed according to line standards.'}
                </Text>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Footer: Verification info & action button */}
                <View style={styles.cardFooter}>
                  <View style={styles.verifierWrap}>
                    <ShieldCheck size={14} color={colors.primary} />
                    <Text style={styles.verifierText} numberOfLines={1}>
                      {report.status === 'approved'
                        ? 'Supervisor Approved'
                        : 'Submitted for Review'}
                    </Text>
                  </View>

                  <View style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>Open report</Text>
                    <ChevronRight size={14} color={colors.primary} />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
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
  searchSection: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  searchBar: {
    height: 44,
    borderRadius: radii.input,
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 40,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.cardGap,
    marginBottom: spacing.sectionGap,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  metricNumber: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.text,
  },
  metricLabel: {
    ...typography.caption,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.sectionTitle,
  },
  reportsList: {
    gap: spacing.cardGap,
  },
  reportCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reportTitle: {
    ...typography.cardTitle,
  },
  reportMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  summaryText: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifierWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  verifierText: {
    ...typography.captionStrong,
    color: colors.textSecondary,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 32,
    justifyContent: 'center',
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.88,
  },
});
