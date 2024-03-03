import React, { useMemo } from 'react';
import { View, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import THEME from '@constants/theme';
import Text from '@components/Text';
import CarouselPagination from '@components/Home/CarouselPagination';
import BottomSheet from "@gorhom/bottom-sheet";

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  const snapPoints = useMemo(() => ["50%", "85%"], []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.COLORS.appTheme }}>
      <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
          <Image source={require('@assets/images/Home/Header/header_transparent_bg.png')} style={{ width: width * 0.5, aspectRatio: 3 }} />
          <Image source={require('@assets/images/Home/Header/notification.gif')} style={{ width: width * 0.25, aspectRatio: 2 / 1, resizeMode: 'contain' }} />
        </View>

        {/* Navigation Header */}
        <View style={{ backgroundColor: '#2e294e', padding: 10, marginHorizontal: 20, borderRadius: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 }}>
          <TouchableOpacity onPress={() => navigation.navigate('SearchProducts')}>
            <Image source={require('@assets/images/Home/Header/search.png')} style={{ width: 20, height: 20 }} tintColor="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Options')}>
            <Text style={{ color: 'white', fontFamily: THEME.FONT_FAMILY.urbanistLight }}>What are you looking for ?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
            <Image source={require('@assets/images/Home/Header/barcode_scanner.png')} style={{ width: 20, height: 20 }} tintColor="white" />
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <CarouselPagination />

        {/* Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 8 }}>
          <ImageContainer source={require('@assets/images/Home/section/pickup.png')} onPress={() => navigateToScreen('Pickup')} backgroundColor="#f37021" title="Pickup" />
          <ImageContainer source={require('@assets/images/Home/section/services.png')} onPress={() => navigateToScreen('Services')} backgroundColor="#f37021" title="Services" />
          <ImageContainer source={require('@assets/images/Home/section/customer.png')} onPress={() => navigateToScreen('Customer')} backgroundColor="#f37021" title="Customer" />
        </View>
        {/* Bottom sheet */}
          <BottomSheet snapPoints={snapPoints}>
            <View style={{
              flex: 1,
              alignItems: "center",
            }}>
            </View>
          </BottomSheet>
        </View>
    </SafeAreaView>
  );
}

const ImageContainer = ({ source, onPress, backgroundColor, title }) => (
  <View style={styles.imageContainer}>
    <Image source={source} style={styles.image} />
    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    height: 100,
    width: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 10
  },
  image: {
    width: width * 0.25,
    height: width * 0.11,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '85%',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    // marginVertical:5
    marginTop: 5,
  },
  buttonText: {
    color: THEME.COLORS.white,
    fontFamily: THEME.FONT_FAMILY.urbanistBold
  },
});

export default HomeScreen;
