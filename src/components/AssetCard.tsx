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
import { Heart } from 'lucide-react-native';
import { colors, radii, typography, spacing, elevation } from '../theme/tokens';
import { StatusPill } from './StatusPill';

interface AssetCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  status: string;
  statusLabel?: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  style?: ViewStyle;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  title,
  subtitle,
  imageUrl,
  status,
  statusLabel,
  isFavorite = false,
  onPress,
  onToggleFavorite,
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
      accessibilityLabel={`Asset ${title}, ${subtitle}`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />

        <LinearGradient
          colors={colors.imageGradient as any}
          style={styles.gradient}
        />

        {/* Top Badges */}
        <View style={styles.topRow}>
          <StatusPill status={status} label={statusLabel} />

          {onToggleFavorite && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              hitSlop={8}
              style={styles.favoriteButton}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Remove favorite' : 'Add to favorites'}
            >
              <Heart
                size={18}
                color={isFavorite ? colors.heartRed : '#FFFFFF'}
                fill={isFavorite ? colors.heartRed : 'transparent'}
                strokeWidth={2}
              />
            </Pressable>
          )}
        </View>

        {/* Bottom Overlay Info (Title + Subtitle on 1 line each) */}
        <View style={styles.bottomInfo}>
          <Text
            style={styles.titleText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text
            style={styles.subtitleText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    justifyContent: 'space-between',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '65%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    zIndex: 2,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomInfo: {
    padding: 12,
    zIndex: 2,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitleText: {
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  pressed: {
    opacity: 0.9,
  },
});
