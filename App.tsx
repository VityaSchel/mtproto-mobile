import { SafeAreaView, StyleSheet, View } from 'react-native'
import { MD3DarkTheme, Provider as PaperProvider, Text } from 'react-native-paper'
import * as eva from '@eva-design/eva'
import { ApplicationProvider as UIKittenProvider } from '@ui-kitten/components'
import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import HomeScreen from './src/HomeScreen'
import EditorScreen from './src/ConstructorParams/EditorScreen'
import SessionsScreen from './src/SessionsScreen'
import SettingsScreen from './src/SettingsScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const Stack = createNativeStackNavigator()

export default function Main() {
  return (
    <UIKittenProvider {...eva} theme={eva.dark}>
      <PaperProvider theme={MD3DarkTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <App />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </UIKittenProvider>
  )
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer theme={DarkTheme}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Sessions' component={SessionsScreen} />
            <Stack.Screen name='Settings' component={SettingsScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='ConstructorEditor' component={EditorScreen} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
      <StatusBar style='light' />
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
