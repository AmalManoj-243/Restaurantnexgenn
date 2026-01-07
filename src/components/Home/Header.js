import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Header = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('@assets/images/Home/Header/header_transparent_bg.png')} 
        style={styles.backgroundImage} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    // Add any additional styles for the container if needed
  },
  backgroundImage: {
    width: width * 0.42,
    aspectRatio: 3,
    resizeMode: 'contain',
  },
  
});

export default Header;
