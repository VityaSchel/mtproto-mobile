import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { Button, Checkbox, Text, TextInput, TouchableRipple } from 'react-native-paper'
import globalStyles from '../globalStyles'
import styles from './styles'

export default function SettingsScreen() {
  const [apiID, setApiID] = React.useState('')
  const [apiHash, setApiHash] = React.useState('')
  const navigation = useNavigation()
  const [testClient, setIsTestClient] = React.useState(false)

  React.useEffect(() => {
    AsyncStorage.getItem('app_api_id').then(setApiID)
    AsyncStorage.getItem('app_api_hash').then(setApiHash)
    AsyncStorage.getItem('app_api_test').then((data) => setIsTestClient(data === 'true'))
  }, [])

  const changeApiID = (text: string) => {
    AsyncStorage.setItem('app_api_id', text)
    setApiID(text)
  }

  const changeApiHash = (text: string) => {
    AsyncStorage.setItem('app_api_hash', text)
    setApiHash(text)
  }

  const changeApiTest = () => {
    AsyncStorage.setItem('app_api_test', String(!testClient))
    setIsTestClient(!testClient)
  }

  const save = () => {
    navigation.replace('Sessions')
  }

  return (
    <View style={globalStyles.view}>
      <View style={globalStyles.centeredView}>
        <Text variant='headlineLarge' style={styles.title}>Settings</Text>
        <TextInput label='App api_id' value={apiID} onChangeText={changeApiID} style={styles.input} />
        <TextInput label='App api_hash' value={apiHash} onChangeText={changeApiHash} style={styles.input} />
        <View style={styles.rowFlex}>
          <Checkbox status={testClient ? 'checked' : 'unchecked'} onPress={changeApiTest} />
          <TouchableRipple style={{ marginLeft: 10 }} onPress={changeApiTest}>
            <View>
              <Text>Test client</Text>
              <Text>Do not check if you unsure what it is!</Text>
            </View>
          </TouchableRipple>
        </View>
        <Button
          mode='contained'
          onPress={save}
        >Save</Button>
      </View>
    </View>
  )
}