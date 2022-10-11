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
import Export from './Export'
import Import from './Import'

type Session = {
  id: string
  createdAt: number
}

export default function SessionsScreen() {
  const [sessions, setSessions] = React.useState<Session[]>([])
  const navigation = useNavigation()
  const [exportSessionVisible, setExportSessionVisible] = React.useState(false)
  const [sessionDataDialog, setSessionDataDialog] = React.useState('')
  const [importSessionVisible, setImportSessionVisible] = React.useState(false)
  const [importSessionData, setImportSessionData] = React.useState('')

  const selectSession = async (index: number) => {
    await initializeAPI()
    global.api._mtproto_session_id = sessions[index].id
    navigation.replace('Home')
  }

  const newSession = async () => {
    const sessionID = nanoid(6)
    const newSessions = [...sessions, { createdAt: Date.now(), id: sessionID }]
    setSessions(newSessions)
    await AsyncStorage.setItem('sessions', JSON.stringify(newSessions))
    return sessionID
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

  const displaySessionData = async (session: Session) => {
    setExportSessionVisible(true)
    const keys = await AsyncStorage.getAllKeys()
    const prefix = `mtproto_data_session${session.id}_`
    const sessionKeys = keys
      .filter(key => key.startsWith(prefix))
      .map(key => key.substring(prefix.length))
    const data = Object.fromEntries(
      await Promise.all(
        sessionKeys.map(async (sessionKey: string) => {
          return [
            sessionKey,
            await AsyncStorage.getItem(prefix + sessionKey)
          ]
        })
      )
    )
    setSessionDataDialog(JSON.stringify(data))
  }

  const importSession = async () => {
    let sessionData = {}
    try {
      sessionData = JSON.parse(importSessionData)
      if(typeof sessionData !== 'object') throw 'Incorrect type'
    } catch(e) {
      return false
    }
    const sessionID = await newSession()
    const prefix = `mtproto_data_session${sessionID}_`
    for(const [key, val] of Object.entries(sessionData)) {
      await AsyncStorage.setItem(prefix + key, val)
    }
    setImportSessionVisible(false)
    setImportSessionData('')
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
              onLongPress={() => displaySessionData(session)}
            />
            <IconButton 
              icon='close-octagon-outline'
              onPress={() => removeSession(index)}
            />
          </View>
        ))}
        <Text style={{ marginBottom: 10, color: '#555' }}>Long press on any session to view its data</Text>
        <Export visible={exportSessionVisible} data={sessionDataDialog} onHide={() => setExportSessionVisible(false)} />
        {!sessions.length && <Text style={styles.hint}>Create session to keep your account&apos;s data</Text>}
        {sessions.length < 5 && (
          <View style={styles.bottomButtons}>
            <Button
              mode='contained'
              onPress={newSession}
            >
              New session
            </Button>
            <IconButton
              mode='contained'
              icon='database-import-outline'
              size={25}
              onPress={() => setImportSessionVisible(true)}
            />
          </View>
        )}
        <Import 
          visible={importSessionVisible}
          onHide={() => setImportSessionVisible(false)}
          onDone={importSession}
          value={importSessionData}
          setValue={setImportSessionData}
        />
        <Button
          mode='contained-tonal'
          onPress={() => navigation.push('Settings')}
          style={{ marginTop: 10 }}
        >App API settings</Button>
      </View>
    </View>
  )
}