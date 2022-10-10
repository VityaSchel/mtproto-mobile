import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button, Checkbox, Divider, Text, TextInput, TouchableRipple } from 'react-native-paper'
import globalStyles from '../globalStyles'
import styles from './styles'
import UploadWidget from './upload'
import DownloadWidget from './download'

export default function FilesScreen() {
  const [apiID, setApiID] = React.useState('')
  const [apiHash, setApiHash] = React.useState('')
  const navigation = useNavigation()
  const [testClient, setIsTestClient] = React.useState(false)

  const closeScreen = () => {
    navigation.goBack()
  }

  return (
    <ScrollView>
      <View style={globalStyles.view}>
        <Text variant='headlineLarge' style={globalStyles.title}>Files</Text>
        <Text style={{ marginBottom: 20 }}>By the way, most of the code I used here was taken from this awesome repository: https://github.com/VityaSchel/telegram-channel-mirror-mtproto/. Check it out — the person who made it included detailed README with all instructions and wrote code in TypeScript. Also this person is me, which makes this repo even more better!</Text>
        <Divider style={styles.divider} />
        <UploadWidget />
        <Divider style={styles.divider} />
        <DownloadWidget />
        <Divider style={styles.divider} />
        <Button
          mode='contained'
          onPress={closeScreen}
          style={styles.doneButton}
        >Done</Button>
      </View>
    </ScrollView>
  )
}