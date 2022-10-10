import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { Button, Checkbox, Text, TextInput, TouchableRipple } from 'react-native-paper'
import { Buffer } from 'buffer'

export default function UploadWidget() {
  const selectDocumentForUpload = () => {
    DocumentPicker.getDocumentAsync({}).then(async file => {
      if(file.type === 'cancel') return
      const fileContents = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' })
      const byteArray = Uint8Array.from(Buffer.from(fileContents, 'base64'))
      console.log(byteArray)
    })
  }

  return (
    <Button
      mode='contained'
      onPress={selectDocumentForUpload}
    >
      Upload document
    </Button>
  )
}