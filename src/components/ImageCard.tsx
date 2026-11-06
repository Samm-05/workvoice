import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Plus } from 'lucide-react-native';
import { colors, radii, typography, elevation } from '../theme/tokens';
import { StatusChip } from './Chip';
import { StatusType } from '../theme/tokens';

interface ImageCardProps {
  title: string;
  meta?: string;
  imageUrl: string;
  aspectRatio?: number;
  width?: number | `${number}%`;
  status?: StatusType;
  statusLabel?: string;
  onPress?: () => void;
  onFlag?: () => void;
  onAdd?: () => void;
  isFlagged?: boolean;
  style?: ViewStyle;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  title,
  meta,
  imageUrl,
  aspectRatio = 0.82,
  width,
  status,
  statusLabel,
  onPress,
  onFlag,
  onAdd,
  isFlagged = false,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: elevation.ripple }}
      style={({ pressed }) => [
        styles.cardContainer,
        { aspectRatio },
        width ? { width } : { flex: 1 },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <LinearGradient
        colors={colors.imageGradient as any}
        style={styles.gradient}
      />

      {/* Top action badges */}
      <View style={styles.topActions}>
        {status ? (
          <StatusChip status={status} label={statusLabel} />
        ) : (
          <View />
        )}

        <View style={styles.iconButtonGroup}>
          {onFlag && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onFlag();
              }}
              style={[styles.circleButton, isFlagged && styles.circleButtonActive]}
              accessibilityLabel="Flag item"
            >
              <Heart
                size={16}
                color={isFlagged ? colors.heartRed : colors.onPrimary}
                fill={isFlagged ? colors.heartRed : 'transparent'}
                strokeWidth={2}
              />
            </Pressable>
          )}

          {onAdd && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              style={styles.circleButton}
              accessibilityLabel="Add to report"
            >
              <Plus size={16} color={colors.onPrimary} strokeWidth={2.2} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Bottom overlay text */}
      <View style={styles.bottomContent}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {meta && (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: radii.imageCard,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    position: 'relative',
    justifyContent: 'space-between',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '65%',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    zIndex: 2,
  },
  iconButtonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  circleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  bottomContent: {
    padding: 14,
    zIndex: 2,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  meta: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  pressed: {
    opacity: 0.92,
  },
});
