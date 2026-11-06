import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, Cpu, ArrowRight } from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import { HeaderBar, ImageCard, Chip, StatusChip } from '../../components';
import { mockAssets } from '../../services/mockData';
import { useInspectionStore } from '../../store/inspectionStore';

export const AssetsTabScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const initC12Draft = useInspectionStore((state) => state.initC12Draft);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState('All');

  const filteredAssets = mockAssets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLine = selectedLine === 'All' || a.line.includes(selectedLine);
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
      <HeaderBar title="Plant Assets" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search assets, lines, tags…"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Line filter chips */}
      <View style={styles.filterRow}>
        {['All', 'Line 1', 'Line 2', 'Line 3'].map((line) => (
          <Chip
            key={line}
            label={line}
            active={selectedLine === line}
            onPress={() => setSelectedLine(line)}
            style={{ marginRight: 8 }}
          />
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.resultsCount}>
          Showing {filteredAssets.length} industrial assets
        </Text>

        <View style={styles.cardGrid}>
          {filteredAssets.map((asset) => (
            <ImageCard
              key={asset.id}
              title={asset.name}
              meta={`${asset.line} · ${asset.location}`}
              imageUrl={asset.imageUrl}
              aspectRatio={0.9}
              status={asset.status}
              statusLabel={asset.statusLabel}
              onPress={() => handleSelectAsset(asset.id)}
              onAdd={() => handleSelectAsset(asset.id)}
              style={styles.cardItem}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    height: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    ...typography.body,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  resultsCount: {
    ...typography.meta,
    marginBottom: 12,
    color: colors.textSecondary,
  },
  cardGrid: {
    gap: 14,
  },
  cardItem: {
    marginBottom: 4,
  },
});
