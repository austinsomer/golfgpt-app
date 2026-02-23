import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  onContinue: () => void;
}

export function OnboardingScreen({ onContinue }: Props) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../../assets/splash-bg.jpg')}
        style={styles.image}
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          {/* Scrollable manifesto */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>Walk the Loop</Text>

            {/* Block 1 */}
            <Text style={styles.body}>
              Golf was never meant to feel transactional.
            </Text>

            {/* Block 2 */}
            <Text style={styles.body}>
              It was meant to be walked.{'\n'}
              Talked through.{'\n'}
              Booked with intention.
            </Text>

            {/* Block 3 */}
            <Text style={styles.body}>
              You shouldn't have to refresh five websites to find a morning round.{'\n'}
              You shouldn't feel like a guest at every course you play.
            </Text>

            {/* Block 4 */}
            <Text style={styles.body}>
              The Loop exists for the public golfer who wants more.
            </Text>

            {/* Block 5 — short lines */}
            <Text style={styles.body}>
              More access.{'\n'}
              More intention.{'\n'}
              More feel.
            </Text>

            {/* Block 6 */}
            <Text style={styles.body}>
              No gatekeeping.{'\n'}
              No velvet ropes.{'\n'}
              Just better golf — from the first tee to the last putt.
            </Text>

            {/* Block 7 */}
            <Text style={styles.body}>
              You're not just booking a time.
            </Text>

            {/* Closing line */}
            <Text style={styles.closing}>
              You're in the Loop.
            </Text>

            {/* Bottom spacer so last line clears the button */}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Pinned Continue button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 15, 5, 0.62)',
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 1.5,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 36,
    color: '#F5F0E8',
    marginBottom: spacing.xl,
    lineHeight: 42,
  },
  body: {
    fontFamily: typography.body,
    fontSize: 17,
    color: '#F5F0E8',
    lineHeight: 27,
    marginBottom: spacing.lg,
    opacity: 0.92,
  },
  closing: {
    fontFamily: typography.bodyItalic,
    fontSize: 22,
    color: '#F5F0E8',
    marginTop: spacing.md,
    lineHeight: 30,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: colors.brandGreen,
    paddingVertical: spacing.md,
    alignItems: 'center',
    // Sharp corners — on brand
    borderRadius: 0,
  },
  buttonText: {
    fontFamily: typography.serif,
    fontSize: 14,
    letterSpacing: 2.5,
    color: '#F5F0E8',
  },
});
