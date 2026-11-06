import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { Camera, Check, ChevronRight } from 'lucide-react-native';
import { colors, radii, typography, elevation } from '../theme/tokens';
import { StatusChip } from './Chip';
import { StatusType } from '../theme/tokens';

interface ListRowProps {
  title: string;
  meta?: string;
  body?: string;
  status?: StatusType;
  statusLabel?: string;
  trailingText?: string;
  imageUrl?: string;
  imageActionLabel?: string;
  onPressImageAction?: () => void;
  onPress?: () => void;
  showChevron?: boolean;
  isConfirmed?: boolean;
  onToggleConfirm?: () => void;
  verifiedBadge?: string;
  style?: ViewStyle;
}

export const ListRow: React.FC<ListRowProps> = ({
  title,
  meta,
  body,
  status,
  statusLabel,
  trailingText,
  imageUrl,
  imageActionLabel = 'View photo',
  onPressImageAction,
  onPress,
  showChevron = false,
  isConfirmed,
  onToggleConfirm,
  verifiedBadge,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      android_ripple={onPress ? { color: elevation.ripple } : undefined}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {meta && <Text style={styles.meta}>{meta}</Text>}
        </View>

        <View style={styles.trailingArea}>
          {status && <StatusChip status={status} label={statusLabel} />}
          {trailingText && <Text style={styles.trailingText}>{trailingText}</Text>}
          {showChevron && <ChevronRight size={18} color={colors.textTertiary} />}
        </View>
      </View>

      {/* Body text */}
      {body ? <Text style={styles.bodyText}>{body}</Text> : null}

      {/* Verification badges */}
      {(verifiedBadge || isConfirmed !== undefined) && (
        <View style={styles.badgeRow}>
          {isConfirmed !== undefined && (
            <Pressable
              onPress={onToggleConfirm}
              style={[
                styles.confirmPill,
                isConfirmed ? styles.confirmPillActive : styles.confirmPillInactive,
              ]}
            >
              <Check
                size={12}
                color={isConfirmed ? colors.status.success.text : colors.textSecondary}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.confirmText,
                  isConfirmed && { color: colors.status.success.text },
                ]}
              >
                {isConfirmed ? 'Technician Confirmed' : 'Tap to confirm'}
              </Text>
            </Pressable>
          )}

          {verifiedBadge && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>{verifiedBadge}</Text>
            </View>
          )}
        </View>
      )}

      {/* Optional Full-width Image with "Map"-style Black Pill Button */}
      {imageUrl && (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          <Pressable
            onPress={onPressImageAction}
            style={styles.mapPillButton}
            android_ripple={{ color: elevation.ripple }}
          >
            <Camera size={14} color={colors.onPrimary} strokeWidth={2} />
            <Text style={styles.mapPillText}>{imageActionLabel}</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.meta,
    marginTop: 2,
  },
  trailingArea: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  trailingText: {
    ...typography.meta,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  bodyText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  confirmPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  confirmPillActive: {
    backgroundColor: colors.status.success.bg,
  },
  confirmPillInactive: {
    backgroundColor: colors.surfaceMuted,
  },
  confirmText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  verifiedBadge: {
    backgroundColor: colors.status.info.bg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.status.info.text,
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    position: 'relative',
    backgroundColor: colors.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  mapPillButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  mapPillText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
