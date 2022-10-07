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

const Stack = createNativeStackNavigator()

export default function Main() {
  return (
    <UIKittenProvider {...eva} theme={eva.dark}>
      <PaperProvider theme={MD3DarkTheme}>
        <App />
      </PaperProvider>
    </UIKittenProvider>
  )
}

function App() {
  return (
    <Provider store={store}>
      {/* <SafeAreaView style={styles.container}> */}
        <NavigationContainer theme={DarkTheme}>
          <View style={{flex: 1, backgroundColor: 'black'}}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name='Home' component={HomeScreen} />
              <Stack.Screen name='ConstructorEditor' component={EditorScreen} />
            </Stack.Navigator>
          </View>
        </NavigationContainer>
        <StatusBar style='light' />
      {/* </SafeAreaView> */}
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
