import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, View } from 'react-native'
import { Button, Modal, Portal, Text } from 'react-native-paper'
import styles from './styles'
import { useAppDispatch } from '../../redux/store'
import { resetData, setMethod } from '../../redux/slices/request'

export default function TopButtonsRow() {
  const navigation = useNavigation()
  const [visible, setVisible] = React.useState(false)
  const dispatch = useAppDispatch()

  const disconnectAndSwitchSession = () => {
    dispatch(resetData())
    global.api.close()
    navigation.replace('Sessions')
  }

  const hideModal = () => {
    setVisible(false)
  }

  const callAuthSendCode = () => {
    dispatch(setMethod('auth.sendCode'))
    hideModal()
  }

  const callAuthSignIn = () => {
    dispatch(setMethod('auth.signIn'))
    hideModal()
  }

  return (
    <View style={styles.row}>
      <Button
        mode='contained-tonal'
        onPress={() => setVisible(true)}
        style={{ flex: 1 }}
      >
        Templates
      </Button>
      <Portal>
        <Modal 
          visible={visible} 
          onDismiss={hideModal} 
          contentContainerStyle={{ margin: 20, backgroundColor: '#222', padding: 20 }}
        >
          <ScrollView contentContainerStyle={styles.templatesInnerView}>
            <Text variant='headlineLarge' style={styles.title}>Templates</Text>
            <Text variant='headlineSmall' style={styles.title}>Sign in</Text>
            <Text>1. Send code and save <Text style={styles.code}>phone_code_hash</Text>. <Text style={styles.code}>phone_number</Text> must start with &quot;+&quot;</Text>
            <Button mode='contained' style={styles.button} onPress={callAuthSendCode}>Call auth.sendCode</Button>
            <Text>2. Sign in using received code and <Text style={styles.code}>phone_code_hash</Text> from previous step.</Text>
            <Button mode='contained' style={styles.button} onPress={callAuthSignIn}>Call auth.signIn</Button>
            <Text>Most common errors at this moment are <Text style={styles.code}>PHONE_CODE_INVALID</Text> (invalid SMS code), <Text style={styles.code}>SESSION_PASSWORD_NEEDED</Text> (you need to login with 2fa). You may also get successfull response but with <Text style={styles.code}>_: auth.authorizationSignUpRequired</Text> — in that case, you must sign up.</Text>
            <Text variant='headlineSmall' style={styles.title}>2FA</Text>
            <Text>Due to errors in react-native crypto modules (such as pbkdf2) and current implementation of @mtproto/core environment in RN, I&apos;ve decided to not include support for 2FA. You must disable it in account settings in order to sign in with MTProto mobile.</Text>
          </ScrollView>
        </Modal>
      </Portal>
      <Button
        mode='contained-tonal'
        style={{ marginLeft: 5 }}
        onPress={disconnectAndSwitchSession}
      >
        Switch session
      </Button>
    </View>
  )
}