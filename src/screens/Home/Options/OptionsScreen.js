import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { CommonContainer } from '@components/common'
// import { NavigationHeader } from '@components/Home'

import NavigationHeader from '@components/Header/NavigationHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '@constants/theme'
const OptionsScreen = () => {
  return (
   <SafeAreaView style={{flex: 1, backgroundColor:COLORS.primaryThemeColor, paddingTop: 5}}>
    <NavigationHeader title="Options"/>
    <View style={{flex: 1, backgroundColor: 'white'}}></View>
   </SafeAreaView>
  )
}

export default OptionsScreen