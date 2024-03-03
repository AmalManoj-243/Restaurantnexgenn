import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CustomToast from '@components/Toast/CustomToast';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import StackNavigator from '@navigation/StackNavigator';

export default function App() {
  return (
    
    <GestureHandlerRootView style={{flex:1}}>
      <NavigationContainer>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <StackNavigator />
          </BottomSheetModalProvider>
          <Toast config={CustomToast} />
        </SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
