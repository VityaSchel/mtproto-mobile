import * as Clipboard from 'expo-clipboard'
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper'
import styles from './styles'

export default function Import(props: { visible: boolean, value: string, setValue: (text: string) => any, onHide: () => any, onDone: () => any }) {
  return (
    <Portal>
      <Dialog visible={props.visible} onDismiss={props.onHide}>
        <Dialog.Title>Import session</Dialog.Title>
        <Dialog.Content>
          <TextInput 
            value={props.value}
            onChangeText={props.setValue}
            multiline
            placeholder={'JSON-deserializable session data. Must contain timeOffset, XauthKey, XserverSalt.'}
            style={{ maxHeight: 500 }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.onDone}>Import</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}