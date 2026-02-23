import React from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require('../../../assets/loading-screen.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D5A2A', // brand green — covers any edge bleed
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
