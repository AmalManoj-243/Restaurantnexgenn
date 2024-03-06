import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Text from '@components/Text';
import { COLORS, FONT_FAMILY } from '@constants/theme';

const NavigationHeader = ({ title, onBackPress }) => {
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBackPress} style={styles.goBackContainer}>
                <Image source={require('@assets/images/header/left_arrow.png')} style={styles.arrowImage} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <Image source={require('@assets/images/header/logo_header.png')} style={styles.logoImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        backgroundColor: COLORS.primaryThemeColor,
    },
    goBackContainer: {
        marginRight: 5,
    },
    arrowImage: {
        width: Dimensions.get('window').width * 0.15,
        height: 15,
        resizeMode: 'contain',
        tintColor: 'white',
    },
    title: {
        color: COLORS.white,
        fontSize: 20,
        fontFamily: FONT_FAMILY.urbanistBold,
        flex: 1,
        // paddingLeft: 10,
    },
    logoImage: {
        width: '30%',
        height: '600%',
        resizeMode: 'contain', // Adjust the resizeMode as needed
        // overflow: 'hidden'
    },
});

export default NavigationHeader;
