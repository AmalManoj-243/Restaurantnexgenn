import React from 'react'
import { FlatList } from 'react-native'
import { NavigationHeader } from '@components/Header';
import { RoundedContainer, SafeAreaView } from '@components/containers'
import { ListItem } from '@components/Options';

const OptionsScreen = ({ navigation }) => {
  const options =
    [
      { title: 'Search Products', image: require('@assets/images/Home/options/search_product.png'), onPress: () => navigation.navigate('Products') },
      { title: 'Scan Barcode', image: require('@assets/images/Home/options/scan_barcode.png'), onPress: () => navigation.navigate('ScanBarcode') },
      { title: 'Product Enquiry', image: require('@assets/images/Home/options/product_enquiry.png'), onPress: () => navigation.navigate('') },
      { title: 'Purchase Requisition', image: require('@assets/images/Home/options/product_purchase_requisition.png'), onPress: () => navigation.navigate('') },
      { title: 'Transaction Auditing', image: require('@assets/images/Home/options/transaction_auditing.png'), onPress: () => navigation.navigate('') },
      { title: 'Task Manager', image: require('@assets/images/Home/options/task_manager.png'), onPress: () => navigation.navigate('TaskManagerScreen') },
      { title: 'Market Study', image: require('@assets/images/Home/options/market_study.png'), onPress: () => navigation.navigate('') },
      { title: 'Attendance', image: require('@assets/images/Home/options/attendance_1.png'), onPress: () => navigation.navigate('') }
    ]

  return (
    <SafeAreaView>
      <NavigationHeader
        title="Options"
        onBackPress={() => navigation.goBack()}
      />
      <RoundedContainer>
        <FlatList
          data={options}
          contentContainerStyle={{ margin: 15 }}
          renderItem={({ item }) => (
            <ListItem title={item.title} image={item.image} onPress={item.onPress} />
          )}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
        />

      </RoundedContainer>
    </SafeAreaView>
  )
}

export default OptionsScreen