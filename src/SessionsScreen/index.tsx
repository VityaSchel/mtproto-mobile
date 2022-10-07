import React from 'react'
import { View } from 'react-native'
import { Button, IconButton, List, Text } from 'react-native-paper'
import globalStyles from '../globalStyles'
import { format } from 'date-fns'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { nanoid } from 'nanoid'
import clone from 'just-clone'
import { initializeAPI } from '../mtproto'

type Session = {
  id: string
  createdAt: Date
}

export default function SessionsScreen() {
  const [sessions, setSessions] = React.useState<Session[]>([])
  const navigation = useNavigation()

  const selectSession = async (index: number) => {
    await initializeAPI()
    global.api._mtproto_session_id = sessions[index].id
    navigation.replace('Home')
  }

  const newSession = () => {
    const newSessions = [...sessions, { createdAt: Date.now(), id: nanoid(6) }]
    AsyncStorage.setItem('sessions', JSON.stringify(newSessions))
    setSessions(newSessions)
  }

  const removeSession = async (index: number) => {
    const newSessions = clone(sessions)
    const removedSession = newSessions.splice(index, 1)[0]
    const keys = await AsyncStorage.getAllKeys()
    const targetKeys = keys.filter(k => k.startsWith(`mtproto_data_session${removedSession.id}_`))
    if(targetKeys.length) await AsyncStorage.multiRemove(targetKeys)
    AsyncStorage.setItem('sessions', JSON.stringify(newSessions))
    setSessions(newSessions)
  }

  React.useEffect(() => { 
    checkSettings()
    AsyncStorage.getItem('sessions').then(data => {
      if(data) {
        setSessions(JSON.parse(data))
      }
    })
  }, [])

  const checkSettings = async () => {
    if(
      (await AsyncStorage.getItem('app_api_id')) === null 
      || (await AsyncStorage.getItem('app_api_hash')) === null
    ) {
      navigation.replace('Settings')
    }
  }

  return (
    <View style={globalStyles.view}>
      <View style={globalStyles.centeredView}>
        <Text variant='headlineLarge' style={styles.title}>Sessions</Text>
        {sessions.map((session, index) => (
          <View key={session.id} style={styles.session}>
            <List.Item
              title={`Session #${index + 1} (${session.id})`}
              description={`Created at ${format(session.createdAt, 'd MMMM yyyy, HH:mm')}`}
              left={props => <List.Icon {...props} icon="folder" />}
              style={styles.item}
              onPress={() => selectSession(index)}
            />
            <IconButton 
              icon='close-octagon-outline'
              onPress={() => removeSession(index)}
            />
          </View>
        ))}
        {!sessions.length && <Text style={styles.hint}>Create session to keep your account&apos;s data</Text>}
        {sessions.length < 5 && (
          <Button
            mode='contained'
            onPress={newSession}
          >New session</Button>
        )}
        <Button
          mode='contained-tonal'
          onPress={() => navigation.push('Settings')}
          style={{ marginTop: 10 }}
        >App API settings</Button>
      </View>
    </View>
  )
}