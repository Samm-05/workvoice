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
import { Search, Cpu, ArrowRight, Gauge, Clock } from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors, radii, typography, spacing, elevation } from '../../theme/tokens';
import {
  AppHeader,
  FilterChips,
  StatusPill,
  EmptyState,
} from '../../components';
import { mockAssets } from '../../services/mockData';
import { useInspectionStore } from '../../store/inspectionStore';

export const AssetsTabScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const initC12Draft = useInspectionStore((state) => state.initC12Draft);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState('all');

  const lineOptions = [
    { id: 'all', label: 'All Lines', count: mockAssets.length },
    { id: 'line1', label: 'Line 1' },
    { id: 'line2', label: 'Line 2' },
    { id: 'line3', label: 'Line 3' },
  ];

  const filteredAssets = mockAssets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLine =
      selectedLine === 'all' ||
      (selectedLine === 'line1' && a.line.includes('Line 1')) ||
      (selectedLine === 'line2' && a.line.includes('Line 2')) ||
      (selectedLine === 'line3' && a.line.includes('Line 3'));

    return matchesSearch && matchesLine;
  });

  const handleSelectAsset = (assetId: string) => {
    if (assetId === 'conveyor-c12') {
      initC12Draft();
    }
    navigation.navigate('AssetDetail', { assetId });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* AppHeader: fixed 56px below status bar */}
      <AppHeader
        title="Assets"
        subtitle="Assembly lines, conveyors, and tooling stations"
      />

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by asset name, location, or tag…"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Line filter chips */}
      <FilterChips
        options={lineOptions}
        selectedId={selectedLine}
        onSelect={setSelectedLine}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.resultsCount}>
          Showing {filteredAssets.length} industrial assets
        </Text>

        {filteredAssets.length === 0 ? (
          <EmptyState
            icon={Cpu}
            title="No assets found"
            description="No industrial equipment matches your current search or line filter."
            actionLabel="Reset filters"
            onPressAction={() => {
              setSearchQuery('');
              setSelectedLine('all');
            }}
          />
        ) : (
          <View style={styles.assetsList}>
            {filteredAssets.map((asset) => (
              <Pressable
                key={asset.id}
                onPress={() => handleSelectAsset(asset.id)}
                android_ripple={{ color: elevation.ripple }}
                style={({ pressed }) => [
                  styles.assetCard,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${asset.name}, ${asset.location}`}
              >
                <View style={styles.cardTopRow}>
                  {/* Thumbnail 72x72 */}
                  <Image
                    source={{ uri: asset.imageUrl }}
                    style={styles.thumbnail}
                    contentFit="cover"
                    transition={150}
                  />

                  {/* Info Column */}
                  <View style={styles.infoCol}>
                    <View style={styles.titleRow}>
                      <Text
                        style={styles.assetName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {asset.name}
                      </Text>
                      <StatusPill status={asset.status} label={asset.statusLabel} />
                    </View>

                    <Text
                      style={styles.locationText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {asset.line} · {asset.location}
                    </Text>

                    <Text
                      style={styles.descText}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {asset.description}
                    </Text>
                  </View>
                </View>

                {/* Card Meta Stats Bar */}
                <View style={styles.statsBar}>
                  <View style={styles.statItem}>
                    <Gauge size={13} color={colors.textSecondary} />
                    <Text style={styles.statText}>Speed: {asset.speedRating}</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Clock size={13} color={colors.textSecondary} />
                    <Text style={styles.statText}>{asset.operatingHours} hrs logged</Text>
                  </View>

                  <View style={styles.inspectBtn}>
                    <Text style={styles.inspectBtnText}>Inspect</Text>
                    <ArrowRight size={13} color={colors.primary} />
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
  resultsCount: {
    ...typography.caption,
    marginBottom: 12,
    color: colors.textSecondary,
  },
  assetsList: {
    gap: spacing.cardGap,
  },
  assetCard: {
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
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: radii.smallThumb,
    backgroundColor: colors.surfaceMuted,
    flexShrink: 0,
  },
  infoCol: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  assetName: {
    ...typography.cardTitle,
    flex: 1,
    flexShrink: 1,
  },
  locationText: {
    ...typography.caption,
    marginTop: 2,
  },
  descText: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: colors.divider,
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    minHeight: 28,
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.88,
  },
});
