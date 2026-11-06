import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { Mic, ShieldCheck, Activity, Cpu } from 'lucide-react-native';
import { colors, radii, typography, spacing } from '../../theme/tokens';
import { PrimaryButton, SecondaryButton, PaginationDots } from '../../components';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to WorkVoice!',
    subtitle: 'Inspect by speaking. Report in seconds.',
    badge1: 'Conveyor C-12 · Line 2',
    badge2: 'Drive Pulley Lagging Flagged',
  },
  {
    title: 'AI Industrial Intelligence',
    subtitle: 'Extract defects and checklist status in real-time.',
    badge1: '98% Defect Extraction',
    badge2: 'Instant Sensor Correlation',
  },
  {
    title: 'Seamless Supervisor Flow',
    subtitle: 'Approve reports and assign corrective actions instantly.',
    badge1: 'Lockout Tagout Ready',
    badge2: 'Automated Work Orders',
  },
];

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top ~60% Accent Hero Area */}
      <View style={styles.heroArea}>
        {/* Arch illustration container */}
        <View style={styles.archFrame}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.archImage}
            contentFit="cover"
          />

          {/* Floating pill cards on hero */}
          <View style={styles.floatingCardTop}>
            <View style={styles.cardDotRed} />
            <Text style={styles.floatingCardText}>{slide.badge2}</Text>
          </View>

          <View style={styles.floatingCardBottom}>
            <Activity size={14} color={colors.accentBlue.text} strokeWidth={2.2} />
            <Text style={styles.floatingCardText}>{slide.badge1}</Text>
          </View>
        </View>

        {/* Pagination Dots (5 dots, 6px, active white / inactive 50%) */}
        <View style={styles.dotsWrapper}>
          <PaginationDots
            total={5}
            activeIndex={currentSlide}
            activeColor="#FFFFFF"
            inactiveColor="rgba(255, 255, 255, 0.4)"
            dotSize={6}
          />
        </View>
      </View>

      {/* Bottom White Card */}
      <View style={styles.bottomSheet}>
        <View style={styles.contentWrap}>
          <Text style={styles.displayTitle}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <PrimaryButton
            label={currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
          />
          <SecondaryButton label="Skip" onPress={handleSkip} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accentHero,
  },
  heroArea: {
    flex: 1.4,
    backgroundColor: colors.accentHero,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 40,
  },
  archFrame: {
    width: 200,
    height: 250,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 8,
  },
  archImage: {
    width: '100%',
    height: '100%',
    opacity: 0.88,
  },
  floatingCardTop: {
    position: 'absolute',
    top: 50,
    left: -40,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardDotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.heartRed,
  },
  floatingCardBottom: {
    position: 'absolute',
    bottom: 30,
    right: -36,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingCardText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dotsWrapper: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.bottomSheet,
    borderTopRightRadius: radii.bottomSheet,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: 'space-between',
    elevation: 8,
  },
  contentWrap: {
    alignItems: 'center',
  },
  displayTitle: {
    ...typography.display,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  buttonGroup: {
    gap: 12,
  },
});
