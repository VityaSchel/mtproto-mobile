import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { MD3DarkTheme, Provider as PaperProvider, Text } from 'react-native-paper'
import * as eva from '@eva-design/eva'
import { ApplicationProvider as UIKittenProvider } from '@ui-kitten/components'
import MethodInput from './src/components/MethodInput'

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
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <MethodInput />
        <StatusBar style='light' />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 30,
    paddingTop: 50,
    alignItems: 'center'
  },
})
