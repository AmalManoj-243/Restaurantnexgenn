import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { RoundedContainer, SafeAreaView } from '@components/containers'
import { NavigationHeader } from '@components/Header'
import SearchContainer from '@components/containers/SearchContainer'

const ProductsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('')
  return (
    <SafeAreaView>
      {/* NavigationHeader component for displaying the screen title and a back button */}
      <NavigationHeader
        title="Products"
        onBackPress={() => navigation.goBack()}
      />
      <SearchContainer placeholder='Search Products' onChangeText={setSearchText} />

      <RoundedContainer>

      </RoundedContainer>
    </SafeAreaView>
  )
}

export default ProductsScreen