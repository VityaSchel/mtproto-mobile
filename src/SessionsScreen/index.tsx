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

type Session = {
  id: string
  createdAt: Date
}

export default function SessionsScreen() {
  const [sessions, setSessions] = React.useState<Session[]>([])
  const navigation = useNavigation()

  const selectSession = (index: number) => {
    global.sessionID = sessions[index].id
    navigation.replace('Home')
  }

  const newSession = () => {
    const newSessions = [...sessions, { createdAt: new Date(), id: nanoid(6) }]
    AsyncStorage.setItem('sessions', JSON.stringify(newSessions))
    setSessions(newSessions)
  }

  const removeSession = (index: number) => {
    const newSessions = clone(sessions)
    newSessions.splice(index, 1)
    AsyncStorage.setItem('sessions', JSON.stringify(newSessions))
    setSessions(newSessions)
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
      </View>
    </View>
  )
}