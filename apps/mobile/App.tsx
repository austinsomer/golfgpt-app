import React from 'react';
import { View, ActivityIndicator } from 'react-native';
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
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/constants/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    Lora_400Regular,
    Lora_700Bold,
    Lora_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgCream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brandGreen} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}
