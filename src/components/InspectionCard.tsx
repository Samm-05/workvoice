import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { colors, radii, typography, spacing, elevation } from '../theme/tokens';
import { StatusPill } from './StatusPill';

interface InspectionCardProps {
  title: string;
  inspectorName: string;
  timestamp: string;
  summary?: string;
  status: string;
  statusLabel?: string;
  thumbnailUrl?: string;
  onPress?: () => void;
  onPressViewReport?: () => void;
  style?: ViewStyle;
}

export const InspectionCard: React.FC<InspectionCardProps> = ({
  title,
  inspectorName,
  timestamp,
  summary,
  status,
  statusLabel,
  thumbnailUrl,
  onPress,
  onPressViewReport,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: elevation.ripple }}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title}, status ${status}`}
    >
      <View style={styles.contentRow}>
        {/* Optional 56x56 Thumbnail on the left */}
        {thumbnailUrl ? (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={150}
          />
        ) : null}

        {/* Right Details */}
        <View style={styles.textContainer}>
          {/* Row 1: Title + Status Pill */}
          <View style={styles.headerRow}>
            <Text
              style={styles.title}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <StatusPill status={status} label={statusLabel} style={styles.statusPill} />
          </View>

          {/* Row 2: Caption on a single line */}
          <Text
            style={styles.captionLine}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {inspectorName} · {timestamp}
          </Text>

          {/* Row 3: Voice summary (max 2 lines, ellipsized) */}
          {summary ? (
            <Text
              style={styles.summaryText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {summary}
            </Text>
          ) : null}

          {/* Bottom Row: Text button "View report" aligned right */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={onPressViewReport || onPress}
              hitSlop={8}
              style={styles.viewReportBtn}
            >
              <Text style={styles.viewReportText}>View report</Text>
              <ChevronRight size={14} color={colors.primary} strokeWidth={2} />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
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
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: radii.smallThumb,
    backgroundColor: colors.surfaceMuted,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    ...typography.cardTitle,
    flex: 1,
    flexShrink: 1,
  },
  statusPill: {
    flexShrink: 0,
  },
  captionLine: {
    ...typography.caption,
    marginTop: 4,
  },
  summaryText: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  viewReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 28,
  },
  viewReportText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.88,
  },
});
