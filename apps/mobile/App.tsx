import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
} from '@expo-google-fonts/playfair-display';
import {
  Lora_400Regular,
  Lora_700Bold,
  Lora_400Regular_Italic,
} from '@expo-google-fonts/lora';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/Onboarding/OnboardingScreen';
import { LoadingScreen } from './src/screens/Loading/LoadingScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { useAppStore } from './src/store/appStore';

const ONBOARDED_KEY = '@theloop:onboarded';

export default function App() {
  const { showOnboarding, setShowOnboarding } = useAppStore();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    Lora_400Regular,
    Lora_700Bold,
    Lora_400Regular_Italic,
  });

  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [minLoadElapsed, setMinLoadElapsed] = useState(false);

  // Minimum loading screen display — 1.5s branded moment (future: sponsor slot)
  useEffect(() => {
    const t = setTimeout(() => setMinLoadElapsed(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((value) => {
      setShowOnboarding(value === null);
      setOnboardingChecked(true);
    });
  }, []);

  const handleContinue = async () => {
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
    setShowOnboarding(false);
  };

  if (!fontsLoaded || !onboardingChecked || !minLoadElapsed) {
    return <LoadingScreen />;
  }

  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <OnboardingScreen onContinue={handleContinue} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <AppNavigator />
    </ErrorBoundary>
  );
}
