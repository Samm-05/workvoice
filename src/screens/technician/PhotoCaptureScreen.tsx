import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import {
  X,
  Camera,
  RotateCcw,
  Check,
  Heart,
  Plus,
  ArrowRight,
} from 'lucide-react-native';
import { colors, radii, typography, elevation } from '../../theme/tokens';
import { IconButton, PrimaryButton, SecondaryButton } from '../../components';
import { useInspectionStore } from '../../store/inspectionStore';
import { InspectionPhoto } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const libraryPhotos = [
  {
    uri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    label: 'Drive pulley 2 worn grooving',
  },
  {
    uri: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    label: '18mm south belt drift at guide bracket',
  },
  {
    uri: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    label: 'Return idler 4 metal dust trace',
  },
  {
    uri: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    label: 'Motor mount vibration isolation check',
  },
];

export const PhotoCaptureScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const currentDraft = useInspectionStore((state) => state.currentDraft);
  const addPhoto = useInspectionStore((state) => state.addPhoto);
  const togglePhotoFlag = useInspectionStore((state) => state.togglePhotoFlag);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [previewUri, setPreviewUri] = useState(libraryPhotos[0].uri);

  const handleShutter = () => {
    const selected = libraryPhotos[activePhotoIndex % libraryPhotos.length];
    setPreviewUri(selected.uri);
    setIsPhotoCaptured(true);
  };

  const handleRetake = () => {
    setIsPhotoCaptured(false);
  };

  const handleUsePhoto = () => {
    const selected = libraryPhotos[activePhotoIndex % libraryPhotos.length];
    const newPhoto: InspectionPhoto = {
      id: `photo-${Date.now()}`,
      uri: previewUri,
      label: selected.label,
      timestamp: 'Just now',
      flagged: true,
    };
    addPhoto(newPhoto);
    setIsPhotoCaptured(false);
    setActivePhotoIndex((prev) => (prev + 1) % libraryPhotos.length);
  };

  const handleDone = () => {
    navigation.navigate('ReviewReport');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header Bar over Camera viewfinder */}
      <View style={styles.topBar}>
        <IconButton
          icon={<X size={20} color={colors.onPrimary} strokeWidth={2.2} />}
          onPress={() => navigation.goBack()}
          size={40}
          bg="rgba(255,255,255,0.2)"
        />
        <View style={styles.assetBadge}>
          <Text style={styles.assetBadgeText}>Conveyor C-12 · Defect Lens</Text>
        </View>
        <Pressable onPress={handleDone} style={styles.donePill}>
          <Text style={styles.donePillText}>Review ({currentDraft.photos.length})</Text>
        </Pressable>
      </View>

      {/* Camera Viewfinder / Preview */}
      <View style={styles.viewfinder}>
        <Image
          source={{ uri: previewUri }}
          style={styles.fullImage}
          contentFit="cover"
        />

        {/* Framing Grid overlay */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridLineH} />
          <View style={styles.gridLineH} />
          <View style={styles.gridLineV} />
          <View style={styles.gridLineV} />
        </View>

        {/* Capture Mode Overlay / Indicator */}
        <View style={styles.viewfinderLabel}>
          <Text style={styles.viewfinderLabelText}>
            {libraryPhotos[activePhotoIndex % libraryPhotos.length].label}
          </Text>
        </View>
      </View>

      {/* Bottom Controls Area */}
      <View style={styles.bottomControls}>
        {/* Thumbnail strip */}
        <View style={styles.thumbnailStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currentDraft.photos.map((photo) => (
              <Pressable
                key={photo.id}
                onPress={() => {
                  setPreviewUri(photo.uri);
                  setIsPhotoCaptured(true);
                }}
                style={styles.thumbnailWrapper}
              >
                <Image source={{ uri: photo.uri }} style={styles.thumbnailImg} />
                {photo.flagged && (
                  <View style={styles.thumbFlagBadge}>
                    <Heart size={8} color={colors.onPrimary} fill={colors.heartRed} />
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {isPhotoCaptured ? (
          /* Confirmation controls after shutter */
          <View style={styles.confirmRow}>
            <Pressable onPress={handleRetake} style={styles.retakeBtn}>
              <RotateCcw size={16} color={colors.onPrimary} strokeWidth={2.2} />
              <Text style={styles.retakeText}>Retake</Text>
            </Pressable>

            <Pressable onPress={handleUsePhoto} style={styles.usePhotoBtn}>
              <Check size={18} color={colors.primary} strokeWidth={2.5} />
              <Text style={styles.usePhotoText}>Use Photo</Text>
            </Pressable>
          </View>
        ) : (
          /* Live Shutter Row */
          <View style={styles.shutterRow}>
            <Pressable
              onPress={() =>
                setActivePhotoIndex((prev) => (prev + 1) % libraryPhotos.length)
              }
              style={styles.cycleAngleBtn}
            >
              <RotateCcw size={18} color={colors.onPrimary} />
            </Pressable>

            {/* White Pill Shutter button */}
            <Pressable onPress={handleShutter} style={styles.pillShutter}>
              <View style={styles.pillShutterInner} />
            </Pressable>

            <Pressable onPress={handleDone} style={styles.proceedNextBtn}>
              <ArrowRight size={20} color={colors.onPrimary} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    zIndex: 10,
  },
  assetBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  assetBadgeText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  donePill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  donePillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  viewfinder: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-evenly',
  },
  gridLineH: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '33.3%',
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  viewfinderLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  viewfinderLabelText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },
  thumbnailStrip: {
    height: 52,
    marginBottom: 16,
  },
  thumbnailWrapper: {
    width: 48,
    height: 48,
    borderRadius: radii.smallThumb,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 2,
    borderColor: colors.surface,
    position: 'relative',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  thumbFlagBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.heartRed,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  cycleAngleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillShutter: {
    width: 90,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  pillShutterInner: {
    width: 80,
    height: 42,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: '#000',
  },
  proceedNextBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  retakeBtn: {
    flex: 1,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retakeText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  usePhotoBtn: {
    flex: 1,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.onPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  usePhotoText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
