import * as Clipboard from 'expo-clipboard'
import { ToastAndroid } from 'react-native'
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper'
import styles from './styles'

export default function Export(props: { visible: boolean, data: string, onHide: () => any }) {
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.onHide}>
        <Dialog.Title>Session data (export)</Dialog.Title>
        <Dialog.Content>
          <Paragraph selectable style={styles.sessionData}>
            {props.data}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => { 
            Clipboard.setStringAsync(props.data)
            ToastAndroid.show('Copied!', ToastAndroid.SHORT)
            props.onHide()
          }}>Copy</Button>
          <Button onPress={props.onHide}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}