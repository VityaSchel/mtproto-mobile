import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
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
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <MethodInput />
      <StatusBar style='light' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
