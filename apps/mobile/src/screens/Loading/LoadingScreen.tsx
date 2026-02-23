import React from 'react';
import { View, Image, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { colors, typography } from '../../constants/theme';

const { width } = Dimensions.get('window');
const WORDMARK_WIDTH = width * 0.72;
// Original asset is 2016×1134 — maintain aspect ratio
const WORDMARK_HEIGHT = WORDMARK_WIDTH * (1134 / 2016);

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.content}>
        <Image
          source={require('../../../assets/the-loop-wordmark.png')}
          style={styles.wordmark}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Utah Tee Times Made Easy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    // Nudge the group slightly above true center — matches the V2 design
    marginBottom: 48,
  },
  wordmark: {
    width: WORDMARK_WIDTH,
    height: WORDMARK_HEIGHT,
  },
  tagline: {
    marginTop: 20,
    fontFamily: typography.serifRegular,
    fontSize: 13,
    letterSpacing: 2.5,
    color: colors.bgCream,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
});
